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

    goals_completed = db.query(Roadmap).filter(
        Roadmap.user_id == user_id,
        Roadmap.status == "Completed"
    ).count()

    roadmaps = db.query(Roadmap).filter(Roadmap.user_id == user_id).all()

    total_learning_hours = 0
    now = datetime.utcnow()

    for r in roadmaps:
        if r.created_at:
            days_passed = (now - r.created_at).days
            # if 0 days passed (same day), let's count it as 1 day for instant feedback or 0.
            if days_passed == 0:
                days_passed = 1 # count the current day
            hours_done = days_passed * (r.hours_per_day or 0)
            total_learning_hours += hours_done

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

        skill_progress.append({
            "subject": a.topic,
            "score": int((a.score / a.total_questions) * 100) if a.total_questions > 0 else 0,
        })

    avg_daily_time = "0 min"
    total_hours_per_day = sum([r.hours_per_day or 0 for r in roadmaps])
    if total_hours_per_day > 0:
        avg_daily_time = f"{total_hours_per_day * 60} min"
    elif total_learning_hours > 0:
        avg_daily_time = "60 min"

    # group total hours historically (simplified mock combined with real total)
    monthly_data = {
        'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
        'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
    }

    current_month = now.strftime("%b")
    if current_month in monthly_data:
        monthly_data[current_month] = total_learning_hours

    for a in assessments:
        month = a.created_at.strftime("%b")
        if month in monthly_data and month != current_month:
            monthly_data[month] += 1

    learning_progress = [
        {"month": k, "hours": v} for k, v in monthly_data.items()
    ]

    # get a 6 month window up to current month
    all_months = list(monthly_data.keys())
    try:
        curr_idx = all_months.index(current_month)
        start_idx = max(0, curr_idx - 5)
        # Handle wrap around for simpler slice or just take last 6
        learning_progress = learning_progress[start_idx:curr_idx+1]
        if len(learning_progress) < 6:
            learning_progress = [ {"month": m, "hours": 0} for m in all_months[curr_idx-5:curr_idx] ] + learning_progress # fallback rough slice
            learning_progress = [ {"month": k, "hours": v} for k, v in monthly_data.items() ][-6:]
    except ValueError:
        learning_progress = learning_progress[-6:]


    weekly_activity = [
        {"day": "Mon", "duration": (total_hours_per_day * 60) if now.weekday() >= 0 else 0},
        {"day": "Tue", "duration": (total_hours_per_day * 60) if now.weekday() >= 1 else 0},
        {"day": "Wed", "duration": (total_hours_per_day * 60) if now.weekday() >= 2 else 0},
        {"day": "Thu", "duration": (total_hours_per_day * 60) if now.weekday() >= 3 else 0},
        {"day": "Fri", "duration": (total_hours_per_day * 60) if now.weekday() >= 4 else 0},
        {"day": "Sat", "duration": (total_hours_per_day * 60) if now.weekday() >= 5 else 0},
        {"day": "Sun", "duration": (total_hours_per_day * 60) if now.weekday() == 6 else 0},
    ]

    return {
        "stats": {
            "total_learning_hours": f"{total_learning_hours} hrs",
            "goals_completed": str(goals_completed),
            "learning_days": str(len(assessments) + len(roadmaps)),
            "avg_daily_time": avg_daily_time
        },
        "learning_progress": learning_progress,
        "weekly_activity": weekly_activity,
        "skill_progress": skill_progress,
        "assessment_history": assessment_history
    }
