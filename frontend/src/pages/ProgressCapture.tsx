import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraCapture from '../components/CameraCapture';
import DietPlanCards from '../components/DietPlanCards';
import axios from 'axios';
import api from '../api/axios';

const ProgressCapture = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Manual Input, 2: Camera, 3: Generating, 4: Result
    const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
    const [dietPlan, setDietPlan] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [manualStats, setManualStats] = useState({
        weight: '',
        height: '',
        age: '',
        goal: 'Maintain',
        activity: 'Moderate'
    });
    const [progress, setProgress] = useState<any>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) {
                    const parsedUser = JSON.parse(userInfo);
                    const config = {
                        headers: { Authorization: `Bearer ${parsedUser.token}` },
                    };
                    const { data } = await api.get('/health', config);
                    setUserProfile(data);

                    // Prefill manual stats
                    if (data) {
                        setManualStats({
                            weight: data.weight?.toString() || '',
                            height: data.height?.toString() || '',
                            age: data.age?.toString() || '',
                            goal: data.goal || 'Maintain',
                            activity: data.activityLevel || 'Moderate'
                        });
                    }
                }
            } catch (err) {
                console.log("Error loading profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2); // Go to Camera
    };

    const handleCapture = (blob: Blob) => {
        setCapturedImage(blob);
    };

    const handleCaptureSuccess = (blob?: Blob) => {
        const imageToUse = blob || capturedImage;
        if (imageToUse) {
            generatePlan(imageToUse);
        } else {
            alert("Error: No image captured. Please try again.");
        }
    };

    const generatePlan = async (imageBlob: Blob) => {
        setStep(3); // Generating
        try {
            const formData = new FormData();
            formData.append('file', imageBlob, 'user_scan.jpg');
            // Use manual stats
            formData.append('age', manualStats.age);
            formData.append('weight', manualStats.weight);
            formData.append('height', manualStats.height);
            formData.append('goal', manualStats.goal);
            formData.append('activity', manualStats.activity);

            // 1. Update Profile (triggers History save on backend)
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const parsedUser = JSON.parse(userInfo);
                const config = {
                    headers: { Authorization: `Bearer ${parsedUser.token}` },
                };

                // Calculate and store local progress before update
                if (userProfile) {
                    const weightDiff = parseFloat(manualStats.weight) - userProfile.weight;
                    setProgress({
                        weightDiff: weightDiff.toFixed(1),
                        oldWeight: userProfile.weight,
                        newWeight: manualStats.weight
                    });
                }

                await api.post('/health', {
                    age: parseInt(manualStats.age),
                    weight: parseFloat(manualStats.weight),
                    height: parseFloat(manualStats.height),
                    goal: manualStats.goal,
                    activityLevel: manualStats.activity
                }, config);

                // 2. Generate Plan
                const response = await axios.post('http://localhost:5000/api/plan/generate', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const plan = response.data;
                setDietPlan(plan);

                // 3. Save Plan
                await api.post('/health/save-plan', { plan }, config);

                setStep(4); // Result
            }

        } catch (error: any) {
            console.error("Generation Error", error);
            const errorMessage = error.response?.data?.detail || error.message || "Unknown error";
            alert(`Failed to generate plan: ${errorMessage}`);
            setStep(1);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Smart Diet Generator</h2>
                <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-slate-700 font-medium transition-colors">
                    &larr; Back to Dashboard
                </button>
            </div>

            {/* Stepper */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center gap-4 text-sm font-medium">
                    <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>1. Details</span>
                    <div className="w-10 h-0.5 bg-slate-200"></div>
                    <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>2. Scan</span>
                    <div className="w-10 h-0.5 bg-slate-200"></div>
                    <span className={`px-3 py-1 rounded-full ${step >= 4 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>3. Plan</span>
                </div>
            </div>

            {step === 1 && (
                <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Update Your Stats</h3>
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Weight (kg)</label>
                            <input
                                type="number"
                                required
                                value={manualStats.weight}
                                onChange={e => setManualStats({ ...manualStats, weight: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    required
                                    value={manualStats.height}
                                    onChange={e => setManualStats({ ...manualStats, height: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                                <input
                                    type="number"
                                    required
                                    value={manualStats.age}
                                    onChange={e => setManualStats({ ...manualStats, age: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Goal</label>
                            <select
                                value={manualStats.goal}
                                onChange={e => setManualStats({ ...manualStats, goal: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="lose_weight">Lose Weight</option>
                                <option value="maintain">Maintain</option>
                                <option value="gain_weight">Gain Weight</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Activity Level</label>
                            <select
                                value={manualStats.activity}
                                onChange={e => setManualStats({ ...manualStats, activity: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="sedentary">Sedentary (Little to no exercise)</option>
                                <option value="light">Light (Exercise 1-3 times/week)</option>
                                <option value="moderate">Moderate (Exercise 4-5 times/week)</option>
                                <option value="active">Active (Daily exercise)</option>
                                <option value="very_active">Very Active (Intense exercise)</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors mt-4">
                            Next: Camera Scan &rarr;
                        </button>
                    </form>
                </div>
            )}

            {step === 2 && (
                <div className="text-center">
                    <div className="mb-6 max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Step 2: Full Body Scan</h3>
                        <p className="text-slate-500">Stand back so your full body (head to toe) is visible. Our AI will analyze your biometrics.</p>
                        <button onClick={() => setStep(1)} className="text-sm text-slate-400 hover:text-slate-600 mt-2">&larr; Back to Stats</button>
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl inline-block border-2 border-slate-700">
                        <CameraCapture
                            onCapture={handleCapture}
                            onValidationSuccess={handleCaptureSuccess}
                        />
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-6xl mb-6 animate-bounce">🥗</div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Curating your personalized menu...</h3>
                    <p className="text-slate-500 mb-8">Saving your progress & generating new plan...</p>
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                </div>
            )}

            {step === 4 && dietPlan && (
                <div className="space-y-8 animate-fade-in-up">

                    {progress && (
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-bold text-emerald-900 mb-1">Progress Report 📈</h4>
                                <p className="text-emerald-700">
                                    You have gone from <span className="font-semibold">{progress.oldWeight}kg</span> to <span className="font-semibold">{progress.newWeight}kg</span>.
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`text-3xl font-bold ${parseFloat(progress.weightDiff) <= 0 ? 'text-emerald-600' : 'text-amber-500'}`}>
                                    {parseFloat(progress.weightDiff) > 0 ? '+' : ''}{progress.weightDiff}kg
                                </span>
                                <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">Change</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 text-center">
                        <span className="font-bold">✨ Success!</span> Your new plan is ready and saved.
                    </div>
                    <DietPlanCards plan={dietPlan} userProfile={{ ...userProfile, ...manualStats }} />

                    <div className="text-center">
                        <button
                            onClick={() => navigate('/history')}
                            className="text-primary hover:text-emerald-700 font-bold mr-6"
                        >
                            View Full History
                        </button>
                        <button
                            onClick={() => setStep(1)}
                            className="text-slate-500 hover:text-slate-800 font-medium underline underline-offset-4"
                        >
                            Start Over
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressCapture;
