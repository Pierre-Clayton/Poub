# mvp/backend/models/personality_models.py

from pydantic import BaseModel
from typing import Optional

class PersonalitySubmission(BaseModel):
    # On rend user_id optionnel : si non fourni, on l’infère depuis le token
    user_id: Optional[str] = None
    personality_type: str  # par exemple "INTP", "ENFJ", etc.
