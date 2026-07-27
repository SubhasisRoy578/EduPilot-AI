from pydantic import BaseModel

class RoadmapCreate(BaseModel):
    title: str
    description: str

class RoadmapResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str

    class Config:
        from_attributes = True

class RoadmapUpdate(BaseModel):
    status: str