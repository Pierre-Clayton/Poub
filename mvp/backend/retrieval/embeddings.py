# backend/retrieval/embeddings.py

from sentence_transformers import SentenceTransformer
from typing import List
import numpy as np

# Load a pre-trained model (only once)
# 'all-MiniLM-L6-v2' is a popular general-purpose model, ~110MB in size
_model_name = "all-MiniLM-L6-v2"
_model = SentenceTransformer(_model_name)

def get_embedding(text: str) -> np.ndarray:
    """
    Returns the embedding (numpy array) for a single piece of text.
    """
    embedding = _model.encode(text, convert_to_numpy=True)
    return embedding

def batch_get_embeddings(texts: List[str]) -> np.ndarray:
    """
    Returns embeddings for a list of texts in a single batch call.
    
    :param texts: List of text strings
    :return: Numpy array of shape (len(texts), embedding_dim)
    """
    embeddings = _model.encode(texts, convert_to_numpy=True)
    return embeddings
