import { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

interface CameraCaptureProps {
    onValidationSuccess: (blob?: Blob) => void;
    onCapture?: (blob: Blob) => void;
}

const CameraCapture = ({ onValidationSuccess, onCapture }: CameraCaptureProps) => {
    const webcamRef = useRef<Webcam>(null);
    const [instructions, setInstructions] = useState<string>('Initializing Camera...');
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [countdown, setCountdown] = useState<number | null>(null);

    // NOTE: Direct call to Python Service (Port 5000)
    const VISION_API_URL = 'http://localhost:5000/api/vision/validate';

    // Auto-capture Logic
    useEffect(() => {
        let timer: any;
        if (isValid && countdown === null) {
            setCountdown(3); // Start 3s countdown
        } else if (isValid && countdown !== null && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (isValid && countdown === 0) {
            handleSuccessClick(); // Trigger capture
            setCountdown(null); // Reset
        } else if (!isValid) {
            setCountdown(null); // Reset if lost valid position
        }
        return () => clearTimeout(timer);
    }, [isValid, countdown]);

    const captureAndValidate = useCallback(async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) return;

            // Convert base64 to blob
            const blob = await fetch(imageSrc).then(res => res.blob());
            const formData = new FormData();
            formData.append('file', blob, 'capture.jpg');

            try {
                const response = await axios.post(VISION_API_URL, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const status = response.data.status;
                let feedback = "";
                let valid = false;

                switch (status) {
                    case 'OK':
                        feedback = "Perfect! Hold still... 📸";
                        valid = true;
                        break;
                    case 'TOO_CLOSE':
                    case 'TOO_CLOSE_SHOW_FEET':
                        feedback = "Too Close! Step back to show your feet. 👣";
                        break;
                    case 'TOO_CLOSE_HEAD_CUT':
                        feedback = "Too Close! Step back to show your head. 👤";
                        break;
                    case 'HEAD_NOT_VISIBLE':
                        feedback = "Face not visible. Please look at the camera. 😐";
                        break;
                    case 'TOO_FAR':
                        feedback = "Too Far! Step a bit closer. 🏃‍♂️";
                        break;
                    case 'NO_PERSON_DETECTED':
                        feedback = "No person detected. Stand in frame. 🧍";
                        break;
                    default:
                        feedback = "Position yourself clearly in frame. 📸";
                }

                setInstructions(valid ? `Auto-capturing in ${countdown || 3}...` : feedback);
                setIsValid(valid);

            } catch (error) {
                console.error("Vision API Error", error);
                setInstructions('Service Disconnected');
                setIsValid(false);
            }
        }
    }, [webcamRef, countdown]); // Added countdown dep to update text

    useEffect(() => {
        const interval = setInterval(() => {
            captureAndValidate();
        }, 1500); // Check every 1.5 seconds

        return () => clearInterval(interval);
    }, [captureAndValidate]);

    const getStatusClasses = () => {
        if (isValid) return 'border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.6)]';
        if (instructions.includes('Too Close')) return 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]';
        if (instructions.includes('Too Far')) return 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]';
        return 'border-slate-300';
    };

    const getBadgeClasses = () => {
        if (isValid) return 'bg-emerald-500';
        if (instructions.includes('Too Close')) return 'bg-red-500';
        if (instructions.includes('Too Far')) return 'bg-amber-500';
        return 'bg-slate-600';
    };

    const handleSuccessClick = async () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                const blob = await fetch(imageSrc).then(res => res.blob());
                if (onCapture) {
                    onCapture(blob);
                }
                // Only succeed if validation was good
                if (isValid) {
                    onValidationSuccess(blob);
                }
                return;
            }
        }
        // Fallback
        onValidationSuccess();
    };

    const onUserMediaError = useCallback((err: string | DOMException) => {
        setError("Camera access denied");
        console.error(err);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-4">
            {error && <div className="text-red-500 font-bold mb-4 bg-red-50 px-4 py-2 rounded-lg">{error}</div>}

            <div className={`relative rounded-3xl overflow-hidden border-4 transition-all duration-300 bg-black ${getStatusClasses()}`}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="block w-full max-w-2xl h-auto"
                    videoConstraints={{ facingMode: "user" }}
                    onUserMediaError={onUserMediaError}
                />

                {/* Overlay Grid (Rule of Thirds) - Optional for pro feel */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 pointer-events-none">
                    <div className="border-r border-white"></div>
                    <div className="border-r border-white"></div>
                    <div></div>
                    <div className="border-r border-white border-t"></div>
                    <div className="border-r border-white border-t"></div>
                    <div className="border-t border-white"></div>
                    <div className="border-r border-white border-t"></div>
                    <div className="border-r border-white border-t"></div>
                    <div className="border-t border-white"></div>
                </div>
            </div>

            <div className={`mt-8 px-8 py-3 rounded-full text-white font-bold text-lg shadow-lg transition-colors duration-300 flex items-center gap-3 ${getBadgeClasses()}`}>
                {isValid ? (
                    <span className="animate-pulse">🟢</span>
                ) : (
                    <span>⚠️</span>
                )}
                {instructions}
            </div>

            {isValid && (
                <button
                    onClick={handleSuccessClick}
                    className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold py-4 px-10 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 animate-pulse"
                >
                    Capture Now 📸
                </button>
            )}
        </div>
    );
};

export default CameraCapture;
