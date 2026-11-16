from datetime import datetime, timedelta
import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRES_DAYS

security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    """Hashes a password with bcrypt (truncated to 72 bytes max for safety)."""
    pwd_bytes = password[:72].encode('utf-8')
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies plain text password against bcrypt hashed password."""
    try:
        return bcrypt.checkpw(
            plain_password[:72].encode('utf-8'),
            hashed_password.encode('utf-8')
        )
    except Exception:
        return False

def create_access_token(data: dict) -> str:
    """Generates a signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=JWT_EXPIRES_DAYS)
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    """Decodes and validates a JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="JWT token has expired. Please log in again."
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid JWT token."
        )

# Dependency to get current authenticated user payload from JWT token
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access denied. No JWT authorization token provided."
        )

    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload.get("id")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload."
        )

    return payload
