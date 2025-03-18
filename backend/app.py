# mvp/backend/app.py

import os
import json
import boto3
import numpy as np
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from cognito_verification import verify_cognito_token
from data_ingestion.pdf_ingestion import parse_pdf
from data_ingestion.csv_ingestion import parse_csv
from retrieval.embeddings import batch_get_embeddings, get_embedding
from persistence import save_document, append_conversation  # Import des fonctions de persistance

load_dotenv()
app = FastAPI()

# ---------- CORS ----------
origins = [
    "https://chat.projectpath.ai",
    "https://projectpath.ai",
    "https://api.projectpath.ai",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Authentification via Cognito ----------
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_id = verify_cognito_token(token)
    return user_id

# ---------- Configuration S3 ----------
S3_BUCKET = os.getenv("S3_BUCKET", "projectpath-app-bucket")
s3_client = boto3.client("s3", region_name=os.getenv("AWS_REGION", "eu-east-1"))

# ---------- Stockage en mémoire (pour la démo) ----------
# Nous conservons documents_store temporairement pour la recherche simple
documents_store = {}

# ---------- Modèle de requête ----------
class SearchQuery(BaseModel):
    query: str
    top_k: int = 3

# ---------- Endpoint Health ----------
@app.get("/health")
def health_check():
    return {"status": "ok"}

# ---------- Endpoint Parse PDF ----------
@app.post("/parse-pdf")
async def parse_pdf_endpoint(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    file_data = await file.read()

    # Upload sur S3
    s3_key = f"{user_id}/{file.filename}"
    try:
        s3_client.put_object(Bucket=S3_BUCKET, Key=s3_key, Body=file_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail="S3 upload failed: " + str(e))

    # Sauvegarde temporaire et traitement du PDF
    tmp_path = f"/tmp/{file.filename}"
    with open(tmp_path, "wb") as f:
        f.write(file_data)

    chunks = parse_pdf(tmp_path, chunk_size=500, chunk_overlap=50)
    embeddings = batch_get_embeddings(chunks)
    doc_data = [{"chunk": c, "embedding": emb.tolist()} for c, emb in zip(chunks, embeddings)]
    
    # Enregistrement dans la mémoire temporaire
    documents_store[file.filename] = doc_data
    # Persistance dans DynamoDB
    try:
        save_document(user_id, file.filename, doc_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save document in DB: " + str(e))

    return {
        "filename": file.filename,
        "num_chunks": len(chunks),
        "sample_chunk": chunks[0] if chunks else "",
        "info": f"Fichier uploadé sur S3, traité et sauvegardé en DB. user_id={user_id}"
    }

# ---------- Endpoint Parse CSV ----------
@app.post("/parse-csv")
async def parse_csv_endpoint(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    file_data = await file.read()

    s3_key = f"{user_id}/{file.filename}"
    try:
        s3_client.put_object(Bucket=S3_BUCKET, Key=s3_key, Body=file_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail="S3 upload failed: " + str(e))

    tmp_path = f"/tmp/{file.filename}"
    with open(tmp_path, "wb") as f:
        f.write(file_data)

    chunks = parse_csv(tmp_path, chunk_size=500, chunk_overlap=50)
    embeddings = batch_get_embeddings(chunks)
    doc_data = [{"chunk": c, "embedding": emb.tolist()} for c, emb in zip(chunks, embeddings)]
    
    documents_store[file.filename] = doc_data
    try:
        save_document(user_id, file.filename, doc_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save document in DB: " + str(e))

    return {
        "filename": file.filename,
        "num_chunks": len(chunks),
        "sample_chunk": chunks[0] if chunks else "",
        "info": f"Fichier uploadé sur S3, traité et sauvegardé en DB. user_id={user_id}"
    }

# ---------- Endpoint Search ----------
@app.post("/search")
def search_endpoint(
    payload: SearchQuery,
    user_id: str = Depends(get_current_user)
):
    query_emb = get_embedding(payload.query)
    all_results = []
    for filename, chunk_list in documents_store.items():
        for item in chunk_list:
            score = cosine_similarity(query_emb, item["embedding"])
            all_results.append({
                "filename": filename,
                "chunk": item["chunk"],
                "score": score
            })
    all_results.sort(key=lambda x: x["score"], reverse=True)
    return {
        "query": payload.query,
        "top_k": payload.top_k,
        "results": all_results[:payload.top_k],
        "user_id": user_id
    }

# ---------- Endpoint Chat (avec persistance de l'historique) ----------
@app.post("/chat")
def chat_endpoint(
    payload: dict,
    user_id: str = Depends(get_current_user)
):
    query = payload.get("query")
    top_k = payload.get("top_k", 3)
    temperature = payload.get("temperature", 1.0)

    # Persister le message utilisateur dans DynamoDB
    try:
        append_conversation(user_id, {"role": "user", "content": query})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to append user message: " + str(e))
    
    # Recherche simple dans documents_store pour le contexte
    query_emb = get_embedding(query)
    results = []
    for filename, chunk_list in documents_store.items():
        for item in chunk_list:
            score = cosine_similarity(query_emb, item["embedding"])
            results.append({
                "filename": filename,
                "chunk": item["chunk"],
                "score": score
            })
    results.sort(key=lambda x: x["score"], reverse=True)
    context_text = "\n".join([r["chunk"] for r in results[:top_k]])

    system_message = (
        "Vous êtes un assistant AI. "
        "Utilisez le contexte ci-dessous pour répondre de manière concise et utile:\n"
        "=== Contexte AWS ===\n" + context_text
    )
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": query}
    ]
    bedrock_payload = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 200,
        "top_k": 250,
        "stopSequences": [],
        "temperature": temperature,
        "top_p": 0.999,
        "messages": messages
    }

    bedrock_client = boto3.client("bedrock-runtime", region_name=os.getenv("AWS_REGION", "eu-east-1"))
    try:
        response = bedrock_client.invoke_model(
            ModelId="anthropic.claude-3-5-haiku-20241022-v1:0",
            ContentType="application/json",
            Accept="application/json",
            Body=json.dumps(bedrock_payload)
        )
        response_body = json.loads(response["Body"].read().decode("utf-8"))
        final_answer = response_body.get("message", "Aucune réponse fournie")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Bedrock error: " + str(e))

    # Persister la réponse de l'assistant dans DynamoDB
    try:
        append_conversation(user_id, {"role": "assistant", "content": final_answer})
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to append assistant message: " + str(e))
    
    return {
        "query": query,
        "top_k": top_k,
        "results": [r["chunk"][:150] for r in results[:top_k]],
        "user_id": user_id,
        "answer": final_answer
    }

# ---------- Utilitaire de cosine similarity ----------
def cosine_similarity(vec_a, vec_b):
    vec_a = np.array(vec_a)
    vec_b = np.array(vec_b)
    norm_a = np.linalg.norm(vec_a)
    norm_b = np.linalg.norm(vec_b)
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return float(np.dot(vec_a, vec_b) / (norm_a * norm_b))
