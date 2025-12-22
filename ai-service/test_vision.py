import requests
import cv2
import numpy as np
import io

# 1. Create a dummy black image
img = np.zeros((480, 640, 3), dtype=np.uint8)
_, img_encoded = cv2.imencode('.jpg', img)
img_bytes = img_encoded.tobytes()

# 2. Define API URL
url = 'http://localhost:5000/api/vision/validate'

# 3. Send Request
try:
    print(f"Sending request to {url}...")
    files = {'file': ('test.jpg', img_bytes, 'image/jpeg')}
    response = requests.post(url, files=files)
    
    # 4. Print Result
    if response.status_code == 200:
        print("Success! Response:")
        print(response.json())
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"Failed to connect: {e}")
