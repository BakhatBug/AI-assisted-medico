import mediapipe
print("DIR:", dir(mediapipe))
try:
    import mediapipe.python.solutions
    print("Found mediapipe.python.solutions")
except ImportError as e:
    print("ImportError:", e)
