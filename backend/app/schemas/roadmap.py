from pydantic import BaseModel
from typing import Optional
from datetime import date

class RoadmapCreate(BaseModel):
    title: str
    description: str
    hours_per_day: int = 0

class RoadmapResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    hours_per_day: int

    completed_milestones: int = 0
    completed_weeks: int = 0
    total_weeks: int = 8
    last_learned_date: Optional[date] = None

    class Config:
        from_attributes = True

class RoadmapUpdate(BaseModel):
    status: str
