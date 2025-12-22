import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DietPlanCards from '../components/DietPlanCards';
import api from '../api/axios';

const PlanPage = () => {
    const navigate = useNavigate();
    const [plan, setPlan] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/login');
            return;
        }

        const parsedUser = JSON.parse(userInfo);

        const fetchPlan = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${parsedUser.token}` },
                };
                const { data } = await api.get('/health', config);
                setProfile(data); // Profile contains the user data for comparison
                if (data.lastDietPlan) {
                    setPlan(data.lastDietPlan);
                }
            } catch (error) {
                console.error("Error fetching plan", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [navigate]);

    if (loading) return <div className="flex justify-center items-center h-64 text-slate-500">Loading your plan...</div>;

    if (!plan) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
                <div className="text-4xl mb-4">🥗</div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">No Plan Found</h2>
                <p className="text-slate-500 mb-6">You haven't generated a diet plan yet.</p>
                <button
                    onClick={() => navigate('/capture')}
                    className="bg-primary hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
                >
                    Generate Now
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Your 7-Day Diet Plan</h1>
            <DietPlanCards plan={plan} userProfile={profile} />

            <div className="flex justify-center gap-4 mt-8 mb-12">
                <button
                    onClick={() => navigate('/history')}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                    📜 View Progress History
                </button>
                <button
                    onClick={() => navigate('/capture')}
                    className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-md flex items-center gap-2"
                >
                    🔄 Renew Plan
                </button>
            </div>
        </div>
    );
};

export default PlanPage;
