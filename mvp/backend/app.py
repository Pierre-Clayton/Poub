# backend/app.py

import os
from openai import OpenAI
from dotenv import load_dotenv

from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from services.chat_service import chat_with_llm
from models.chat_models import AskQuery
import numpy as np

# We'll import our faiss_store to handle indexing/search
from retrieval.faiss_store import faiss_store
from retrieval.embeddings import batch_get_embeddings, get_embedding

from data_ingestion.pdf_ingestion import parse_pdf
from data_ingestion.csv_ingestion import parse_csv

from models.mbti_models import MBTIQuizResponse
from services.mbti_service import get_mbti_questions, process_quiz_submission
from models.personality_models import PersonalitySubmission

app = FastAPI()

# Load OpenAI API key from .env
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# We'll still keep documents_store to reference chunk data if needed,
# but for actual retrieval we use FAISS.
documents_store = {}

# Store personalities in memory:
# personality_store = {
#   "user_123": "ENTJ",
#   "user_124": "INTJ"
# }
personality_store = {}

# ============ Ingestion Endpoints ============

@app.post("/parse-pdf")
async def parse_pdf_endpoint(file: UploadFile = File(...)):
    file_location = f"/tmp/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Parse & chunk
    chunks = parse_pdf(file_location, chunk_size=500, chunk_overlap=50)
    # Embed
    embeddings = batch_get_embeddings(chunks)

    # Prepare meta for FAISS
    meta_list = []
    for chunk_text in chunks:
        meta_list.append({"filename": file.filename, "chunk": chunk_text})

    # Add embeddings to our FAISS index
    faiss_store.add_embeddings(embeddings, meta_list)

    # Optionally keep the older store if you still want
    chunk_data = []
    for chunk_text, emb in zip(chunks, embeddings):
        chunk_data.append({
            "chunk": chunk_text,
            "embedding": emb
        })
    documents_store[file.filename] = chunk_data

    return {
        "filename": file.filename,
        "num_chunks": len(chunks),
        "sample_chunk": chunks[0] if chunks else "",
        "info": "Stored in FAISS and documents_store (optional)."
    }

@app.post("/parse-csv")
async def parse_csv_endpoint(file: UploadFile = File(...)):
    file_location = f"/tmp/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(await file.read())

    # Parse & chunk
    chunks = parse_csv(file_location, chunk_size=500, chunk_overlap=50)
    # Embed
    embeddings = batch_get_embeddings(chunks)

    meta_list = []
    for chunk_text in chunks:
        meta_list.append({"filename": file.filename, "chunk": chunk_text})

    faiss_store.add_embeddings(embeddings, meta_list)

    # Optionally still store in the old store
    chunk_data = []
    for chunk_text, emb in zip(chunks, embeddings):
        chunk_data.append({
            "chunk": chunk_text,
            "embedding": emb
        })
    documents_store[file.filename] = chunk_data

    return {
        "filename": file.filename,
        "num_chunks": len(chunks),
        "sample_chunk": chunks[0] if chunks else "",
        "info": "Stored in FAISS and documents_store."
    }

# ============ Search Endpoints ============

class SearchQuery(BaseModel):
    query: str
    top_k: int = 3

@app.post("/search_faiss")
def search_faiss_endpoint(payload: SearchQuery):
    """
    Perform a cosine-similarity-like search over the FAISS index.
    """
    query_emb = get_embedding(payload.query)
    results = faiss_store.search(query_emb, top_k=payload.top_k)
    return {
        "query": payload.query,
        "top_k": payload.top_k,
        "results": results
    }

@app.post("/chat")
def chat_endpoint(payload: AskQuery):
    """
    Endpoint that retrieves top_k chunks for the query, then calls an LLM to get a final answer.
    """
    result = chat_with_llm(
        query=payload.query,
        top_k=payload.top_k,
        temperature=payload.temperature,
        client=client,
        user_id=payload.user_id,
        personality_store=personality_store
    )
    return result

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/documents_store")
def get_documents_store():
    # (Optional debug endpoint)
    summary = {}
    for filename, chunk_list in documents_store.items():
        summary[filename] = {
            "total_chunks": len(chunk_list),
            "first_100_chars_of_first_chunk": chunk_list[0]["chunk"][:100] if chunk_list else ""
        }
    return summary

@app.get("/mbti_quiz")
def mbti_quiz_questions():
    """
    Returns a short set of MBTI questions (4-5) to the user.
    """
    questions = get_mbti_questions()
    return {
        "num_questions": len(questions),
        "questions": [q.dict() for q in questions]
    }

@app.post("/mbti_quiz")
def submit_mbti_quiz(quiz_resp: MBTIQuizResponse):
    """
    Endpoint to submit user answers and compute MBTI type.
    Stores the result in personality_store for later usage.
    """
    try:
        personality_type = process_quiz_submission(quiz_resp)
        # Store in dictionary
        personality_store[quiz_resp.user_id] = personality_type
        return {
            "user_id": quiz_resp.user_id,
            "personality_type": personality_type,
            "message": "Personality stored successfully!"
        }
    except ValueError as e:
        return {"error": str(e)}

@app.post("/submit_personality")
def submit_personality(payload: PersonalitySubmission):
    """
    Stores the user's MBTI personality result (e.g., "INTP") in an in-memory store.
    """
    personality_store[payload.user_id] = payload.personality_type
    return {"message": "Personality stored", "user_id": payload.user_id, "personality_type": payload.personality_type}
