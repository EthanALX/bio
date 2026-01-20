from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import List, Optional
from datetime import datetime, date
from schemas import Activity, ActivityCreate, ActivityUpdate, ActivityStats, YearData
from models import Activity as ActivityModel, ActivityRoute as ActivityRouteModel, User as UserModel
from database import get_db
from auth import get_current_active_user

router = APIRouter()


def format_pace(distance_km: float, time_seconds: int) -> str:
    """Calculate and format pace from distance and time."""
    if distance_km == 0:
        return "0'00\"/km"
    
    pace_seconds_per_km = time_seconds / distance_km
    minutes = int(pace_seconds_per_km // 60)
    seconds = int(pace_seconds_per_km % 60)
    return f"{minutes}'{seconds:02d}\"/km"


def format_time_from_seconds(seconds: int) -> str:
    """Format duration from seconds to human readable format."""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    
    if hours > 0:
        return f"{hours}h {minutes}m"
    elif minutes > 0:
        return f"{minutes}m {secs}s"
    else:
        return f"{secs}s"


@router.post("/", response_model=Activity, status_code=status.HTTP_201_CREATED)
def create_activity(
    activity: ActivityCreate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new activity."""
    # Calculate pace if not provided
    if not activity.pace and activity.time:
        # Try to parse time string to seconds (simplified)
        time_seconds = 0
        if "h" in activity.time:
            parts = activity.time.replace("h", "").replace("m", "").split()
            if len(parts) >= 1:
                time_seconds += int(parts[0]) * 3600
            if len(parts) >= 2:
                time_seconds += int(parts[1]) * 60
        else:
            # Assume minutes format like "30m"
            time_str = activity.time.replace("m", "").replace("s", "")
            time_seconds = int(float(time_str)) * 60
        
        activity.pace = format_pace(activity.distance, time_seconds)
    
    db_activity = ActivityModel(
        user_id=current_user.id,
        date=activity.date,
        distance=activity.distance,
        pace=activity.pace,
        bpm=activity.bpm,
        time=activity.time,
        route=activity.route,
        activity_type=activity.activity_type
    )
    
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    
    # Add route coordinates if provided
    if activity.coordinates:
        for i, coord in enumerate(activity.coordinates):
            route_coord = ActivityRouteModel(
                activity_id=db_activity.id,
                latitude=coord.lat,
                longitude=coord.lng,
                elevation=coord.elevation,
                timestamp=coord.timestamp,
                order_index=i
            )
            db.add(route_coord)
        
        db.commit()
        db.refresh(db_activity)
    
    return db_activity


@router.get("/", response_model=List[Activity])
def read_activities(
    skip: int = 0,
    limit: int = 100,
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    activity_type: Optional[str] = Query(None),
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's activities with optional filtering."""
    query = db.query(ActivityModel).filter(ActivityModel.user_id == current_user.id)
    
    # Apply filters
    if year:
        query = query.filter(extract('year', ActivityModel.date) == year)
    
    if month:
        query = query.filter(extract('month', ActivityModel.date) == month)
    
    if activity_type:
        query = query.filter(ActivityModel.activity_type == activity_type)
    
    activities = query.offset(skip).limit(limit).all()
    return activities


@router.get("/{activity_id}", response_model=Activity)
def read_activity(
    activity_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific activity."""
    activity = db.query(ActivityModel).filter(
        ActivityModel.id == activity_id,
        ActivityModel.user_id == current_user.id
    ).first()
    
    if activity is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return activity


@router.put("/{activity_id}", response_model=Activity)
def update_activity(
    activity_id: int,
    activity_update: ActivityUpdate,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update an activity."""
    db_activity = db.query(ActivityModel).filter(
        ActivityModel.id == activity_id,
        ActivityModel.user_id == current_user.id
    ).first()
    
    if db_activity is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    update_data = activity_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field != "coordinates":
            setattr(db_activity, field, value)
    
    db.commit()
    db.refresh(db_activity)
    
    # Update coordinates if provided
    if "coordinates" in update_data:
        # Remove existing coordinates
        db.query(ActivityRouteModel).filter(
            ActivityRouteModel.activity_id == activity_id
        ).delete()
        
        # Add new coordinates
        if activity_update.coordinates:
            for i, coord in enumerate(activity_update.coordinates):
                route_coord = ActivityRouteModel(
                    activity_id=activity_id,
                    latitude=coord.lat,
                    longitude=coord.lng,
                    elevation=coord.elevation,
                    timestamp=coord.timestamp,
                    order_index=i
                )
                db.add(route_coord)
        
        db.commit()
        db.refresh(db_activity)
    
    return db_activity


@router.delete("/{activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_activity(
    activity_id: int,
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete an activity."""
    db_activity = db.query(ActivityModel).filter(
        ActivityModel.id == activity_id,
        ActivityModel.user_id == current_user.id
    ).first()
    
    if db_activity is None:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    db.delete(db_activity)
    db.commit()


@router.get("/stats/overview", response_model=ActivityStats)
def get_activity_stats(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get activity statistics for the current user."""
    activities = db.query(ActivityModel).filter(ActivityModel.user_id == current_user.id)
    
    # Basic stats
    total_distance = activities.with_entities(func.sum(ActivityModel.distance)).scalar() or 0
    total_activities = activities.count()
    
    # Count unique routes
    unique_routes = activities.with_entities(func.count(func.distinct(ActivityModel.route))).scalar() or 0
    
    # Calculate average pace (simplified - taking the most recent pace)
    latest_activity = activities.order_by(ActivityModel.date.desc()).first()
    avg_pace = latest_activity.pace if latest_activity else "0'00\"/km"
    
    # Count unique days with activities
    unique_days = activities.with_entities(
        func.count(func.distinct(func.date(ActivityModel.date)))
    ).scalar() or 0
    
    return ActivityStats(
        Distance=total_distance,
        Days=unique_days,
        AvgPace=avg_pace,
        Routes=unique_routes
    )


@router.get("/stats/yearly", response_model=List[YearData])
def get_yearly_stats(
    current_user: UserModel = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get yearly statistics with activities grouped by year."""
    # Get all years with activities
    years_with_activities = db.query(
        extract('year', ActivityModel.date).label('year')
    ).filter(
        ActivityModel.user_id == current_user.id
    ).distinct().all()
    
    year_data_list = []
    
    for year_record in years_with_activities:
        year = int(year_record.year)
        
        # Get activities for this year
        year_activities = db.query(ActivityModel).filter(
            ActivityModel.user_id == current_user.id,
            extract('year', ActivityModel.date) == year
        ).all()
        
        # Calculate stats for this year
        total_distance = sum(a.distance for a in year_activities)
        unique_routes = len(set(a.route for a in year_activities if a.route))
        unique_days = len(set(a.date.date() for a in year_activities))
        
        # Get average pace from latest activity
        latest_activity = max(year_activities, key=lambda x: x.date) if year_activities else None
        avg_pace = latest_activity.pace if latest_activity else "0'00\"/km"
        
        stats = ActivityStats(
            Distance=total_distance,
            Days=unique_days,
            AvgPace=avg_pace,
            Routes=unique_routes
        )
        
        year_data = YearData(
            year=year,
            stats=stats,
            activities=year_activities
        )
        
        year_data_list.append(year_data)
    
    # Sort by year descending
    year_data_list.sort(key=lambda x: x.year, reverse=True)
    return year_data_list