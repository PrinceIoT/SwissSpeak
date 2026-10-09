from typing import Optional

from pydantic import BaseModel, Field


class LearnerProfile(BaseModel):
    learner_id: str = "demo"
    native_language: str = "English"
    canton: str = "Bern"
    dialect: str = "Bernese Swiss German"
    level: str = "beginner"
    goal: str = "everyday"


class TutorRequest(BaseModel):
    learner: LearnerProfile

    message: str = Field(
        min_length=1
    )

    scenario_id: str = "bakery"

    conversation: list[dict] = []


class TutorResponse(BaseModel):
    reply: str

    translation: Optional[str] = None

    correction: Optional[str] = None

    explanation: Optional[str] = None

    learning_point: Optional[str] = None

    should_retry: bool = False

    difficulty: int = 1

    feedback: Optional[str] = None


class ProgressRequest(BaseModel):
    learner_id: str = "demo"

    canton: str = "Bern"

    dialect: str = "Bernese Swiss German"

    level: str = "beginner"

    completed_lesson: Optional[str] = None

    weakness: Optional[str] = None