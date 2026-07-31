from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database.database import Base

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String)
    status = Column(String, default="Not Started")

    # NEW FIELDS
    hours_per_day = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # New Milestone & Progress fields
    completed_milestones = Column(Integer, default=0)
    completed_weeks = Column(Integer, default=0)
    total_weeks = Column(Integer, default=8)
    last_learned_date = Column(Date, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="roadmaps")
