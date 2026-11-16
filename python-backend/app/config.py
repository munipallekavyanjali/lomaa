import os
from dotenv import load_dotenv

load_dotenv()

# Server Port (default 5000 to match the frontend's API proxy)
PORT = int(os.getenv("PORT", "5000"))
HOST = os.getenv("HOST", "0.0.0.0")

# Database Configuration (PostgreSQL)
# Format: postgresql://<username>:<password>@<host>:<port>/<database_name>
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/task_management_db"
)

# JWT Authentication Configuration
JWT_SECRET = os.getenv("JWT_SECRET", "retro_liquid_glassmorphism_jwt_secret_key_2026_super_secure")
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_DAYS = int(os.getenv("JWT_EXPIRES_DAYS", "7"))

# Smart fallback to SQLite if PostgreSQL service is offline (optional)
USE_SQLITE_FALLBACK = os.getenv("USE_SQLITE_FALLBACK", "false").lower() in ("true", "1", "yes")
