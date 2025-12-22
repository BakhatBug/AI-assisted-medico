from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
from typing import List

router = APIRouter()

class DietPlanRequest(BaseModel):
    age: int
    weight: float
    height: float
    goal: str
    activity: str

@router.post("/generate")
async def generate_diet_plan(
    file: UploadFile = File(...),
    age: str = Form(...),
    weight: str = Form(...),
    height: str = Form(...),
    goal: str = Form(...),
    activity: str = Form(...)
):
    try:
        api_key = os.getenv("API_KEY") or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API Key not configured")

        genai.configure(api_key=api_key)

        contents = await file.read()

        model_name = 'models/gemini-1.5-flash'

        try:
            available_models = [m for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
            flash_15 = [m.name for m in available_models if 'flash' in m.name and '1.5' in m.name]
            any_flash = [m.name for m in available_models if 'flash' in m.name]

            if flash_15:
                model_name = flash_15[0]
            elif any_flash:
                model_name = any_flash[0]
            elif available_models:
                model_name = available_models[0].name

        except Exception as e:
            print(f"Error listing models: {e}, using fallback {model_name}")

        model = genai.GenerativeModel(model_name)

        prompt = f"""
        You are an expert AI Nutritionist.
        Analyze the provided image of the person to ESTIMATE their biometric stats (Age, Gender, Height, Weight) for comparison.

        PROVIDED User Stats:
        - Age: {age}
        - Weight: {weight} kg
        - Height: {height} cm
        - Goal: {goal}
        - Activity Level: {activity}

        Create a personalized 7-Day Diet Plan.

        CRITICAL: Return ONLY valid JSON matching this schema:
        {{
            "plan_name": "string",
            "analysis": "string (brief analysis)",
            "estimated_stats": {{
                "age": "string",
                "gender": "string",
                "height": "string",
                "weight": "string",
                "shoulder_width": "string (narrow/medium/broad or cm)",
                "bmi": "string"
            }},
            "days": [
                {{
                    "day_label": "Day 1",
                    "meals": [
                        {{ "type": "Breakfast", "food": "string", "calories": "string" }},
                        {{ "type": "Lunch", "food": "string", "calories": "string" }},
                        {{ "type": "Dinner", "food": "string", "calories": "string" }},
                        {{ "type": "Snack", "food": "string", "calories": "string" }}
                    ]
                }},
                ... (Repeat for Day 2 to Day 7)
            ]
        }}
        Do not include markdown code blocks. Just the raw JSON string.
        """

        image_part = {
            "mime_type": file.content_type or "image/jpeg",
            "data": contents
        }

        response = model.generate_content([prompt, image_part])

        if not response.parts:
            raise ValueError(f"AI blocked request or returned empty. Reason: {response.prompt_feedback}")

        text = response.text

        try:
            start = text.find('{')
            end = text.rfind('}') + 1
            if start != -1 and end != -1:
                json_str = text[start:end]
                return json.loads(json_str)
            else:
                raise ValueError("AI response did not contain valid JSON")
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse AI response: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")
