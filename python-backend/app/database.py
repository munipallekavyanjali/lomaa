import logging
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from .config import DATABASE_URL, USE_SQLITE_FALLBACK
from .models import Base, User, Task
from .auth import hash_password

logger = logging.getLogger("uvicorn")

# PostgreSQL Database Engine Setup
try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        echo=False
    )
    # Test connection
    with engine.connect() as conn:
        logger.info(" Connected to PostgreSQL database successfully.")
except Exception as e:
    if USE_SQLITE_FALLBACK:
        logger.warning(f"⚠️ PostgreSQL connection failed: {e}")
        logger.warning("🔄 Falling back to local SQLite database (sqlite:///./tasks.db)...")
        DATABASE_URL = "sqlite:///./tasks.db"
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    else:
        # Keep PostgreSQL engine so error surfaces clearly if DB is not started
        DATABASE_URL = DATABASE_URL
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Dependency that yields a database session and ensures closure."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_database():
    """Initializes tables and seeds initial retro data if empty."""
    try:
        # Create all tables (users, tasks) in PostgreSQL
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables (users, tasks) initialized in PostgreSQL.")

        db = SessionLocal()
        try:
            # 1. Seed demo user if no users exist
            user_count = db.query(User).count()
            demo_user = None

            if user_count == 0:
                logger.info("🌱 Seeding initial demo user 'retro_pilot' in PostgreSQL...")
                demo_user = User(
                    username="retro_pilot",
                    email="pilot@taskflow.dev",
                    password=hash_password("password123"),
                    avatar_color="retro-cyan",
                    created_at=datetime.utcnow()
                )
                db.add(demo_user)
                db.commit()
                db.refresh(demo_user)
                logger.info(f"Demo user created: retro_pilot (ID: {demo_user.id})")
            else:
                demo_user = db.query(User).first()

            # 2. Seed initial tasks if tasks table is empty
            task_count = db.query(Task).count()
            if task_count == 0 and demo_user:
                logger.info("🌱 Seeding initial retro liquid glass tasks in PostgreSQL...")
                today = datetime.utcnow()
                seed_tasks = [
                    Task(
                        user_id=demo_user.id,
                        title="Calibrate Synthwave Audio Oscilloscope",
                        description="Fine-tune the analog frequency filters and audio spectrum analyzer for 80s tape compression.",
                        status="in_progress",
                        priority="high",
                        category="Retro Tech",
                        due_date=(today + timedelta(days=2)).strftime("%Y-%m-%d"),
                        color_tag="retro-sunset"
                    ),
                    Task(
                        user_id=demo_user.id,
                        title="Design Liquid Glass Refraction Shader",
                        description="Implement chromatic dispersion, caustic reflections, and fluid organic border radii in CSS/WebGL.",
                        status="completed",
                        priority="urgent",
                        category="Design",
                        due_date=today.strftime("%Y-%m-%d"),
                        color_tag="retro-violet"
                    ),
                    Task(
                        user_id=demo_user.id,
                        title="Optimize DBeaver PostgreSQL Queries",
                        description="Examine query execution plans in DBeaver and create composite indexes for task filtering.",
                        status="completed",
                        priority="medium",
                        category="Development",
                        due_date=(today - timedelta(days=1)).strftime("%Y-%m-%d"),
                        color_tag="retro-cyan"
                    ),
                    Task(
                        user_id=demo_user.id,
                        title="Digitize Vintage VHS Artwork Archives",
                        description="High-res scan 1984 neon cassette box sleeves and vectorize the holographic typography.",
                        status="pending",
                        priority="low",
                        category="Creative",
                        due_date=(today + timedelta(days=5)).strftime("%Y-%m-%d"),
                        color_tag="retro-gold"
                    ),
                    Task(
                        user_id=demo_user.id,
                        title="Build Realtime Liquid Ripple Feedback",
                        description="Add haptic water drop sound effects and cursor-following viscous wave deformations.",
                        status="in_progress",
                        priority="urgent",
                        category="Development",
                        due_date=(today + timedelta(days=3)).strftime("%Y-%m-%d"),
                        color_tag="retro-mint"
                    ),
                    Task(
                        user_id=demo_user.id,
                        title="Draft Python FastAPI Architecture Roadmap",
                        description="Outline the transition plan for microservices using modern FastAPI and PostgreSQL.",
                        status="pending",
                        priority="medium",
                        category="Work",
                        due_date=(today + timedelta(days=7)).strftime("%Y-%m-%d"),
                        color_tag="retro-coral"
                    )
                ]

                db.add_all(seed_tasks)
                db.commit()
                logger.info(f"✅ Successfully seeded {len(seed_tasks)} tasks into PostgreSQL!")
        finally:
            db.close()
    except Exception as e:
        logger.error(f"❌ Database initialization notice: {e}")
