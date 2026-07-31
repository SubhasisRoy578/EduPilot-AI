from sqlalchemy import Column, Integer, String, Date

from app.database.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    bio = Column(String, nullable=True)

    email = Column(String, unique=True, index=True)

    hashed_password = Column(String)

    role = Column(String, default="student")
    streak = Column(Integer, default=0)
    last_login = Column(Date, nullable=True)

    roadmaps = relationship("Roadmap", back_populates="user", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("UserActivity", back_populates="user", cascade="all, delete-orphan")
