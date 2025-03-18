# backend/models/personality_models.py

from pydantic import BaseModel

class PersonalitySubmission(BaseModel):
    user_id: str
    personality_type: str  # e.g., "INTP", "ENFJ", etc.
