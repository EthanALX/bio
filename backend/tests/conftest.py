"""Test utilities for the backend"""

from typing import Dict, Any
import json

def assert_valid_activity(activity: Dict[str, Any]) -> None:
    """Assert that an activity object has valid structure"""
    required_fields = ["id", "type", "date", "duration", "distance"]
    
    for field in required_fields:
        assert field in activity, f"Missing required field: {field}"
    
    assert isinstance(activity["id"], str), "Activity ID should be a string"
    assert isinstance(activity["type"], str), "Activity type should be a string"
    assert isinstance(activity["date"], str), "Activity date should be a string"
    assert isinstance(activity["duration"], (int, float)), "Activity duration should be numeric"
    assert isinstance(activity["distance"], (int, float)), "Activity distance should be numeric"
    
    valid_types = ["run", "cycle", "swim", "walk", "hike"]
    assert activity["type"] in valid_types, f"Invalid activity type: {activity['type']}"

def create_activity_payload(overrides = None) -> Dict[str, Any]:
    """Create a valid activity payload with optional overrides"""
    default_payload = {
        "type": "run",
        "date": "2024-01-15",
        "duration": 30,
        "distance": 5.0,
        "calories": 300
    }
    
    if overrides:
        default_payload.update(overrides)
    
    return default_payload