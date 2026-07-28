from openai import OpenAI
import traceback

from app.core.config import settings

client = OpenAI(
    api_key=settings.GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

def generate_roadmap(goal: str):
    try:
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
    except Exception as e:
        print(f"Error generating roadmap: {e}")
        return f"Fallback Roadmap for {goal}:\n\n1. Define your goal clearly.\n2. Find foundational resources on the topic.\n3. Practice continuously.\n4. Build a project."

def generate_quiz(topic: str) -> str:
    prompt = f"""
    You are an expert education mentor.
    Create a 5-question multiple choice quiz on the topic: {topic}.
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
    try:
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
    except Exception as e:
        return '{"topic": "' + topic + '", "questions": [{"id": 1, "question": "What is 1+1?", "options": ["1", "2", "3", "4"], "correct_answer": "2"}]}'


def generate_recommendations(topic: str, score: int, total: int) -> str:
    prompt = f"""
    You are an expert education mentor.
    A student has just taken a quiz on "{topic}" and scored {score} out of {total}.
    Based on their score, provide a short, personalized paragraph of feedback and recommendations for their learning journey.
    Keep it encouraging and focused on actionable advice.
    """
    try:
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
    except Exception as e:
        return "Keep practicing and you'll get better! Consider reviewing the core fundamentals."
