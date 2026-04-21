from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json
import os
from sqlalchemy.orm import Session

import aiofiles
from fastapi.responses import StreamingResponse
from modules.generator import get_generator
from modules.evaluator import get_evaluator
from modules.rag import get_rag
from database import get_db, User
from auth_utils import get_password_hash, verify_password, create_access_token, decode_access_token

app = FastAPI(title="AI Real Estate Tutor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserAuth(BaseModel):
    username: str
    password: str

class EvaluateRequest(BaseModel):
    property_data: dict
    question: str
    user_answer: str

# Dependency to get current user
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@app.post("/register")
def register(user_data: UserAuth, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user_data.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_user = User(
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        weak_topics=[],
        total_score=0,
        questions_answered=0
    )
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user_data: UserAuth, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/next-question")
def next_question(current_user: User = Depends(get_current_user)):
    generator = get_generator()
    # Use user's real stats from DB
    user_stats = {
        "weak_topics": current_user.weak_topics,
        "total_score": current_user.total_score,
        "questions_answered": current_user.questions_answered
    }
    prop, question = generator.get_question(user_stats)
    return {
        "property": prop,
        "question": question
    }

@app.post("/evaluate")
async def evaluate_answer(req: EvaluateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rag = get_rag()
    evaluator = get_evaluator()
    
    # Retrieve context for the answer
    context = rag.query(req.user_answer + " " + req.question)
    
    # Evaluate via LLM (Now Async)
    result_str = await evaluator.evaluate(req.property_data, req.question, req.user_answer, context)
    result = json.loads(result_str)
    
    # Update user stats in DB
    if result.get("missing_concepts"):
        current_topics = list(current_user.weak_topics or [])
        current_topics.extend(result["missing_concepts"])
        current_user.weak_topics = list(set(current_topics))
    
    current_user.total_score += result.get("score", 0)
    current_user.questions_answered += 1
    
    db.commit()
    
    return result

@app.post("/evaluate-stream")
async def evaluate_answer_stream(req: EvaluateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rag = get_rag()
    evaluator = get_evaluator()
    context = rag.query(req.user_answer + " " + req.question)
    
    async def event_generator():
        accumulated = ""
        async for chunk in evaluator.evaluate_stream(req.property_data, req.question, req.user_answer, context):
            accumulated += chunk
            yield chunk
        
        # After stream finished, update User stats in DB
        try:
            result = json.loads(accumulated)
            if result.get("missing_concepts"):
                current_topics = list(current_user.weak_topics or [])
                current_topics.extend(result["missing_concepts"])
                current_user.weak_topics = list(set(current_topics))
            
            current_user.total_score += result.get("score", 0)
            current_user.questions_answered += 1
            db.commit()
        except Exception as e:
            print(f"Stream DB Update Error: {e}")

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.get("/stats")
def get_stats(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "weak_topics": current_user.weak_topics,
        "total_score": current_user.total_score,
        "questions_answered": current_user.questions_answered
    }

@app.get("/all-properties")
async def get_all_properties(current_user: User = Depends(get_current_user)):
    try:
        async with aiofiles.open(os.path.join("data", "listings.json"), mode="r") as f:
            content = await f.read()
            return json.loads(content)
    except FileNotFoundError:
        return []

@app.get("/academy")
async def get_academy(current_user: User = Depends(get_current_user)):
    try:
        async with aiofiles.open(os.path.join("data", "knowledge.json"), mode="r") as f:
            content = await f.read()
            return json.loads(content)
    except FileNotFoundError:
        return {"concepts": []}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

