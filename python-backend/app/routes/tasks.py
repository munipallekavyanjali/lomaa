from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, asc
from ..database import get_db
from ..models import Task, User
from ..schemas import TaskCreate, TaskUpdate, TaskStatusUpdate, TaskOut
from ..auth import get_current_user
from ..config import DATABASE_URL

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

# Public DBeaver Connection Guide endpoint
@router.get("/dbeaver-info")
def get_dbeaver_info(db: Session = Depends(get_db)):
    try:
        task_count = db.query(Task).count()
        user_count = db.query(User).count()
    except Exception:
        task_count = 0
        user_count = 0

    return {
        "success": True,
        "databaseType": "PostgreSQL",
        "connectionUrl": DATABASE_URL,
        "host": "localhost",
        "port": 5432,
        "database": "task_management_db",
        "user": "postgres",
        "table": "tasks",
        "rowCount": task_count,
        "userCount": user_count,
        "instructions": [
            "1. Open DBeaver application.",
            "2. Click 'Database' in top menu -> 'New Database Connection' (plug icon).",
            "3. Select 'PostgreSQL' from the database list and click 'Next'.",
            "4. Fill in connection details:",
            "   - Host: localhost",
            "   - Port: 5432",
            "   - Database: task_management_db",
            "   - Username: postgres",
            "   - Password: (your PostgreSQL postgres password)",
            "5. Click 'Test Connection' (DBeaver will download the PostgreSQL JDBC driver if prompted).",
            "6. Click 'Finish'! You can now browse and edit 'users' and 'tasks' tables in DBeaver!"
        ]
    }

