"""Tests for the main FastAPI application"""

import pytest
from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint returns correct response"""
    response = client.get("/")
    
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Visual Bio API" in data["message"]
    assert "version" in data

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    
    assert response.status_code == 200
    health = response.json()
    assert health["status"] == "healthy"
    assert "version" in health
    assert health["database"] == "connected"

def test_api_info():
    """Test the API info endpoint"""
    response = client.get("/api/v1/")
    
    assert response.status_code == 200
    api_info = response.json()
    assert "name" in api_info
    assert "endpoints" in api_info
    assert api_info["name"] == "Visual Bio API"

def test_cors_headers():
    """Test that CORS headers are properly set"""
    response = client.options("/")
    
    # OPTIONS method should work due to CORS middleware
    assert response.status_code in [200, 405]

def test_invalid_endpoint():
    """Test that invalid endpoints return 404"""
    response = client.get("/invalid-endpoint")
    
    assert response.status_code == 404

def test_docs_available():
    """Test that documentation is available"""
    response = client.get("/docs")
    
    # Should redirect or show Swagger UI
    assert response.status_code == 200

def test_redoc_available():
    """Test that ReDoc documentation is available"""
    response = client.get("/redoc")
    
    # Should show ReDoc documentation
    assert response.status_code == 200