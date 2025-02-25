# backend/models/chat_models.py

from pydantic import BaseModel
from typing import Optional

class AskQuery(BaseModel):
    query: str
    top_k: int = 3
    temperature: float = 0.7
    user_id: Optional[str] = None  # new
