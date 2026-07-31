from sqlalchemy import Column, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship
import datetime

from app.database.database import Base

class UserActivity(Base):
    __tablename__ = "user_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, nullable=False, default=datetime.date.today)
    hours = Column(Integer, default=0)

    user = relationship("User", back_populates="activities")
