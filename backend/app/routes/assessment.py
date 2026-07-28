from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.database.database import get_db
from app.models.assessment import Assessment
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

@router.post("/generate", response_model=Quiz)
def create_assessment_quiz(
    request: AssessmentCreate,
    current_user: User = Depends(get_current_user)
):
    try:
        quiz_json_str = generate_quiz(request.topic)
        # Parse the JSON string from LLM
        quiz_data = json.loads(quiz_json_str)
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
    db.commit()
    db.refresh(new_assessment)

    return new_assessment

@router.get("/history", response_model=list[AssessmentResponse])
def get_assessment_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assessments = db.query(Assessment).filter(
        Assessment.user_id == current_user.id
    ).order_by(Assessment.created_at.desc()).all()

    return assessments
