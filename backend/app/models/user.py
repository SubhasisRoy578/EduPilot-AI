from sqlalchemy import Column, Integer, String

from app.database.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True)

    hashed_password = Column(String)

    role = Column(String, default="student")

    roadmaps = relationship("Roadmap", back_populates="user")
    assessments = relationship("Assessment", back_populates="user")