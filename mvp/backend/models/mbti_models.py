# backend/models/mbti_models.py

from pydantic import BaseModel
from typing import List, Optional

class MBTIQuestion(BaseModel):
    question_id: int
    question_text: str
    # We can store possible answers if you want to display them
    options: List[str]

class MBTIQuizResponse(BaseModel):
    user_id: str
    # This will store the chosen answers, e.g. ["E", "S", "T", "J"]
    answers: List[str]
