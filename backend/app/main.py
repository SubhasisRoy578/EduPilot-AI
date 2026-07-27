from fastapi import FastAPI
from app.schemas.user import UserCreate
from app.models.user import User
from app.database.database import SessionLocal
from app.database.database import Base, engine
from app.utils.security import hash_password
from app.schemas.token import LoginRequest
from app.auth.jwt_handler import create_access_token
from app.utils.security import verify_password
from app.auth.auth_handler import get_current_user
from fastapi import Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.roadmap import Roadmap
from app.routes.roadmap import router as roadmap_router
from app.services.grok_service import generate_roadmap
from pydantic import BaseModel

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EduPilot AI API",
    version="1.0.0",
    description="Backend API for EduPilot AI"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(roadmap_router)
@app.get("/")
def home():
    return {"message": "EduPilot AI Backend Running"}

@app.post("/register")
def register(user: UserCreate):
    db = SessionLocal()

    try:
        new_user = User(
            name=user.name,
            email=user.email,
            hashed_password=hash_password(user.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User Registered Successfully",
            "id": new_user.id
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()

@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    db = SessionLocal()

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid email")

    if not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid password")

    access_token = create_access_token(
        data={"sub": db_user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }



class GrokRequest(BaseModel):
    goal: str


@app.post("/grok/test")
def test_grok(request: GrokRequest):
    roadmap = generate_roadmap(request.goal)
    return {"roadmap": roadmap}
"""
@app.post("/register")
def register(user: UserCreate):
    db = SessionLocal()

    try:
        new_user = User(
            name=user.name,
            email=user.email,
            hashed_password=hash_password(user.password)
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

    except Exception as e:
        db.rollback()
        print("ERROR:", repr(e))
        raise

    finally:
        db.close()
"""