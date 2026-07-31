from pydantic import BaseModel

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

    class Config:
        from_attributes = True

class RoadmapUpdate(BaseModel):
    status: str