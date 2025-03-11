from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class Project(ProjectCreate):
    project_id: str
    user_id: str
    created_at: datetime

class DocumentCreate(BaseModel):
    filename: str
    content: str  # Pour simplifier, nous stockons le contenu textuel du document

class Document(DocumentCreate):
    document_id: str
    created_at: datetime

class ChatMessage(BaseModel):
    role: str  # par exemple "user" ou "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class DocumentDeleteRequest(BaseModel):
    document_ids: List[str]
