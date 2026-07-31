from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.database.database import get_db
from app.models.assessment import Assessment
from app.models.roadmap import Roadmap
from app.models.user import User
from app.schemas.assessment import (
    AssessmentCreate,
    AssessmentSubmit,
    AssessmentResponse,
    Quiz
)
from app.auth.auth_handler import get_current_user
from app.services.grok_service import generate_quiz, generate_recommendations

router = APIRouter(prefix="/assessment", tags=["Assessment"])

# Maps the user's learning stage to a quiz difficulty level
STAGE_DIFFICULTY = {
    "just_started": "easy",
    "mediocre": "medium",
    "almost_complete": "hard",
    "completed": "expert",
}

@router.post("/generate", response_model=Quiz)
def create_assessment_quiz(
    request: AssessmentCreate,
    current_user: User = Depends(get_current_user)
):
    try:
        difficulty = STAGE_DIFFICULTY.get(request.stage or "just_started", "easy")
        quiz_json_str = generate_quiz(request.topic, difficulty)
        # Parse the JSON string from LLM
        quiz_data = json.loads(quiz_json_str)
        quiz_data["difficulty"] = difficulty
        return Quiz(**quiz_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")

@router.post("/submit", response_model=AssessmentResponse)
def submit_assessment(
    request: AssessmentSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        recommendations = generate_recommendations(request.topic, request.score, request.total_questions)
    except Exception as e:
        recommendations = f"Failed to generate recommendations: {str(e)}"

    new_assessment = Assessment(
        topic=request.topic,
        score=request.score,
        total_questions=request.total_questions,
        recommendations=recommendations,
        user_id=current_user.id
    )

    db.add(new_assessment)


    # If the user said they Completed Learning and scored 90% or above,
    # automatically mark the linked roadmap as Completed.
    roadmap_completed = False
    if request.roadmap_id is not None and request.total_questions > 0:
        db_roadmap = db.query(Roadmap).filter(
            Roadmap.id == request.roadmap_id,
            Roadmap.user_id == current_user.id
        ).first()

        if db_roadmap:
            pass_ratio = request.score / request.total_questions
            if request.stage == "just_started" and pass_ratio >= 0.5:
                db_roadmap.completed_weeks = max(db_roadmap.completed_weeks or 0, 1)
            elif request.stage == "mediocre" and pass_ratio >= 0.5:
                db_roadmap.completed_weeks = max(db_roadmap.completed_weeks or 0, 3)
            elif request.stage == "almost_complete" and pass_ratio >= 0.5:
                db_roadmap.completed_weeks = max(db_roadmap.completed_weeks or 0, 5)
            elif request.stage == "completed" and pass_ratio >= 0.9:
                db_roadmap.completed_weeks = db_roadmap.total_weeks or 8
                if db_roadmap.status != "Completed":
                    db_roadmap.status = "Completed"
                    roadmap_completed = True


    db.commit()
    db.refresh(new_assessment)

    response = AssessmentResponse.model_validate(new_assessment)
    response.roadmap_completed = roadmap_completed
    return response

@router.get("/history", response_model=list[AssessmentResponse])
def get_assessment_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessments = db.query(Assessment).filter(
        Assessment.user_id == current_user.id
    ).order_by(Assessment.created_at.desc()).all()

    return assessments
