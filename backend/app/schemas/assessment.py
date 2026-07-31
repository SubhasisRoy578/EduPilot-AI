from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: str

class Quiz(BaseModel):
    topic: str
    questions: List[Question]
    difficulty: Optional[str] = None

class AssessmentCreate(BaseModel):
    topic: str
    stage: Optional[str] = "just_started"

class Answer(BaseModel):
    question_id: int
    selected_option: str

class AssessmentSubmit(BaseModel):
    topic: str
    score: int
    total_questions: int
    stage: Optional[str] = None
    roadmap_id: Optional[int] = None

class AssessmentResponse(BaseModel):
    id: int
    topic: str
    score: int
    total_questions: int
    recommendations: Optional[str] = None
    created_at: datetime
    user_id: int
    roadmap_completed: bool = False

    class Config:
        from_attributes = True
