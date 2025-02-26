"""
backend/chat_agent.py

Contains logic to:
1) Classify user question into "unblocker", "planner", "explainer", or "default"
2) Provide system prompt templates based on question type.
"""

from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Simple text for classification
CLASSIFICATION_SYSTEM_PROMPT = """You are a classification assistant.
You receive a user question, and you must classify it into exactly one of these categories:
- "unblocker" if the user is stuck or needs direct help solving an immediate problem
- "planner" if the user is scheduling or planning steps
- "explainer" if the user wants a deeper or more conceptual explanation
- "default" otherwise

Return ONLY one word: unblocker, planner, explainer, or default.
Do not add punctuation or extra text. 
"""

def classify_query_type(question: str) -> str:
    """
    Makes a quick LLM call to classify the question.
    Returns one of: "unblocker", "planner", "explainer", "default".
    In production, you could refine this logic or use fine-tuning.
    """
    try:
        response = client.chat.completions.create(model="gpt-4o",
        messages=[
            {"role": "system", "content": CLASSIFICATION_SYSTEM_PROMPT},
            {"role": "user", "content": question}
        ],
        temperature=0.0)
        classification = response.choices[0].message.content.strip().lower()
        # Basic sanity check
        if classification not in ["unblocker", "planner", "explainer", "default"]:
            classification = "default"
        return classification
    except Exception as e:
        print("Error in classify_query_type:", e)
        return "default"


# Different system prompt templates for each type.
PROMPT_TEMPLATES = {
    "unblocker": """You are an AI specialized in quickly unblocking the user. 
Focus on providing direct, concise solutions to the user’s immediate problem. 
Context below:
""",

    "planner": """You are an AI specialized in planning or scheduling. 
Focus on giving structured steps or a clear roadmap for the user’s request.
Context below:
""",

    "explainer": """You are an AI specialized in giving deeper conceptual or educational explanations. 
Focus on clarity and elaboration so the user fully understands the topic.
Context below:
""",

    "default": """You are an AI assistant. 
Provide a helpful answer using the context below:
"""
}
