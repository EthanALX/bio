from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import ActivityType


class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None


class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ActivityRouteCoordinate(BaseModel):
    lat: float
    lng: float
    elevation: Optional[float] = None
    timestamp: Optional[datetime] = None


class ActivityBase(BaseModel):
    date: datetime
    distance: float  # in km
    pace: Optional[str] = None  # e.g., "5'20\"/km"
    bpm: Optional[int] = None  # heart rate
    time: Optional[str] = None  # duration, e.g., "1h 23m"
    route: Optional[str] = None  # route name
    activity_type: ActivityType
    coordinates: Optional[List[ActivityRouteCoordinate]] = []


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    date: Optional[datetime] = None
    distance: Optional[float] = None
    pace: Optional[str] = None
    bpm: Optional[int] = None
    time: Optional[str] = None
    route: Optional[str] = None
    activity_type: Optional[ActivityType] = None
    coordinates: Optional[List[ActivityRouteCoordinate]] = []


class Activity(ActivityBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ActivityStats(BaseModel):
    Distance: float  # in km
    Days: int
    AvgPace: str
    Routes: int


class YearData(BaseModel):
    year: int
    stats: ActivityStats
    activities: List[Activity]


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None