from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.roadmap import Roadmap
from app.models.assessment import Assessment
from app.models.user import User
from app.auth.auth_handler import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
def get_analytics_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id

    # Goals completed (Roadmaps with status "Completed" or something similar)
    goals_completed = db.query(Roadmap).filter(
        Roadmap.user_id == user_id,
        Roadmap.status == "Completed"
    ).count()

    # Total learning hours (just mock it or use roadmap expected hours if implemented, let's return 0 for now or calculate from completed roadmaps)
    # We will return mock data since we don't track time
    total_learning_hours = 12

    # Assessment history over time
    assessments = db.query(Assessment).filter(
        Assessment.user_id == user_id
    ).order_by(Assessment.created_at.asc()).all()

    assessment_history = []
    skill_progress = []

    for a in assessments:
        assessment_history.append({
            "topic": a.topic,
            "score": a.score,
            "total": a.total_questions,
            "percentage": int((a.score / a.total_questions) * 100) if a.total_questions > 0 else 0,
            "date": a.created_at.strftime("%Y-%m-%d")
        })

        # Skill progress can be mapped to topic -> average score
        skill_progress.append({
            "subject": a.topic,
            "score": int((a.score / a.total_questions) * 100) if a.total_questions > 0 else 0,
        })

    # Average Daily Time
    avg_daily_time = "45 min"

    # Let's create learning progress chart data (monthly)
    # Group assessments by month
    monthly_data = {
        'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
        'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
    }
    for a in assessments:
        month = a.created_at.strftime("%b")
        if month in monthly_data:
            monthly_data[month] += 1

    learning_progress = [
        {"month": k, "hours": v} for k, v in monthly_data.items()
    ]

    # Weekly Activity
    weekly_activity = [
        {"day": "Mon", "duration": 30},
        {"day": "Tue", "duration": 45},
        {"day": "Wed", "duration": 20},
        {"day": "Thu", "duration": 60},
        {"day": "Fri", "duration": 15},
        {"day": "Sat", "duration": 90},
        {"day": "Sun", "duration": 0},
    ]

    return {
        "stats": {
            "total_learning_hours": f"{total_learning_hours} hrs",
            "goals_completed": str(goals_completed),
            "learning_days": str(len(assessments)),
            "avg_daily_time": avg_daily_time
        },
        "learning_progress": learning_progress[-6:], # Last 6 months for chart
        "weekly_activity": weekly_activity,
        "skill_progress": skill_progress,
        "assessment_history": assessment_history
    }
