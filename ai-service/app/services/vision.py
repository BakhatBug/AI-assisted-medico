import cv2
import numpy as np
from ultralytics import YOLO

# Initialize YOLOv8 Pose Model
# This will auto-download 'yolov8n-pose.pt' (approx 6MB) to the current working directory
try:
    model = YOLO('yolov8n-pose.pt')
except Exception as e:
    print(f"Error loading YOLO model: {e}")
    model = None

def validate_distance(image_bytes):
    try:
        if model is None:
            return "ERROR_MODEL_NOT_LOADED"

        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return "ERROR_DECODING"

        # Run inference
        # verbose=False to reduce logs
        results = model(image, verbose=False)
        
        if not results or len(results) == 0:
            return "NO_PERSON_DETECTED"
            
        # Get first detection
        # Keypoints shape: (N, 17, 3) -> (x, y, conf)
        if not results[0].keypoints or results[0].keypoints.conf is None:
             return "NO_PERSON_DETECTED"
             
        # Normalize coordinates (xyn) are easier for relative checks
        # xyn shape: (N, 17, 2)
        # conf shape: (N, 17)
        kpts_norm = results[0].keypoints.xyn[0].cpu().numpy()
        confs = results[0].keypoints.conf[0].cpu().numpy()
        
        # Indices (COCO Keypoints)
        NOSE = 0
        L_ANKLE = 15
        R_ANKLE = 16
        
        CONF_THRESH = 0.6
        
        # Check visibility
        nose_conf = confs[NOSE]
        l_ankle_conf = confs[L_ANKLE]
        r_ankle_conf = confs[R_ANKLE]
        
        head_visible = nose_conf > CONF_THRESH
        # Require at least one ankle to be very confident, or both moderately
        feet_visible = (l_ankle_conf > CONF_THRESH) or (r_ankle_conf > CONF_THRESH)
        
        # Print debug
        print(f"DEBUG YOLO: Nose: {nose_conf:.2f}, L_Ankle: {l_ankle_conf:.2f}, R_Ankle: {r_ankle_conf:.2f}")

        if not head_visible:
            return "HEAD_NOT_VISIBLE"
            
        if not feet_visible:
            return "TOO_CLOSE_SHOW_FEET"
        
        # Check Boundaries (using normalized coordinates 0.0-1.0)
        nose_y = kpts_norm[NOSE][1]
        l_ankle_y = kpts_norm[L_ANKLE][1]
        r_ankle_y = kpts_norm[R_ANKLE][1]
        
        # Too close to top?
        if nose_y < 0.05:
            return "TOO_CLOSE_HEAD_CUT"
            
        # Too close to bottom? (Feet cut off)
        # Check max Y of visible ankles
        max_ankle_y = 0
        if l_ankle_conf > CONF_THRESH: max_ankle_y = max(max_ankle_y, l_ankle_y)
        if r_ankle_conf > CONF_THRESH: max_ankle_y = max(max_ankle_y, r_ankle_y)
        
        if max_ankle_y > 0.95:
            return "TOO_CLOSE_FEET_CUT"
            
        # Too Far Check
        # Estimate height ratio
        height = max_ankle_y - nose_y
        if height < 0.35:
            return "TOO_FAR"
            
        return "OK"
        
    except Exception as e:
        print(f"Vision Error: {e}")
        return "ERROR"
