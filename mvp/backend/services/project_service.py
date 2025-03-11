from firebase_admin import firestore
from datetime import datetime
import uuid

db = firestore.client()

def create_project(user_id: str, project_data: dict) -> dict:
    project_id = str(uuid.uuid4())
    project = {
        "project_id": project_id,
        "user_id": user_id,
        "name": project_data.get("name"),
        "description": project_data.get("description", ""),
        "created_at": datetime.utcnow()
    }
    db.collection("projects").document(project_id).set(project)
    return project

def list_projects(user_id: str):
    projects_ref = db.collection("projects").where("user_id", "==", user_id)
    docs = projects_ref.stream()
    return [doc.to_dict() for doc in docs]

def get_project(project_id: str) -> dict:
    doc = db.collection("projects").document(project_id).get()
    if doc.exists:
        return doc.to_dict()
    return None

def add_document_to_project(project_id: str, document_data: dict) -> dict:
    document_id = str(uuid.uuid4())
    document = {
        "document_id": document_id,
        "filename": document_data.get("filename"),
        "content": document_data.get("content"),
        "created_at": datetime.utcnow()
    }
    db.collection("projects").document(project_id).collection("documents").document(document_id).set(document)
    return document

def list_documents(project_id: str):
    docs_ref = db.collection("projects").document(project_id).collection("documents")
    docs = docs_ref.stream()
    return [doc.to_dict() for doc in docs]

def delete_document_from_project(project_id: str, document_id: str) -> dict:
    doc_ref = db.collection("projects").document(project_id).collection("documents").document(document_id)
    doc_ref.delete()
    return {"deleted_document_id": document_id}

def delete_documents_from_project(project_id: str, document_ids: list) -> list:
    results = []
    for doc_id in document_ids:
        doc_ref = db.collection("projects").document(project_id).collection("documents").document(doc_id)
        doc_ref.delete()
        results.append({"deleted_document_id": doc_id})
    return results

def add_chat_message(project_id: str, message: dict) -> dict:
    # On ajoute toujours le timestamp ici (même si le modèle a une valeur par défaut)
    message["timestamp"] = message.get("timestamp", datetime.utcnow())
    message_id = str(uuid.uuid4())
    db.collection("projects").document(project_id).collection("chats").document(message_id).set(message)
    message["message_id"] = message_id
    return message

def get_chat_history(project_id: str):
    chat_ref = db.collection("projects").document(project_id).collection("chats").order_by("timestamp")
    docs = chat_ref.stream()
    return [doc.to_dict() for doc in docs]
