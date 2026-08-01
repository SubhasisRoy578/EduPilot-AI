from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.roadmap import Roadmap
from app.models.assessment import Assessment
from app.models.user import User
from app.auth.auth_handler import get_current_user
from datetime import datetime, timedelta

from app.models.activity import UserActivity

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

    # Total learning hours
    roadmaps = db.query(Roadmap).filter(
    Roadmap.user_id == user_id
    ).all()

    total_learning_hours_result = db.query(func.sum(UserActivity.hours)).filter(UserActivity.user_id == user_id).scalar()
    total_learning_hours = total_learning_hours_result if total_learning_hours_result else 0
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
    total_daily_hours = sum(r.hours_per_day for r in roadmaps if r.status != "Completed")
    avg_daily_time = f"{total_daily_hours} hr"

    # Let's create learning progress chart data (monthly)
    # The requirement is "The learning progress graph should use real roadmap progress and completed stages over time."
    monthly_data = {
        'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
        'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
    }
    # Add assessments to progress
    for a in assessments:
        month = a.created_at.strftime("%b")
        if month in monthly_data:
            monthly_data[month] += 1
    # Add completed roadmaps to progress
    for r in roadmaps:
        if r.status == "Completed" and r.created_at:
            month = r.created_at.strftime("%b")
            if month in monthly_data:
                monthly_data[month] += 1

    learning_progress = [
        {"month": k, "hours": v} for k, v in monthly_data.items()
    ]

    # Weekly Activity - Real data from UserActivity (last 7 days)
    today = datetime.utcnow().date()
    seven_days_ago = today - timedelta(days=6)
    activities = db.query(UserActivity).filter(
        UserActivity.user_id == user_id,
        UserActivity.date >= seven_days_ago,
        UserActivity.date <= today
    ).order_by(UserActivity.date.asc()).all()

    activity_dict = {a.date: a.hours for a in activities}

    weekly_activity = []
    for i in range(7):
        d = seven_days_ago + timedelta(days=i)
        day_str = d.strftime("%b %-d") if "%-d" in d.strftime("%b %-d") else d.strftime("%b %d").replace(" 0", " ")
        hours = activity_dict.get(d, 0)
        weekly_activity.append({
            "day": day_str,
            "duration": hours
        })

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
