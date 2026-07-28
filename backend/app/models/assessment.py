from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime

from app.database.database import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    recommendations = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User", back_populates="assessments")
