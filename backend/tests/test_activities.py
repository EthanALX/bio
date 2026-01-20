"""Tests for the activities endpoints"""

import pytest
from fastapi.testclient import TestClient
import sys
import os
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app
from tests.conftest import assert_valid_activity, create_activity_payload

client = TestClient(app)

def test_get_activities_unauthorized():
    """Test getting activities without authentication should fail"""
    response = client.get("/api/v1/activities")
    
    # Should fail without authentication
    assert response.status_code == 401

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    
    assert response.status_code == 200
    health = response.json()
    assert health["status"] == "healthy"
    assert "version" in health
    assert health["database"] == "connected"

def test_create_user():
    """Test creating a new user"""
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    user_data = {
        "email": f"test_{unique_id}@example.com",
        "username": f"testuser_{unique_id}",
        "full_name": "Test User",
        "password": "test123"
    }
    
    response = client.post("/api/v1/users/", json=user_data)
    
    assert response.status_code == 201
    user = response.json()
    assert user["email"] == user_data["email"]
    assert user["username"] == user_data["username"]
    assert user["full_name"] == user_data["full_name"]
    assert user["is_active"] is True
    assert "id" in user
    assert "hashed_password" not in user  # Should not return password

def test_user_login():
    """Test user authentication"""
    # First create a user to login
    import uuid
    unique_id = str(uuid.uuid4())[:8]
    user_data = {
        "email": f"login_test_{unique_id}@example.com",
        "username": f"logintest_{unique_id}",
        "full_name": "Login Test User",
        "password": "test123"
    }
    
    response = client.post("/api/v1/users/", json=user_data)
    assert response.status_code == 201
    
    login_data = {
        "username": f"logintest_{unique_id}",
        "password": "test123"
    }
    
    response = client.post("/api/v1/auth/login", data=login_data)
    
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
    return token_data["access_token"]

def test_create_activity():
    """Test creating a new activity with authentication"""
    # First login to get token
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    
    activity_data = {
        "date": "2024-01-15T10:00:00",
        "distance": 5.0,
        "pace": "5'20\"/km",
        "bpm": 150,
        "time": "26m 40s",
        "route": "Morning Run",
        "activity_type": "run",
        "coordinates": [
            {"lat": 40.7128, "lng": -74.0060},
            {"lat": 40.7138, "lng": -74.0050}
        ]
    }
    
    response = client.post("/api/v1/activities/", json=activity_data, headers=headers)
    
    assert response.status_code == 201
    activity = response.json()
    assert activity["distance"] == activity_data["distance"]
    assert activity["pace"] == activity_data["pace"]
    assert activity["activity_type"] == activity_data["activity_type"]
    assert activity["route"] == activity_data["route"]
    assert "id" in activity
    return activity

def test_get_activities_authenticated():
    """Test getting activities with authentication"""
    # First login to get token
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create an activity first
    test_create_activity()
    
    response = client.get("/api/v1/activities/", headers=headers)
    
    assert response.status_code == 200
    activities = response.json()
    assert isinstance(activities, list)
    assert len(activities) >= 1
    
    for activity in activities:
        assert_valid_activity(activity)

def test_get_activity_by_id():
    """Test getting a specific activity"""
    # First login to get token
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create an activity first
    created_activity = test_create_activity()
    activity_id = created_activity["id"]
    
    response = client.get(f"/api/v1/activities/{activity_id}", headers=headers)
    
    assert response.status_code == 200
    activity = response.json()
    assert_valid_activity(activity)
    assert activity["id"] == activity_id
    assert activity["activity_type"] == "run"

def test_get_nonexistent_activity():
    """Test getting a non-existent activity"""
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/v1/activities/999999", headers=headers)
    
    assert response.status_code == 404
    assert "Activity not found" in response.json()["detail"]

def test_update_activity():
    """Test updating an activity"""
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create an activity first
    created_activity = test_create_activity()
    activity_id = created_activity["id"]
    
    # Update data
    update_data = {
        "distance": 6.0,
        "route": "Updated Morning Run"
    }
    
    response = client.put(f"/api/v1/activities/{activity_id}", json=update_data, headers=headers)
    
    assert response.status_code == 200
    updated_activity = response.json()
    assert updated_activity["distance"] == 6.0
    assert updated_activity["route"] == "Updated Morning Run"

def test_delete_activity():
    """Test deleting an activity"""
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create an activity first
    created_activity = test_create_activity()
    activity_id = created_activity["id"]
    
    response = client.delete(f"/api/v1/activities/{activity_id}", headers=headers)
    
    assert response.status_code == 204
    
    # Verify it's deleted
    response = client.get(f"/api/v1/activities/{activity_id}", headers=headers)
    assert response.status_code == 404

def test_get_activity_stats():
    """Test getting activity statistics"""
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create an activity first
    test_create_activity()
    
    response = client.get("/api/v1/activities/stats/overview", headers=headers)
    
    assert response.status_code == 200
    stats = response.json()
    
    required_fields = ["Distance", "Days", "AvgPace", "Routes"]
    
    for field in required_fields:
        assert field in stats
        if field != "AvgPace":
            assert isinstance(stats[field], (int, float))
        else:
            assert isinstance(stats[field], str)

def test_get_yearly_stats():
    """Test getting yearly statistics"""
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create an activity first
    test_create_activity()
    
    response = client.get("/api/v1/activities/stats/yearly", headers=headers)
    
    assert response.status_code == 200
    yearly_data = response.json()
    assert isinstance(yearly_data, list)
    
    if len(yearly_data) > 0:
        year_entry = yearly_data[0]
        assert "year" in year_entry
        assert "stats" in year_entry
        assert "activities" in year_entry
        
        # Check stats structure
        stats = year_entry["stats"]
        for field in ["Distance", "Days", "AvgPace", "Routes"]:
            assert field in stats

def test_create_activity_invalid_data():
    """Test creating an activity with invalid data"""
    token = test_user_login()
    headers = {"Authorization": f"Bearer {token}"}
    
    invalid_activity = {
        "activity_type": "run",
        # Missing required fields like distance
    }
    
    response = client.post("/api/v1/activities/", json=invalid_activity, headers=headers)
    
    # Should return validation error
    assert response.status_code == 422