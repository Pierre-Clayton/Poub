# mvp/backend/app.py

import os
from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import openai

# Firebase et authentification
from firebase_config import auth
from firebase_admin._auth_utils import InvalidIdTokenError

# Ingestion et récupération
from data_ingestion.pdf_ingestion import parse_pdf
from data_ingestion.csv_ingestion import parse_csv
from retrieval.faiss_store import faiss_store
from retrieval.embeddings import batch_get_embeddings, get_embedding

# Modèles et services
from models.chat_models import AskQuery
from services.chat_service import chat_with_llm
from models.mbti_models import MBTIQuizResponse
from services.mbti_service import get_mbti_questions, process_quiz_submission
from models.personality_models import PersonalitySubmission
from models.project_models import ProjectCreate, DocumentCreate, ChatMessage, DocumentDeleteRequest
from services.project_service import (
    create_project,
    list_projects,
    get_project,
    add_document_to_project,
    list_documents,
    delete_document_from_project,
    delete_documents_from_project,
    add_chat_message,
    get_chat_history
)

load_dotenv()

app = FastAPI()

origins = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Stockage en mémoire pour tests uniquement
documents_store = {}
personality_store = {}
conversation_history = {}

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        user_id = decoded_token["uid"]
        return user_id
    except InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    except ValueError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Auth error: {str(e)}")

class SearchQuery(BaseModel):
    query: str
    top_k: int = 3

@app.get("/health")
def health_check():
    return {"status": "ok"}

# Endpoints d'ingestion : on ajoute un paramètre optionnel project_id
@app.post("/parse-pdf")
async def parse_pdf_endpoint(
    file: UploadFile = File(...),
    user_id: str = Depends(verify_firebase_token),
    project_id: str = None
):
    file_location = f"/tmp/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())
    chunks = parse_pdf(file_location, chunk_size=500, chunk_overlap=50)
    embeddings = batch_get_embeddings(chunks)
    # On ajoute project_id dans les métadonnées
    meta_list = [{"filename": file.filename, "chunk": c, "project_id": project_id} for c in chunks]
    faiss_store.add_embeddings(embeddings, meta_list)
    return {
        "filename": file.filename,
        "num_chunks": len(chunks),
        "sample_chunk": chunks[0] if chunks else "",
        "info": f"Stored in FAISS. user_id={user_id}, project_id={project_id}"
    }

@app.post("/parse-csv")
async def parse_csv_endpoint(
    file: UploadFile = File(...),
    user_id: str = Depends(verify_firebase_token),
    project_id: str = None
):
    file_location = f"/tmp/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())
    chunks = parse_csv(file_location, chunk_size=500, chunk_overlap=50)
    embeddings = batch_get_embeddings(chunks)
    meta_list = [{"filename": file.filename, "chunk": c, "project_id": project_id} for c in chunks]
    faiss_store.add_embeddings(embeddings, meta_list)
    return {
        "filename": file.filename,
        "num_chunks": len(chunks),
        "sample_chunk": chunks[0] if chunks else "",
        "info": f"Stored in FAISS. user_id={user_id}, project_id={project_id}"
    }

@app.post("/search_faiss")
def search_faiss_endpoint(
    payload: SearchQuery,
    user_id: str = Depends(verify_firebase_token)
):
    query_emb = get_embedding(payload.query)
    results = faiss_store.search(query_emb, top_k=payload.top_k)
    return {
        "query": payload.query,
        "top_k": payload.top_k,
        "results": results,
        "user_id": user_id
    }

@app.post("/chat")
def chat_endpoint(
    payload: AskQuery,
    user_id: str = Depends(verify_firebase_token)
):
    if user_id not in conversation_history:
        conversation_history[user_id] = {}
    if "global" not in conversation_history[user_id]:
        conversation_history[user_id]["global"] = []
    conversation_history[user_id]["global"].append({"role": "user", "content": payload.query})
    response_data = chat_with_llm(
        query=payload.query,
        top_k=payload.top_k,
        temperature=payload.temperature,
        user_id=user_id,
        personality_store=personality_store,
        conversation_history=conversation_history[user_id]["global"]
    )
    conversation_history[user_id]["global"].append({"role": "assistant", "content": response_data["answer"]})
    return response_data

