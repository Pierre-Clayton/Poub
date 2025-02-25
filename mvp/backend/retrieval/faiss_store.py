# backend/retrieval/faiss_store.py

import faiss
import numpy as np
from typing import List, Dict, Any

class FAISSStore:
    def __init__(self, embedding_dim: int = 384):
        """
        Initialize a FAISS flat index for L2 similarity (we'll use it to approximate cosine).
        """
        # We'll create an index that uses inner product or L2 distance
        # If we want to do cosine similarity, we can normalize vectors or use inner product index.
        self.index = faiss.IndexFlatIP(embedding_dim)  # IP -> inner product
        self.embeddings_count = 0
        
        # We'll store metadata (filename, chunk_text) in a list,
        # where the list index matches the FAISS vector ID.
        self.metadata: List[Dict[str, Any]] = []

    def add_embeddings(self, embeddings: np.ndarray, meta_list: List[Dict[str, Any]]):
        """
        Add a batch of embeddings + their metadata (filename, chunk_text) to the index.
        
        :param embeddings: np.ndarray of shape (num_chunks, embedding_dim)
        :param meta_list: list of dicts of length num_chunks, containing 'filename' and 'chunk'
        """
        # Optionally, L2-normalize to approximate cosine similarity
        # or just rely on IP. For pure cosine, we can do:
        faiss.normalize_L2(embeddings)

        self.index.add(embeddings.astype('float32'))
        
        # Add to our metadata
        for m in meta_list:
            self.metadata.append(m)
        
        self.embeddings_count += len(embeddings)

    def search(self, query_emb: np.ndarray, top_k: int = 3) -> List[Dict[str, Any]]:
        """
        Search top_k most similar vectors given a query embedding.
        
        :param query_emb: (embedding_dim,) or (1, embedding_dim) shape
        :param top_k: number of top results
        :return: list of dicts containing {filename, chunk, score}
        """

        query_emb = query_emb.astype('float32').reshape(1, -1)

        # For IP or cosine similarity, we should also normalize the query
        faiss.normalize_L2(query_emb)
        
        query_emb = query_emb.reshape(1, -1).astype('float32')
        # distances, indices => shape: (1, top_k)
        distances, indices = self.index.search(query_emb, top_k)

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:
                # Means no result
                continue
            meta = self.metadata[idx]
            
            # For IP index, "dist" is the inner product between [0..1] if normalized
            # You might interpret or transform that to a 'score'
            results.append({
                "filename": meta["filename"],
                "chunk": meta["chunk"],
                "score": float(dist)  # convert to normal Python float
            })
        
        return results

# Create a global store instance if you want to use it app-wide
faiss_store = FAISSStore()
