from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
api_key = os.getenv("API_KEY") or os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Warning: API_KEY or GEMINI_API_KEY not found in environment variables.")
else:
    genai.configure(api_key=api_key)

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000", # React default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "AI Service is running", "docs_url": "http://localhost:5000/docs"}

from app.api import vision, plan

app.include_router(vision.router, prefix="/api/vision", tags=["vision"])
app.include_router(plan.router, prefix="/api/plan", tags=["plan"])

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        user_message = request.message
        
        if not api_key:
            return {"reply": "Error: API Key not configured on backend."}

        # Dynamically find a supported model
        model_name = 'gemini-1.5-flash' # Default fallback
        try:
            available_models = [m for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            # Prefer flash or pro if available
            preferred = [m.name for m in available_models if 'flash' in m.name or 'pro' in m.name]
            if preferred:
                model_name = preferred[0]
            elif available_models:
                model_name = available_models[0].name
            print(f"Using model: {model_name}")
        except Exception as e:
            print(f"Error listing models: {e}, falling back to {model_name}")

        # Initialize model
        model = genai.GenerativeModel(model_name)
        
        # Generate response
        response = model.generate_content(user_message)
        
        return {"reply": response.text}
    except Exception as e:
        print(f"Error generating response: {e}")
        return {"reply": f"Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
