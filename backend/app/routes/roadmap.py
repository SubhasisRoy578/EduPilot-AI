from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.roadmap import Roadmap
from app.models.user import User
from app.schemas.roadmap import (
    RoadmapCreate,
    RoadmapResponse,
    RoadmapUpdate
)
from app.auth.auth_handler import get_current_user

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])

@router.post("/create", response_model=RoadmapResponse)
def create_roadmap(
    roadmap: RoadmapCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_roadmap = Roadmap(
    title=roadmap.title,
    description=roadmap.description,
    hours_per_day=roadmap.hours_per_day,
    user_id=current_user.id
    )
    db.add(new_roadmap)
    db.commit()
    db.refresh(new_roadmap)

    return new_roadmap


@router.get("/my", response_model=list[RoadmapResponse])
def get_my_roadmaps(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmaps = db.query(Roadmap).filter(
        Roadmap.user_id == current_user.id
    ).all()

    return roadmaps

@router.get("/{roadmap_id}", response_model=RoadmapResponse)
def get_roadmap(
    roadmap_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == current_user.id
    ).first()

    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    return roadmap

@router.put("/{roadmap_id}", response_model=RoadmapResponse)
def update_roadmap_status(
    roadmap_id: int,
    roadmap: RoadmapUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == current_user.id
    ).first()

    if not db_roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    db_roadmap.status = roadmap.status

    db.commit()
    db.refresh(db_roadmap)

    return db_roadmap

@router.delete("/{roadmap_id}")
def delete_roadmap(
    roadmap_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == current_user.id
    ).first()

    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    db.delete(roadmap)
    db.commit()

    return {"message": "Roadmap deleted successfully"}
from datetime import date, timedelta
from app.models.activity import UserActivity

@router.post("/{roadmap_id}/learn-today")
def learn_today(
    roadmap_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    roadmap = db.query(Roadmap).filter(
        Roadmap.id == roadmap_id,
        Roadmap.user_id == current_user.id
    ).first()

    if not roadmap:
        raise HTTPException(status_code=404, detail="Roadmap not found")

    today = date.today()

    if roadmap.last_learned_date == today:
        raise HTTPException(status_code=400, detail="Already claimed today's lesson for this roadmap")

    roadmap.last_learned_date = today
    # Update roadmap progress
    if roadmap.completed_weeks < roadmap.total_weeks:
       roadmap.completed_weeks += 1

    roadmap.completed_milestones = roadmap.completed_weeks

    if roadmap.completed_weeks >= roadmap.total_weeks:
        roadmap.status = "Completed"

    # Update activity
    activity = db.query(UserActivity).filter(
        UserActivity.user_id == current_user.id,
        UserActivity.date == today
    ).first()

    hours = roadmap.hours_per_day
    if hours == 0:
        hours = 2 # default if 0

    if activity:
        activity.hours += hours
    else:
        activity = UserActivity(user_id=current_user.id, date=today, hours=hours)
        db.add(activity)

    # Update streak if needed
    if current_user.last_login != today:
        if current_user.last_login == today - timedelta(days=1):
            current_user.streak += 1
        elif current_user.last_login is None or current_user.last_login < today - timedelta(days=1):
            current_user.streak = 1
        current_user.last_login = today
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)

    return {
    "message": "Lesson claimed successfully",
    "completed_weeks": roadmap.completed_weeks,
    "completed_milestones": roadmap.completed_milestones,
    "hours_added": hours
    }
