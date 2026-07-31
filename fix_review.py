import re

# Fix 1: Assessment route
route_path = 'backend/app/routes/assessment.py'
with open(route_path, 'r') as f:
    route_content = f.read()

diff_assessment = """
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
"""

if "pass_ratio = request.score" not in route_content:
    # Replace the existing roadmap completion block
    old_block = """    # If the user said they Completed Learning and scored 90% or above,
    # automatically mark the linked roadmap as Completed.
    roadmap_completed = False
    if (
        request.stage == "completed"
        and request.roadmap_id is not None
        and request.total_questions > 0
        and (request.score / request.total_questions) >= 0.9
    ):
        db_roadmap = db.query(Roadmap).filter(
            Roadmap.id == request.roadmap_id,
            Roadmap.user_id == current_user.id
        ).first()

        if db_roadmap and db_roadmap.status != "Completed":
            db_roadmap.status = "Completed"
            roadmap_completed = True"""
    route_content = route_content.replace(old_block, diff_assessment)
    with open(route_path, 'w') as f:
        f.write(route_content)


# Fix 2: Sidebar
layout_path = 'frontend/app/dashboard/layout.tsx'
with open(layout_path, 'r') as f:
    layout_content = f.read()

if "Doubt Solver" not in layout_content:
    if "import { BookOpen," in layout_content:
         layout_content = layout_content.replace("import { BookOpen,", "import { BookOpen, MessageSquare,")
    else:
         layout_content = layout_content.replace("import { LayoutDashboard", "import { LayoutDashboard, MessageSquare")

    old_menu = """    { icon: CheckCircle, label: "Assessment", href: "/dashboard/assessment" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },"""
    new_menu = """    { icon: CheckCircle, label: "Assessment", href: "/dashboard/assessment" },
    { icon: MessageSquare, label: "AI Doubt Solver", href: "/dashboard/doubt-solver" },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },"""
    layout_content = layout_content.replace(old_menu, new_menu)
    with open(layout_path, 'w') as f:
        f.write(layout_content)


# Fix 3: UI buttons `isUnlocked`
for page_path in ['frontend/app/dashboard/page.tsx', 'frontend/app/dashboard/roadmap/page.tsx']:
    try:
        with open(page_path, 'r') as f:
            content = f.read()

        old_test_map = """                              {[
                                { stage: "just_started", label: "Week 1 Test" },
                                { stage: "mediocre", label: "Week 3 Test" },
                                { stage: "almost_complete", label: "Week 5 Test" },
                                { stage: "completed", label: "Week 8 Test" },
                              ].map((test, idx) => {
                                const isUnlocked = true; // Could base on completed_weeks if strict progression needed"""

        new_test_map = """                              {[
                                { stage: "just_started", label: "Week 1 Test", req_weeks: 0 },
                                { stage: "mediocre", label: "Week 3 Test", req_weeks: 1 },
                                { stage: "almost_complete", label: "Week 5 Test", req_weeks: 3 },
                                { stage: "completed", label: "Week 8 Test", req_weeks: 5 },
                              ].map((test, idx) => {
                                const isUnlocked = (rm.completed_weeks || 0) >= test.req_weeks;"""

        if "const isUnlocked = true" in content:
            content = content.replace(old_test_map, new_test_map)
            with open(page_path, 'w') as f:
                f.write(content)
    except FileNotFoundError:
        pass

print("Applied fixes")