# GET /api/tasks/stats (Calculated for current authenticated user)
@router.get("/stats")
def get_task_stats(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user["id"]

    total = db.query(Task).filter(Task.user_id == user_id).count()
    pending = db.query(Task).filter(Task.user_id == user_id, Task.status == "pending").count()
    in_progress = db.query(Task).filter(Task.user_id == user_id, Task.status == "in_progress").count()
    completed = db.query(Task).filter(Task.user_id == user_id, Task.status == "completed").count()
    urgent_or_high = db.query(Task).filter(
        Task.user_id == user_id,
        Task.priority.in_(["high", "urgent"]),
        Task.status != "completed"
    ).count()

    completion_rate = round((completed / total) * 100) if total > 0 else 0

    # Category breakdown
    cat_rows = db.query(Task.category, func.count(Task.id)).filter(
        Task.user_id == user_id
    ).group_by(Task.category).all()

    categories = [{"category": row[0], "count": row[1]} for row in cat_rows]

    return {
        "success": True,
        "data": {
            "total": total,
            "pending": pending,
            "inProgress": in_progress,
            "completed": completed,
            "urgentOrHigh": urgent_or_high,
            "completionRate": completion_rate,
            "categories": categories
        }
    }

# GET /api/tasks (List user tasks with filters & sorting)
@router.get("")
def get_tasks(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sortBy: str = Query("created_at"),
    order: str = Query("DESC"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user["id"]
    query = db.query(Task).filter(Task.user_id == user_id)

    if status and status != "all":
        query = query.filter(Task.status == status)

    if priority and priority != "all":
        query = query.filter(Task.priority == priority)

    if category and category != "all":
        query = query.filter(Task.category == category)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter((Task.title.ilike(term)) | (Task.description.ilike(term)))

    # Safe sorting column
    sort_column = getattr(Task, sortBy, Task.created_at)
    if order.upper() == "ASC":
        query = query.order_by(asc(sort_column))
    else:
        query = query.order_by(desc(sort_column))

    tasks = query.all()

    # Format output dates to ISO string for frontend compatibility
    data = []
    for t in tasks:
        data.append({
            "id": t.id,
            "user_id": t.user_id,
            "title": t.title,
            "description": t.description or "",
            "status": t.status,
            "priority": t.priority,
            "category": t.category,
            "due_date": t.due_date,
            "color_tag": t.color_tag or "retro-violet",
            "created_at": t.created_at.strftime("%Y-%m-%d %H:%M:%S") if isinstance(t.created_at, datetime) else str(t.created_at or ""),
            "updated_at": t.updated_at.strftime("%Y-%m-%d %H:%M:%S") if isinstance(t.updated_at, datetime) else str(t.updated_at or "")
        })

    return {
        "success": True,
        "count": len(data),
        "data": data
    }

# GET /api/tasks/{id}
@router.get("/{task_id}")
def get_task(
    task_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user["id"]).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found."
        )
    return {"success": True, "data": task}

# POST /api/tasks (Create new task)
@router.post("", status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    valid_statuses = ["pending", "in_progress", "completed"]
    valid_priorities = ["low", "medium", "high", "urgent"]

    safe_status = task_in.status if task_in.status in valid_statuses else "pending"
    safe_priority = task_in.priority if task_in.priority in valid_priorities else "medium"

    new_task = Task(
        user_id=current_user["id"],
        title=task_in.title.strip(),
        description=task_in.description.strip() if task_in.description else "",
        status=safe_status,
        priority=safe_priority,
        category=task_in.category.strip() if task_in.category else "General",
        due_date=task_in.due_date,
        color_tag=task_in.color_tag or "retro-violet",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {
        "success": True,
        "message": "Task created successfully",
        "data": {
            "id": new_task.id,
            "user_id": new_task.user_id,
            "title": new_task.title,
            "description": new_task.description,
            "status": new_task.status,
            "priority": new_task.priority,
            "category": new_task.category,
            "due_date": new_task.due_date,
            "color_tag": new_task.color_tag,
            "created_at": new_task.created_at.strftime("%Y-%m-%d %H:%M:%S") if new_task.created_at else None,
            "updated_at": new_task.updated_at.strftime("%Y-%m-%d %H:%M:%S") if new_task.updated_at else None
        }
    }

# PUT /api/tasks/{id} (Update full task)
@router.put("/{task_id}")
def update_task(
    task_id: int,
    task_in: TaskUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user["id"]).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found."
        )

    if task_in.title is not None:
        if not task_in.title.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Title cannot be empty")
        task.title = task_in.title.strip()

    if task_in.description is not None:
        task.description = task_in.description
    if task_in.status is not None:
        task.status = task_in.status
    if task_in.priority is not None:
        task.priority = task_in.priority
    if task_in.category is not None:
        task.category = task_in.category
    if task_in.due_date is not None:
        task.due_date = task_in.due_date
    if task_in.color_tag is not None:
        task.color_tag = task_in.color_tag

    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)

    return {
        "success": True,
        "message": "Task updated successfully",
        "data": {
            "id": task.id,
            "user_id": task.user_id,
            "title": task.title,
            "description": task.description,
            "status": task.status,
            "priority": task.priority,
            "category": task.category,
            "due_date": task.due_date,
            "color_tag": task.color_tag,
            "created_at": task.created_at.strftime("%Y-%m-%d %H:%M:%S") if task.created_at else None,
            "updated_at": task.updated_at.strftime("%Y-%m-%d %H:%M:%S") if task.updated_at else None
        }
    }

# PATCH /api/tasks/{id}/status (Quick status toggle)
@router.patch("/{task_id}/status")
def update_task_status(
    task_id: int,
    status_in: TaskStatusUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    valid_statuses = ["pending", "in_progress", "completed"]
    if status_in.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user["id"]).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found."
        )

    task.status = status_in.status
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)

    return {
        "success": True,
        "message": f"Task status changed to {status_in.status}",
        "data": {
            "id": task.id,
            "status": task.status,
            "updated_at": task.updated_at.strftime("%Y-%m-%d %H:%M:%S") if task.updated_at else None
        }
    }

# DELETE /api/tasks/{id} (Delete task)
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user["id"]).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found."
        )

    db.delete(task)
    db.commit()

    return {
        "success": True,
        "message": "Task deleted successfully",
        "deletedId": task_id
    }
