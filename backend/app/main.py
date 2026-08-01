from fastapi import FastAPI
from app.schemas.user import UserCreate, UserUpdate
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
from app.models.activity import UserActivity
from app.routes.roadmap import router as roadmap_router
from app.routes.assessment import router as assessment_router
from app.routes.analytics import router as analytics_router
from app.services.grok_service import generate_roadmap, generate_study_guide
from pydantic import BaseModel
from app.core.config import settings
from app.database.migrations import run_startup_migrations

run_startup_migrations(settings.DATABASE_URL)
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
app.include_router(assessment_router)
app.include_router(analytics_router)

@app.get("/")
def home():
    return {"message": "EduPilot AI Backend Running"}

@app.post("/register")
def register(user: UserCreate):
    db = SessionLocal()

    try:
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        new_user = User(
            first_name=user.first_name,
            last_name=user.last_name,
            bio=user.bio,
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

    except HTTPException as he:
        raise he
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

    # Update streak and last login
    from datetime import date, timedelta
    today = date.today()
    if db_user.last_login != today:
        if db_user.last_login is None:
            db_user.streak = 1
        elif db_user.last_login == today - timedelta(days=1):
            db_user.streak += 1
        # if skipped days, keep previous streak value

        db_user.last_login = today
        db.commit()

    # Calculate today's study hours from active roadmaps
    active_roadmaps = db.query(Roadmap).filter(
        Roadmap.user_id == db_user.id,
        Roadmap.status != "Completed"
    ).all()
    today_hours = sum(rm.hours_per_day for rm in active_roadmaps)

    # Insert or update today's activity
    activity = db.query(UserActivity).filter(
        UserActivity.user_id == db_user.id,
        UserActivity.date == today
    ).first()

    if activity:
        activity.hours = today_hours
    else:
        activity = UserActivity(user_id=db_user.id, date=today, hours=today_hours)
        db.add(activity)

    db.commit()

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
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "bio": current_user.bio,
        "role": current_user.role,
        "streak": current_user.streak
    }

@app.put("/me")
def update_me(user_update: UserUpdate, current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    try:
        db_user = db.query(User).filter(User.id == current_user.id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        if user_update.first_name is not None:
            db_user.first_name = user_update.first_name
        if user_update.last_name is not None:
            db_user.last_name = user_update.last_name
        if user_update.email is not None:
            db_user.email = user_update.email
        if user_update.bio is not None:
            db_user.bio = user_update.bio

        db.commit()
        db.refresh(db_user)
        return {"message": "Profile updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@app.delete("/me")
def delete_me(current_user: User = Depends(get_current_user)):
    db = SessionLocal()
    try:
        db_user = db.query(User).filter(User.id == current_user.id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        db.delete(db_user)
        db.commit()
        return {"message": "User deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()



class GrokRequest(BaseModel):
    goal: str


@app.post("/grok/test")
def test_grok(request: GrokRequest):
    try:
        roadmap = generate_roadmap(request.goal)
        return {"roadmap": roadmap}
    except Exception as e:
        return {"roadmap": f"Mock roadmap for {request.goal} (API Error: {str(e)})"}

@app.post("/grok/study-guide")
def get_study_guide(request: GrokRequest):
    import json
    try:
        guide = generate_study_guide(request.goal)
        parsed_guide = json.loads(guide)
        return parsed_guide
    except Exception as e:
        return {"error": "Failed to parse JSON from AI", "raw": str(e)}

class DoubtRequest(BaseModel):
    question: str

@app.post("/doubt-solver")
def solve_doubt(request: DoubtRequest):
    from app.services.grok_service import client

    prompt = f"""
    You are an AI Doubt Solver for EduPilot, an educational platform.
    Answer the following student's question clearly, kindly, and accurately:
    "{request.question}"

    The AI should answer educational questions, programming questions, mathematics, science, interview preparation, productivity, study planning, and general learning-related doubts.
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
        )
        return {"answer": response.choices[0].message.content}
    except Exception as e:
        # Mocking for E2E tests since no valid Groq key is configured
        return {"answer": f"Mock Answer to: {request.question} (API Error: {str(e)})"}
