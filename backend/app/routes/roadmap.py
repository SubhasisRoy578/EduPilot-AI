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