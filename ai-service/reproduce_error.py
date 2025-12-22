import requests

url = 'http://localhost:5000/api/plan/generate'
files = {'file': open(r'C:/Users/PMY/.gemini/antigravity/brain/17899efe-f3a3-4b66-973a-dcdeda9aebfb/uploaded_image_1766143741827.png', 'rb')}
data = {
    'age': '25',
    'weight': '70',
    'height': '170',
    'goal': 'Maintain',
    'activity': 'Moderate'
}

print(f"Sending request to {url}...")
try:
    response = requests.post(url, files=files, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Text: {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
