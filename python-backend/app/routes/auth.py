from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserRegister, UserLogin, UserOut, AuthResponse
from ..auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    clean_username = user_in.username.strip().lower()
    clean_email = user_in.email.strip().lower()

    # Check if username or email already exists
    existing = db.query(User).filter(
        (User.username == clean_username) | (User.email == clean_email)
    ).first()

    if existing:
        field = "Username" if existing.username == clean_username else "Email"
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{field} is already registered."
        )

    # Hash password and save
    hashed = hash_password(user_in.password)
    new_user = User(
        username=clean_username,
        email=clean_email,
        password=hashed,
        avatar_color=user_in.avatar_color or "retro-cyan"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email
    })

    return {
        "success": True,
        "message": "Retro account created successfully!",
        "token": token,
        "user": new_user
    }

@router.post("/login", response_model=AuthResponse)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    identifier = login_in.identifier.strip().lower()
    user = db.query(User).filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    if not user or not verify_password(login_in.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password."
        )

    token = create_access_token({
        "id": user.id,
        "username": user.username,
        "email": user.email
    })

    return {
        "success": True,
        "message": "Welcome back to the retro liquid stream!",
        "token": token,
        "user": user
    }

@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == current_user["id"]).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )
    return {
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "avatar_color": user.avatar_color,
            "created_at": user.created_at.isoformat() if user.created_at else None
        }
    }

@router.get("/demo")
def get_demo():
    return {
        "success": True,
        "demo": {
            "username": "retro_pilot",
            "email": "pilot@taskflow.dev",
            "password": "password123"
        }
    }
