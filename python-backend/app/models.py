from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    avatar_color = Column(String(50), default="retro-cyan")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, default="")
    status = Column(String(50), default="pending", index=True)      # pending, in_progress, completed
    priority = Column(String(50), default="medium", index=True)    # low, medium, high, urgent
    category = Column(String(100), default="General", index=True)  # Work, Design, Retro Tech, etc.
    due_date = Column(String(50), nullable=True)                   # YYYY-MM-DD
    color_tag = Column(String(50), default="retro-violet")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="tasks")
