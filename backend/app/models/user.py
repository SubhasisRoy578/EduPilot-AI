from sqlalchemy import Column, Integer, String

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

    roadmaps = relationship("Roadmap", back_populates="user", cascade="all, delete-orphan")
    assessments = relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
