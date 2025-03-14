import os
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai

# Firebase
from firebase_config import auth
from firebase_admin._auth_utils import InvalidIdTokenError

# Data ingestion & retrieval
from data_ingestion.pdf_ingestion import parse_pdf
from data_ingestion.csv_ingestion import parse_csv
from retrieval.faiss_store import faiss_store
from retrieval.embeddings import batch_get_embeddings, get_embedding

# Chat, MBTI, models
from models.chat_models import AskQuery
from services.chat_service import chat_with_llm
from models.mbti_models import MBTIQuizResponse
from services.mbti_service import get_mbti_questions, process_quiz_submission
from models.personality_models import PersonalitySubmission

load_dotenv()

app = FastAPI()

# ---------- CORS ----------

# Allow your frontend's origin, e.g. http://127.0.0.1:5173 (Vite default)
origins = [
    "https://chat.projectpath.ai",
    "https://projectpath.ai",
    "https://api.projectpath.ai",
    # add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # or ["*"] for wide-open
    allow_credentials=True,
    allow_methods=["*"],            # e.g. ["GET", "POST", ...] or "*"
    allow_headers=["*"]
)

# ---------- In-memory Stores ----------
documents_store = {}         # For debug: filename -> list of {chunk, embedding}
personality_store = {}        # user_id -> MBTI type
conversation_history = {}     # user_id -> list of { "role": "user"/"assistant", "content": "..." }

# ---------- Security Dependency ----------
security = HTTPBearer()

def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verifies the Firebase ID token.
    If valid, returns the user_id (Firebase UID).
    Raises 401 otherwise.
    """
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

# ---------- Models ----------
class SearchQuery(BaseModel):
    query: str
    top_k: int = 3

# ---------- 1. Health Check ----------
@app.get("/health")
def health_check():
    """
    Simple endpoint to ensure the server is up.
    """
    return {"status": "ok"}

# ---------- 2. Document Ingestion Endpoints ----------
@app.post("/parse-pdf")
async def parse_pdf_endpoint(
    file: UploadFile = File(...),
    user_id: str = Depends(verify_firebase_token)
):
    """
    Parses a PDF, chunks & embeds it, then stores in FAISS.
    Also keeps a debug copy in documents_store.
    """
    file_location = f"/tmp/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    chunks = parse_pdf(file_location, chunk_size=500, chunk_overlap=50)
    embeddings = batch_get_embeddings(chunks)

    meta_list = [{"filename": file.filename, "chunk": c} for c in chunks]
    faiss_store.add_embeddings(embeddings, meta_list)

    # For debugging / optional usage
    doc_data = []
    for c, emb in zip(chunks, embeddings):
        doc_data.append({"chunk": c, "embedding": emb})
    documents_store[file.filename] = doc_data

    return {
        "filename": file.filename,
        "num_chunks": len(chunks),
        "sample_chunk": chunks[0] if chunks else "",
        "info": f"Stored in FAISS. user_id={user_id}"
    }

@app.post("/parse-csv")
async def parse_csv_endpoint(
    file: UploadFile = File(...),
    user_id: str = Depends(verify_firebase_token)
):
    """
    Parses a CSV, chunks & embeds it, then stores in FAISS.
    Also keeps a debug copy in documents_store.
    """
    file_location = f"/tmp/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    chunks = parse_csv(file_location, chunk_size=500, chunk_overlap=50)
    embeddings = batch_get_embeddings(chunks)

    meta_list = [{"filename": file.filename, "chunk": c} for c in chunks]
    faiss_store.add_embeddings(embeddings, meta_list)

    doc_data = []
    for c, emb in zip(chunks, embeddings):
        doc_data.append({"chunk": c, "embedding": emb})
    documents_store[file.filename] = doc_data

    return {
        "filename": file.filename,
        "num_chunks": len(chunks),
        "sample_chunk": chunks[0] if chunks else "",
        "info": f"Stored in FAISS. user_id={user_id}"
    }

# ---------- 3. Search Endpoint ----------
@app.post("/search_faiss")
def search_faiss_endpoint(
    payload: SearchQuery,
    user_id: str = Depends(verify_firebase_token)
):
    """
    Performs a similarity search over the FAISS index.
    """
    query_emb = get_embedding(payload.query)
    results = faiss_store.search(query_emb, top_k=payload.top_k)
    return {
        "query": payload.query,
        "top_k": payload.top_k,
        "results": results,
        "user_id": user_id
    }

# ---------- 4. Chat Endpoint ----------
@app.post("/chat")
def chat_endpoint(
    payload: AskQuery,
    user_id: str = Depends(verify_firebase_token)
):
    """
    Receives a user query, classifies it, retrieves context from FAISS,
    applies different prompts based on question type, and calls the LLM.
    Conversation history is stored in memory.
    """
    if user_id not in conversation_history:
        conversation_history[user_id] = []

    # Append new user message
    conversation_history[user_id].append({"role": "user", "content": payload.query})

    # Hand off to chat service
    response_data = chat_with_llm(
        query=payload.query,
        top_k=payload.top_k,
        temperature=payload.temperature,
        user_id=user_id,
        personality_store=personality_store,
        conversation_history=conversation_history[user_id]
    )

    # Append assistant response
    conversation_history[user_id].append({"role": "assistant", "content": response_data["answer"]})

    return response_data

# ---------- 5. Debug Endpoint for Documents ----------
@app.get("/documents_store")
def get_documents_store(user_id: str = Depends(verify_firebase_token)):
    """
    (Optional) Debug endpoint showing the ingested documents in memory.
    """
    summary = {}
    for filename, chunk_list in documents_store.items():
        summary[filename] = {
            "total_chunks": len(chunk_list),
            "first_100_chars_of_first_chunk": chunk_list[0]["chunk"][:100] if chunk_list else ""
        }
    return {"user_id": user_id, "documents": summary}

# ---------- 6. MBTI Quiz Endpoints ----------
@app.get("/mbti_quiz")
def mbti_quiz_questions(user_id: str = Depends(verify_firebase_token)):
    """
    Returns a small set of MBTI questions.
    """
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
    """
    Submits answers to the MBTI quiz, calculates the personality, and stores it for the user.
    """
    try:
        personality_type = process_quiz_submission(quiz_resp)
        personality_store[quiz_resp.user_id] = personality_type
        return {
            "user_id": quiz_resp.user_id,
            "personality_type": personality_type,
            "message": "Personality stored successfully!"
        }
    except ValueError as e:
        return {"error": str(e)}

@app.post("/submit_personality")
def submit_personality(
    payload: PersonalitySubmission,
    user_id: str = Depends(verify_firebase_token)
):
    """
    Directly sets the user's personality description in personality_store.
    """
    personality_store[payload.user_id] = payload.personality_type
    return {
        "message": "Personality stored",
        "user_id": payload.user_id,
        "personality_type": payload.personality_type
    }
