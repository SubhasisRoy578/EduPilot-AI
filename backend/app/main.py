from fastapi import FastAPI
from app.schemas.user import UserCreate
from app.models.user import User
from app.database.database import SessionLocal
from app.database.database import Base, engine


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduPilot AI API",
    version="1.0.0",
    description="Backend API for EduPilot AI"
)
@app.get("/")
def home():
    return {"message": "EduPilot AI Backend Running"}
@app.post("/register")
def register(user: UserCreate):
    db = SessionLocal()

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=user.password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": "User Registered Successfully",
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
    }
