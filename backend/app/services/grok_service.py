from openai import OpenAI

from app.core.config import settings

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)


def generate_roadmap(goal: str):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert education mentor. "
                    "Generate a structured learning roadmap."
                ),
            },
            {
                "role": "user",
                "content": goal,
            },
        ],
        temperature=0.7,
    )

    return response.choices[0].message.content

def generate_study_guide(goal: str) -> str:
    prompt = f"""
    You are an expert education mentor.
    Create a highly detailed, personalized study guide and learning roadmap for the following goal: "{goal}".

    Return ONLY a JSON object representing the study guide with the exact following structure:
    {{
        "weeks": [
            {{
                "week": "Week 1",
                "topic": "Topic name here",
                "tasks": ["Task 1", "Task 2"],
                "practice": "Practice strategy here"
            }}
        ],
        "resources": ["Resource 1", "Resource 2"],
        "important_concepts": ["Concept 1", "Concept 2"],
        "common_mistakes": ["Mistake 1", "Mistake 2"],
        "exam_tips": ["Tip 1", "Tip 2"],
        "practice_strategy": "Overall practice strategy",
        "revision_schedule": "Recommended revision schedule",
        "motivational_message": "A short personalized motivational message",
        "motivational_speech": "An original motivational speech inspired by famous educators"
    }}
    Do not wrap the JSON in markdown code blocks. Ensure the output is valid JSON.
    """
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.7,
    )
    return response.choices[0].message.content


DIFFICULTY_GUIDANCE = {
    "easy": (
        "EASY difficulty: beginner-friendly questions covering basic "
        "definitions, terminology, and fundamental concepts."
    ),
    "medium": (
        "MEDIUM difficulty: intermediate questions covering practical usage, "
        "common patterns, and applied understanding of the topic."
    ),
    "hard": (
        "HARD difficulty: advanced questions covering edge cases, best "
        "practices, debugging scenarios, and deeper conceptual understanding."
    ),
    "expert": (
        "EXPERT difficulty: mastery-level questions covering advanced "
        "internals, tricky edge cases, performance considerations, and "
        "nuanced real-world scenarios. These should challenge someone who "
        "has completed learning the topic."
    ),
}


def generate_quiz(topic: str, difficulty: str = "easy") -> str:
    guidance = DIFFICULTY_GUIDANCE.get(difficulty, DIFFICULTY_GUIDANCE["easy"])
    prompt = f"""
    You are an expert education mentor.
    Create a 5-question multiple choice quiz on the topic: {topic}.
    The quiz difficulty MUST match this level: {guidance}
    Return ONLY a JSON object representing the quiz with the following structure:
    {{
        "topic": "{topic}",
        "questions": [
            {{
                "id": 1,
                "question": "Question text here?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option B"
            }},
            ...
        ]
    }}
    Do not wrap the JSON in markdown code blocks. Ensure the output is valid JSON.
    """
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.3,
    )
    return response.choices[0].message.content


def generate_recommendations(topic: str, score: int, total: int) -> str:
    prompt = f"""
    You are an expert education mentor.
    A student has just taken a quiz on "{topic}" and scored {score} out of {total}.
    Based on their score, provide a short, personalized paragraph of feedback and recommendations for their learning journey.
    Keep it encouraging and focused on actionable advice.
    """
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.7,
    )
    return response.choices[0].message.content
