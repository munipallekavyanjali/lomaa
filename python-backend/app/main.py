import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import PORT, HOST, DATABASE_URL
from .database import init_database
from .routes import auth, tasks

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables and seed initial demo data
    print("\n======================================================")
    print("  RETRO LIQUID GLASS TASK MANAGEMENT (FASTAPI + POSTGRES)")
    print("======================================================")
    print(f"🚀 FastAPI server initializing on port {PORT}...")
    print(f"🗄️ Target Database: {DATABASE_URL}")
    print("======================================================\n")

    init_database()
    yield
    print("FastAPI server shutting down...")

app = FastAPI(
    title="Chroma • Liquid Glassmorphism Retro Task Management API",
    description="Python FastAPI backend powered by PostgreSQL and JWT Authentication",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom exception handler to match frontend's expected error format
@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "message": exc.detail}
    )

# Include API Routers
app.include_router(auth.router)
app.include_router(tasks.router)

# Health Check & Root
@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Retro Liquid Glassmorphism Task Management API (Python FastAPI)",
        "database": {
            "type": "PostgreSQL",
            "url": DATABASE_URL
        }
    }

@app.get("/")
def root():
    return {
        "name": "Chroma Liquid Retro Task API",
        "framework": "FastAPI (Python)",
        "database": "PostgreSQL",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=HOST, port=PORT, reload=True)
