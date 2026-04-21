import random
import json
import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

class QuestionGenerator:
    def __init__(self, listings_path="data/listings.json"):
        with open(listings_path, "r") as f:
            self.listings = json.load(f)
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
            
    def get_question(self, user_stats=None):
        # Pick a random property
        prop = random.choice(self.listings)
        
        # Define complex real estate themes for diversity
        THEMES = [
            "Real Estate Valuation",
            "ROI (Return on Investment)",
            "Market Trends in India",
            "Rental Yield",
            "Indore Real Estate Context",
            "Risk Mitigation & Contingency Planning",
            "Legal & Regulatory Compliance",
            "Urban Planning & Zoning Impact",
            "Architectural Value & Space Optimization",
            "Demographic Shifts & Market Sentiment",
            "Exit Strategy & Liquidity Analysis",
            "Environmental Sustainability & ESG Impact",
            "Capital Structure & Financing Nuances",
            "Operational Efficiency (CapEx vs OpEx)",
            "Technological Integration (PropTech)",
            "Valuation Sensitivity Analysis",
            "Hyper-local Supply & Demand Dynamics"
        ]
        
        # Influence theme selection based on weak topics if they exist
        target_theme = random.choice(THEMES)
        if user_stats and user_stats.get("weak_topics"):
            # Try to match a weak topic to our themes or just mention it
            weak_topics = user_stats["weak_topics"]
            target_theme = random.choice(weak_topics) if weak_topics else target_theme


        prompt = f"""
        You are a World-Class Real Estate Analyst and Masterclass Tutor.
        
        TASK:
        Generate a single, professional, and intellectually challenging question about the provided PROPERTY DATA.
        
        FOCAL THEME: 
        {target_theme}
        
        GUIDELINES:
        1. Avoid generic 'ROI' or 'is it a good deal' questions.
        2. Focus on the nuances of {target_theme}.
        3. Challenge the student's ability to analyze hidden risks or unique opportunities.
        4. Consider the property's specific attributes: {prop.get('type')}, {prop.get('location')}, and {prop.get('highlights')}.
        
        PROPERTY DATA (JSON):
        {json.dumps(prop, indent=2)}
        
        The question MUST be concise (max 30 words), provocative, and elite in its phrasing.
        Only output the question text.
        """
        
        try:
            completion = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a Real Estate Guru. Generate a brilliant, provocative masterclass question."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=80
            )
            question = completion.choices[0].message.content.strip()
            # Remove quotes if the LLM added them
            question = question.strip('"').strip("'")
        except Exception as e:
            logging.error(f"LLM Question Generation failed: {e}")
            # Fallback to smart random question
            question_types = [
                f"How would current {target_theme} concerns impact the long-term holding strategy for this {prop.get('type')}?",
                f"What is the most significant {target_theme} risk posed by this property's location in {prop.get('location')}?",
                f"How does the {prop.get('type')} status influence its {target_theme} compared to commercial alternatives?"
            ]
            question = random.choice(question_types)
        
        return prop, question

# Initializer
_generator_instance = None

def get_generator():
    global _generator_instance
    if _generator_instance is None:
        _generator_instance = QuestionGenerator()
    return _generator_instance
