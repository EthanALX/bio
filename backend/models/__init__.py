from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()


class ActivityType(str, enum.Enum):
    RUN = "run"
    WORKOUT = "workout"
    CYCLING = "cycling"


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    activities = relationship("Activity", back_populates="user")


class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    distance = Column(Float, nullable=False)  # in km
    pace = Column(String)  # e.g., "5'20\"/km"
    bpm = Column(Integer)  # heart rate
    time = Column(String)  # duration, e.g., "1h 23m"
    route = Column(String)  # route name
    activity_type = Column(Enum(ActivityType), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="activities")
    route_coordinates = relationship("ActivityRoute", back_populates="activity", cascade="all, delete-orphan")


class ActivityRoute(Base):
    __tablename__ = "activity_routes"
    
    id = Column(Integer, primary_key=True, index=True)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float)  # in meters
    timestamp = Column(DateTime(timezone=True))  # for GPX track points
    order_index = Column(Integer, default=0)  # for ordering points
    
    # Relationships
    activity = relationship("Activity", back_populates="route_coordinates")