from sqlalchemy import Column, Integer, String

from app.database.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    settings = Column(String, nullable=True) # JSON stored as string for simplicity

    email = Column(String, unique=True, index=True)

    hashed_password = Column(String)

    role = Column(String, default="student")

    roadmaps = relationship("Roadmap", back_populates="user")
    assessments = relationship("Assessment", back_populates="user")
