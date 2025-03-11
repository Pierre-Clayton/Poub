# mvp/backend/retrieval/faiss_store.py

import faiss
import numpy as np
from typing import List, Dict, Any, Optional

class FAISSStore:
    def __init__(self, embedding_dim: int = 384):
        # Index en inner product pour simuler la similarité cosinus
        self.index = faiss.IndexFlatIP(embedding_dim)
        self.embeddings_count = 0
        # Stocke les métadonnées associées à chaque embedding
        self.metadata: List[Dict[str, Any]] = []

    def add_embeddings(self, embeddings: np.ndarray, meta_list: List[Dict[str, Any]]):
        # Normalisation L2 pour une comparaison cosinus
        faiss.normalize_L2(embeddings)
        self.index.add(embeddings.astype('float32'))
        for m in meta_list:
            self.metadata.append(m)
        self.embeddings_count += len(embeddings)

    def search(self, query_emb: np.ndarray, top_k: int = 3, project_id: Optional[str] = None) -> List[Dict[str, Any]]:
        query_emb = query_emb.astype('float32').reshape(1, -1)
        faiss.normalize_L2(query_emb)
        distances, indices = self.index.search(query_emb, top_k)
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:
                continue
            meta = self.metadata[idx]
            # Si un project_id est spécifié, ne retenir que les documents correspondants
            if project_id and meta.get("project_id") != project_id:
                continue
            results.append({
                "filename": meta["filename"],
                "chunk": meta["chunk"],
                "score": float(dist)
            })
        return results

# Instance globale pour usage dans l'application
faiss_store = FAISSStore()
