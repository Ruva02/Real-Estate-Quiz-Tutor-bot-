import chromadb
import os
import json
from sentence_transformers import SentenceTransformer

class VectorService:
    def __init__(self, db_path="data/chroma_db"):
        # Ensure path exists
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        # Initialize persistent client
        self.client = chromadb.PersistentClient(path=db_path)
        # Initialize SentenceTransformer
        self.embed_model = SentenceTransformer('all-MiniLM-L6-v2')
        # Initialize collection
        self.collection = self.client.get_or_create_collection(
            name="properties",
            metadata={"hnsw:space": "cosine"}
        )

    def index_all_properties(self, listings_path="data/listings.json"):
        with open(listings_path, 'r', encoding='utf-8') as f:
            properties = json.load(f)
        
        ids = []
        documents = []
        metadatas = []
        
        for p in properties:
            ids.append(p['id'])
            doc = f"{p['type']} in {p['location']}. {p['highlights']}"
            documents.append(doc)
            metadatas.append({
                "location": p['location'],
                "price": str(p.get('price_value', p.get('price_cr', 0))),
                "type": p['type']
            })
            
        # Generate embeddings manually
        embeddings = self.embed_model.encode(documents).tolist()
            
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )
        print(f"Indexed {len(properties)} properties in ChromaDB.")

    def query_similar_properties(self, query_text, n_results=3):
        # Generate embedding for query
        query_embeddings = self.embed_model.encode([query_text]).tolist()
        
        results = self.collection.query(
            query_embeddings=query_embeddings,
            n_results=n_results
        )
        return results

# Singleton instance
_vector_service = None

def get_vector_service():
    global _vector_service
    if _vector_service is None:
        _vector_service = VectorService()
    return _vector_service
