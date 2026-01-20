import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import tempfile
import os

# Test database setup
@pytest.fixture(scope="session")
def test_db():
    """Create a temporary database for testing"""
    db_fd, db_path = tempfile.mkstemp()
    engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
    
    yield engine
    
    os.close(db_fd)
    os.unlink(db_path)

@pytest.fixture(scope="session")
def test_client():
    """Create a test client for the FastAPI app"""
    from main import app
    return TestClient(app)

@pytest.fixture
def sample_activity():
    """Sample activity data for testing"""
    return {
        "id": "1",
        "type": "run",
        "date": "2024-01-15",
        "duration": 30,
        "distance": 5.0,
        "calories": 300
    }

@pytest.fixture
def sample_activities():
    """Multiple sample activities for testing"""
    return [
        {
            "id": "1",
            "type": "run",
            "date": "2024-01-15",
            "duration": 30,
            "distance": 5.0,
            "calories": 300
        },
        {
            "id": "2",
            "type": "cycle",
            "date": "2024-01-16",
            "duration": 45,
            "distance": 15.0,
            "calories": 400
        },
        {
            "id": "3",
            "type": "swim",
            "date": "2024-01-17",
            "duration": 60,
            "distance": 2.0,
            "calories": 500
        }
    ]