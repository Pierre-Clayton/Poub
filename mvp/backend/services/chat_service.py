# backend/services/chat_service.py

from openai import OpenAI
import os
from dotenv import load_dotenv

from app.retrieval.faiss_store import faiss_store
from app.retrieval.embeddings import get_embedding

from app.chat_agent import classify_query_type, PROMPT_TEMPLATES

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chat_with_llm(
    query: str,
    top_k: int,
    temperature: float,
    user_id: str,
    personality_store: dict,
    conversation_history: list
):
    """
    1) Classify the query type (unblocker/planner/explainer/default).
    2) Retrieve top_k chunks from FAISS.
    3) Build a system prompt from the matching template.
    4) Call the LLM with the system prompt + context + user query.
    5) Return the final answer + partial context.
    """

    # (1) Determine question type
    question_type = classify_query_type(query)

    # (2) Retrieve top_k context from FAISS
    query_emb = get_embedding(query)
    results = faiss_store.search(query_emb, top_k=top_k)
    context_text = "\n".join([r["chunk"] for r in results])

    # (3) Build system prompt
    base_prompt = PROMPT_TEMPLATES.get(question_type, PROMPT_TEMPLATES["default"])
    personality_type = personality_store.get(user_id)
    if personality_type:
        base_prompt += f"\nNote: The user's personality is described as {personality_type}. Tailor your style to best engage and serve this profile.\n"

    system_message = base_prompt + "\n=== FAISS Context ===\n" + context_text

    # (4) Create final messages
    # If you want to incorporate full conversation, you can:
    # - Build a longer list of user+assistant messages
    # For brevity, we do a single user message below
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": query}
    ]

    try:
        response = client.chat.completions.create(model="gpt-4o",
        messages=messages,
        temperature=temperature)
        final_answer = response.choices[0].message.content.strip()
        return {
            "query": query,
            "top_k": top_k,
            "question_type": question_type,
            "personality_type": personality_type,
            "context_used": [r["chunk"][:150] for r in results],  # partial to avoid huge payload
            "answer": final_answer
        }
    except Exception as e:
        return {
            "error": str(e),
            "query": query,
            "question_type": question_type
        }
