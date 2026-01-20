from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from routers import auth, users, activities
from database import engine, get_db
from models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title="Visual Bio API",
    description="API for tracking fitness activities and routes",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from config import settings
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["authentication"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(activities.router, prefix=f"{settings.API_V1_STR}/activities", tags=["activities"])


@app.get("/")
def read_root():
    """Root endpoint - API info"""
    return {
        "message": "Visual Bio API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint"""
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "version": "1.0.0",
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")


@app.get(f"{settings.API_V1_STR}/")
def api_info():
    """API information"""
    return {
        "name": "Visual Bio API",
        "version": "1.0.0",
        "endpoints": {
            "auth": f"{settings.API_V1_STR}/auth",
            "users": f"{settings.API_V1_STR}/users",
            "activities": f"{settings.API_V1_STR}/activities",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }