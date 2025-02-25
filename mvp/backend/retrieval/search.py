# backend/retrieval/search.py

import numpy as np
from typing import List, Dict, Any
from retrieval.embeddings import get_embedding
from retrieval.utils import cosine_similarity

def search_in_documents_store(
    query: str, 
    documents_store: Dict[str, List[Dict[str, Any]]], 
    top_k: int = 3
) -> List[Dict[str, Any]]:
    """
    Search over all documents in documents_store and return the top_k matched chunks.
    
    :param query: User's search query string
    :param documents_store: The in-memory dict of doc_name -> list of {"chunk":..., "embedding":...}
    :param top_k: How many top matches to return
    :return: A list of dicts containing the "filename", "chunk", and "score"
    """
    # 1) Embed the query
    query_emb = get_embedding(query)

    # 2) Iterate over all docs and their chunks, compute similarity
    all_results = []
    for filename, chunk_list in documents_store.items():
        for item in chunk_list:
            chunk_text = item["chunk"]
            chunk_emb = item["embedding"]
            score = cosine_similarity(query_emb, chunk_emb)
            
            all_results.append({
                "filename": filename,
                "chunk": chunk_text,
                "score": score
            })
    
    # 3) Sort by descending score
    all_results.sort(key=lambda x: x["score"], reverse=True)
    
    # 4) Return top_k
    return all_results[:top_k]
