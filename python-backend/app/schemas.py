from typing import Optional, List, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# ----------------- User Schemas -----------------
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    avatar_color: Optional[str] = "retro-cyan"

class UserLogin(BaseModel):
    identifier: str  # Can be username or email
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    avatar_color: Optional[str] = "retro-cyan"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    success: bool = True
    message: str
    token: str
    user: UserOut

# ----------------- Task Schemas -----------------
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = ""
    status: Optional[str] = "pending"
    priority: Optional[str] = "medium"
    category: Optional[str] = "General"
    due_date: Optional[str] = None
    color_tag: Optional[str] = "retro-violet"

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[str] = None
    color_tag: Optional[str] = None

class TaskStatusUpdate(BaseModel):
    status: str

class TaskOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    title: str
    description: Optional[str] = ""
    status: str
    priority: str
    category: str
    due_date: Optional[str] = None
    color_tag: Optional[str] = "retro-violet"
    created_at: Optional[Any] = None
    updated_at: Optional[Any] = None

    class Config:
        from_attributes = True

# Standard Generic API Response Wrappers (Matches frontend expectations)
class ApiResponse(BaseModel):
    success: bool = True
    message: Optional[str] = None
    data: Optional[Any] = None
    count: Optional[int] = None
