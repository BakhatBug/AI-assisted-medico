import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("API_KEY") or os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("Listing models...")
available_models = [m for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
print(f"Found {len(available_models)} models")

model_name = 'models/gemini-1.5-flash'
preferred = [m.name for m in available_models if 'flash' in m.name and '1.5' in m.name]
if preferred:
    model_name = preferred[0]
elif available_models:
    # Relaxed fallback: just 'flash'
    flash_models = [m.name for m in available_models if 'flash' in m.name]
    if flash_models:
        model_name = flash_models[0]
    else:
        model_name = available_models[0].name

print(f"Selected model: {model_name}")

try:
    model = genai.GenerativeModel(model_name)
    response = model.generate_content("Hello, this is a test.")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Generation FAILED: {e}")
