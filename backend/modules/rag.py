import json
import os
import logging
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class RealEstateRAG:
    def __init__(self, knowledge_path="data/knowledge.json"):
        # Silence technical loading reports for a cleaner 'Guru' experience
        logging.getLogger("transformers.modeling_utils").setLevel(logging.ERROR)
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.knowledge_path = knowledge_path
        self.load_knowledge()
        
    def load_knowledge(self):
        with open(self.knowledge_path, "r") as f:
            data = json.load(f)
            self.concepts = data["concepts"]
            
        # Create texts for index
        self.texts = [
            f"{c['topic']}: {c['definition']} {c.get('details', '')} {c.get('formula', '')} {', '.join(c.get('factors', []))}"
            for c in self.concepts
        ]
        
        # Build FAISS index
        embeddings = self.model.encode(self.texts)
        self.dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(np.array(embeddings).astype('float32'))
        
    def query(self, user_text, k=2):
        query_embedding = self.model.encode([user_text])
        distances, indices = self.index.search(np.array(query_embedding).astype('float32'), k)
        
        results = [self.texts[i] for i in indices[0]]
        return "\n".join(results)

# Initializer for the module
_rag_instance = None

def get_rag():
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = RealEstateRAG()
    return _rag_instance
