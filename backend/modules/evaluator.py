import os
from groq import AsyncGroq
from dotenv import load_dotenv
from modules.vector_service import get_vector_service

load_dotenv()

class Evaluator:
    def __init__(self):
        self.client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
        self.vector_service = get_vector_service()
        
    def _get_evaluation_prompt(self, property_data, question, user_answer, context, comparables):
        return f"""
        You are a Real Estate Expert and AI Tutor.
        
        PROPERTY DATA:
        {property_data}
        
        QUESTION:
        {question}
        
        USER ANSWER:
        {user_answer}
        
        ADDITIONAL KNOWLEDGE:
        {context}

        COMPARABLE PROPERTIES (Market Context from Vector DB):
        {comparables}
        
        Evaluate the user's answer based on:
        1. Accuracy (Real estate logic)
        2. Completeness
        3. Understanding of concepts like ROI, Valuation, and Market Trends.
        
        Format your response as a JSON object:
        {{
            "score": <0-10>,
            "strengths": "<brief list of what they did well>",
            "mistakes": "<brief list of logical errors>",
            "missing_concepts": ["<concept1>", "<concept2>"],
            "deep_explanation": "<A detailed expert explanation providing context, market trends, and logic>"
        }}
        """

    async def evaluate(self, property_data, question, user_answer, context):
        # Fetch comparable properties for added market context
        similar = self.vector_service.query_similar_properties(question + " " + user_answer, n_results=2)
        comparables = ""
        if similar and 'documents' in similar and similar['documents']:
            comparables = "\n".join(similar['documents'][0])

        prompt = self._get_evaluation_prompt(property_data, question, user_answer, context, comparables)
        
        completion = await self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a real estate expert tutor. Always respond in JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        return completion.choices[0].message.content

    async def evaluate_stream(self, property_data, question, user_answer, context):
        """Streams the evaluation for better perceived performance."""
        similar = self.vector_service.query_similar_properties(question + " " + user_answer, n_results=2)
        comparables = ""
        if similar and 'documents' in similar and similar['documents']:
            comparables = "\n".join(similar['documents'][0])

        prompt = self._get_evaluation_prompt(property_data, question, user_answer, context, comparables)

        stream = await self.client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a real estate expert tutor. Always respond in JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            stream=True
        )
        
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content

# Initializer
_evaluator_instance = None

def get_evaluator():
    global _evaluator_instance
    if _evaluator_instance is None:
        _evaluator_instance = Evaluator()
    return _evaluator_instance
