import requests
from datetime import datetime

def run_tests():
    base_url = "http://127.0.0.1:8000"

    print("Testing Doubt Solver...")
    resp = requests.post(f"{base_url}/doubt-solver", json={"question": "What is Python?"})
    print("Doubt solver response:", resp.json())

    print("\nRegistering a test user...")
    user_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": f"test{datetime.now().timestamp()}@example.com",
        "password": "password123",
        "bio": "Test bio"
    }
    resp = requests.post(f"{base_url}/register", json=user_data)
    print("Register response:", resp.json())

    print("\nLogging in...")
    login_data = {
        "username": user_data["email"],
        "password": user_data["password"]
    }
    resp = requests.post(f"{base_url}/login", data=login_data)
    print("Login response status:", resp.status_code)
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    print("\nCreating a roadmap...")
    roadmap_data = {
        "title": "Learn Python",
        "description": "Python roadmap",
        "hours_per_day": 2
    }
    resp = requests.post(f"{base_url}/roadmap/create", json=roadmap_data, headers=headers)
    print("Create roadmap response:", resp.json())
    roadmap_id = resp.json()["id"]

    print("\nTesting learn-today...")
    resp = requests.post(f"{base_url}/roadmap/{roadmap_id}/learn-today", headers=headers)
    print("Learn today response:", resp.json())

    print("\nTesting learn-today duplicate prevention...")
    resp = requests.post(f"{base_url}/roadmap/{roadmap_id}/learn-today", headers=headers)
    print("Duplicate learn today response status (should be 400):", resp.status_code)
    print("Duplicate learn today response:", resp.json())

    print("\nTesting roadmap progression (assessment submit)...")
    assessment_data = {
        "topic": "Python",
        "score": 5,
        "total_questions": 5,
        "stage": "completed",
        "roadmap_id": roadmap_id
    }
    resp = requests.post(f"{base_url}/assessment/submit", json=assessment_data, headers=headers)
    print("Assessment submit response:", resp.json())

    print("\nVerifying roadmap was completed...")
    resp = requests.get(f"{base_url}/roadmap/{roadmap_id}", headers=headers)
    print("Roadmap after completion:", resp.json())

run_tests()
