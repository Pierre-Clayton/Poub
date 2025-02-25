# backend/services/chat_service.py

import os
import openai 

from retrieval.faiss_store import faiss_store
from retrieval.embeddings import get_embedding

# We'll assume you import or have access to personality_store
# from app import personality_store  # if your store is in app.py
# Or move personality_store to a separate global or DB call

def chat_with_llm(client, personality_store, query: str, top_k: int, temperature: float, user_id: str = None):
    """
    Retrieves the top_k chunks for 'query' using FAISS,
    then calls an LLM to get a final answer.
    Optionally tailors output to the user's MBTI personality.
    """

    # (1) Get user personality if available
    personality_type = None
    if user_id and user_id in personality_store:
        personality_type = personality_store[user_id]

    # (2) Retrieve top_k chunks from FAISS
    query_emb = get_embedding(query)
    results = faiss_store.search(query_emb, top_k=top_k)

    # (3) Build context
    context_texts = "\n".join([r["chunk"] for r in results])

    # (4) Create a system message that includes personality style
    # For example:
    base_system_content = "You are an AI assistant. Use the context below to answer the user's question."
    if personality_type:
        base_system_content += f" The user has an MBTI personality type of {personality_type}. " \
                               "Tailor the format and tone of your response to be especially appealing for someone with this personality."

    # (5) Build the final messages or prompt
    messages = [
        {"role": "system", "content": base_system_content},
        {"role": "user",   "content": f"Relevant context:\n{context_texts}\n\nQuestion:\n{query}"}
    ]

    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # or your preferred model
            messages=messages,
            temperature=temperature
        )
        final_answer = response.choices[0].message.content.strip()
        return {
            "query": query,
            "top_k": top_k,
            "personality_type": personality_type,
            "context_used": [r["chunk"][:150] for r in results],
            "answer": final_answer
        }
    except Exception as e:
        return {"error": str(e)}
