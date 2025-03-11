# mvp/backend/services/chat_service.py

from openai import OpenAI
import os
from dotenv import load_dotenv
from retrieval.faiss_store import faiss_store
from retrieval.embeddings import get_embedding
from chat_agent import classify_query_type, PROMPT_TEMPLATES

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chat_with_llm(
    query: str,
    top_k: int,
    temperature: float,
    user_id: str,
    personality_store: dict,
    conversation_history: list,
    project_id: str = None
):
    # 1) Classifier le type de question
    question_type = classify_query_type(query)
    
    # 2) Récupérer le contexte via FAISS, en filtrant par project_id si fourni
    query_emb = get_embedding(query)
    results = faiss_store.search(query_emb, top_k=top_k, project_id=project_id)
    context_text = "\n".join([r["chunk"] for r in results])
    
    # 3) Construire le prompt de base selon le type de question et ajouter la personnalité si disponible
    base_prompt = PROMPT_TEMPLATES.get(question_type, PROMPT_TEMPLATES["default"])
    personality_type = personality_store.get(user_id)
    if personality_type:
        base_prompt += (
            f"\nRappel : l'utilisateur a le type de personnalité suivant : {personality_type}. "
            "Adaptez votre style de réponse en conséquence."
        )
    
    # 4) Construire le message système en insérant le contexte et en forçant l'utilisation exclusive de ce contexte
    system_message = (
        f"{base_prompt}\n\n"
        "=== CONTEXTE RAG ===\n"
        f"{context_text}\n"
        "=== FIN DU CONTEXTE ===\n\n"
        "IMPORTANT : Répondez à la question de l'utilisateur en utilisant exclusivement les informations fournies ci-dessus. "
        "Si le contexte ne suffit pas, indiquez-le clairement."
    )
    
    # 5) Composer les messages envoyés au LLM
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": query}
    ]
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=temperature
        )
        final_answer = response.choices[0].message.content.strip()
        return {
            "query": query,
            "top_k": top_k,
            "question_type": question_type,
            "personality_type": personality_type,
            "context_used": [r["chunk"][:150] for r in results],
            "answer": final_answer
        }
    except Exception as e:
        return {
            "error": str(e),
            "query": query,
            "question_type": question_type
        }