@app.get("/mbti_quiz")
def mbti_quiz_questions(user_id: str = Depends(verify_firebase_token)):
    from services.mbti_service import get_mbti_questions
    questions = get_mbti_questions()
    return {
        "user_id": user_id,
        "num_questions": len(questions),
        "questions": [q.dict() for q in questions]
    }

@app.post("/mbti_quiz")
def submit_mbti_quiz(
    quiz_resp: MBTIQuizResponse,
    user_id: str = Depends(verify_firebase_token)
):
    from services.mbti_service import process_quiz_submission
    try:
        personality_type = process_quiz_submission(quiz_resp)
        personality_store[user_id] = personality_type
        return {
            "user_id": user_id,
            "personality_type": personality_type,
            "message": "Personality computed. Please confirm to store permanently."
        }
    except ValueError as e:
        return {"error": str(e)}

@app.post("/submit_personality")
def submit_personality(
    payload: PersonalitySubmission,
    user_id: str = Depends(verify_firebase_token)
):
    payload.user_id = user_id
    personality_store[user_id] = payload.personality_type
    from firebase_admin import firestore
    db = firestore.client()
    db.collection("users").document(user_id).set(
        {"personality_type": payload.personality_type},
        merge=True
    )
    return {
        "message": "Personality stored permanently",
        "user_id": user_id,
        "personality_type": payload.personality_type
    }

@app.post("/projects")
def create_project_endpoint(
    project: ProjectCreate, 
    user_id: str = Depends(verify_firebase_token)
):
    new_project = create_project(user_id, project.dict())
    return new_project

@app.get("/projects")
def list_projects_endpoint(user_id: str = Depends(verify_firebase_token)):
    projects = list_projects(user_id)
    return {"projects": projects}

@app.get("/projects/{project_id}")
def get_project_endpoint(project_id: str, user_id: str = Depends(verify_firebase_token)):
    project = get_project(project_id)
    if not project or project["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.post("/projects/{project_id}/documents")
def add_document_endpoint(
    project_id: str,
    document: DocumentCreate,
    user_id: str = Depends(verify_firebase_token)
):
    project = get_project(project_id)
    if not project or project["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    new_doc = add_document_to_project(project_id, document.dict())
    return new_doc

@app.get("/projects/{project_id}/documents")
def list_documents_endpoint(project_id: str, user_id: str = Depends(verify_firebase_token)):
    project = get_project(project_id)
    if not project or project["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    docs = list_documents(project_id)
    return {"documents": docs}

@app.delete("/projects/{project_id}/documents/{document_id}")
def delete_document_endpoint(
    project_id: str,
    document_id: str,
    user_id: str = Depends(verify_firebase_token)
):
    project = get_project(project_id)
    if not project or project["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    result = delete_document_from_project(project_id, document_id)
    return result

@app.delete("/projects/{project_id}/documents")
def delete_documents_endpoint(
    project_id: str,
    payload: DocumentDeleteRequest,
    user_id: str = Depends(verify_firebase_token)
):
    project = get_project(project_id)
    if not project or project["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    results = delete_documents_from_project(project_id, payload.document_ids)
    return {"deleted": results}

# Endpoint de chat pour un projet spécifique
@app.post("/projects/{project_id}/chat")
def project_chat_endpoint(
    project_id: str,
    payload: AskQuery,
    user_id: str = Depends(verify_firebase_token)
):
    project = get_project(project_id)
    if not project or project["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    if user_id not in conversation_history:
        conversation_history[user_id] = {}
    if project_id not in conversation_history[user_id]:
        conversation_history[user_id][project_id] = []
    conversation_history[user_id][project_id].append({"role": "user", "content": payload.query})
    response_data = chat_with_llm(
        query=payload.query,
        top_k=payload.top_k,
        temperature=payload.temperature,
        user_id=user_id,
        personality_store=personality_store,
        conversation_history=conversation_history[user_id][project_id],
        project_id=project_id  # transmission du project_id pour filtrer le contexte
    )
    conversation_history[user_id][project_id].append({"role": "assistant", "content": response_data["answer"]})
    return response_data

@app.get("/projects/{project_id}/chat")
def get_project_chat_history_endpoint(
    project_id: str, 
    user_id: str = Depends(verify_firebase_token)
):
    project = get_project(project_id)
    if not project or project["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="Project not found")
    history = get_chat_history(project_id)
    return {"chat_history": history}
