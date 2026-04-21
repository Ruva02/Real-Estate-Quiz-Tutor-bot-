import json
import os
import logging
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class RealEstateRAG:
    def __init__(self, knowledge_path="data/knowledge.json", index_path="data/rag_index.faiss", texts_path="data/rag_texts.json"):
        # Silence technical loading reports
        logging.getLogger("transformers.modeling_utils").setLevel(logging.ERROR)
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.knowledge_path = knowledge_path
        self.index_path = index_path
        self.texts_path = texts_path
        self.load_knowledge()
        
    def load_knowledge(self):
        # Check if cached index exists
        if os.path.exists(self.index_path) and os.path.exists(self.texts_path):
            print("🚀 Loading cached RAG index...")
            self.index = faiss.read_index(self.index_path)
            with open(self.texts_path, "r") as f:
                self.texts = json.load(f)
            return

        print("🧠 Building NEW RAG index (this may take a few seconds)...")
        with open(self.knowledge_path, "r") as f:
            data = json.load(f)
            self.concepts = data["concepts"]
            
        self.texts = [
            f"{c['topic']}: {c['definition']} {c.get('details', '')} {c.get('formula', '')} {', '.join(c.get('factors', []))}"
            for c in self.concepts
        ]
        
        embeddings = self.model.encode(self.texts)
        self.dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(np.array(embeddings).astype('float32'))
        
        # Save for future use
        faiss.write_index(self.index, self.index_path)
        with open(self.texts_path, "w") as f:
            json.dump(self.texts, f)
        print("✅ RAG index cached successfully.")
        
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
