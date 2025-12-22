import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface HistoryItem {
    date: string;
    weight: number;
    height: number;
    age: number;
    bmi: number;
    stats?: any;
}

const ProgressHistory = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [currentProfile, setCurrentProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const userInfo = localStorage.getItem('userInfo');
                if (!userInfo) {
                    navigate('/login');
                    return;
                }
                const parsedUser = JSON.parse(userInfo);
                const config = {
                    headers: { Authorization: `Bearer ${parsedUser.token}` },
                };
                const { data } = await api.get('/health', config);
                setCurrentProfile(data);

                // Sort history by date descending (newest first)
                if (data.history) {
                    const sortedHistory = [...data.history].sort((a: any, b: any) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    );
                    setHistory(sortedHistory);
                }
            } catch (error) {
                console.error("Error fetching history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [navigate]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div className="flex justify-center py-20 text-slate-500">Loading history...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Progress History 📅</h2>
                <button onClick={() => navigate('/plan')} className="text-slate-500 hover:text-slate-700 font-medium transition-colors">
                    &larr; Back to Plan
                </button>
            </div>

            {/* Current Stats */}
            {currentProfile && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Current Stats (Latest)</h3>
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Active</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Weight</p>
                            <p className="text-2xl font-bold text-slate-800">{currentProfile.weight} <span className="text-sm font-normal text-slate-500">kg</span></p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">BMI</p>
                            <p className="text-2xl font-bold text-slate-800">{currentProfile.stats?.bmi}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Goal</p>
                            <p className="text-lg font-semibold text-slate-800 capitalize">{currentProfile.goal.replace('_', ' ')}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <p className="text-xs text-slate-500 uppercase tracking-wide">Date</p>
                            <p className="text-sm font-semibold text-slate-800">{formatDate(currentProfile.updatedAt)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* History Timeline */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-700 px-1">Previous Records</h3>

                {history.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-400">No history records found yet.</p>
                        <p className="text-sm text-slate-400 mt-1">Renew your plan to track progress!</p>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pl-8 py-2">
                        {history.map((record, index) => {
                            // Calculate diff with NEXT record (which is older in sorted array)
                            // or with current profile if it's the first history item?
                            // Logic: History items are "past" states.
                            // So we just show the state at that time.

                            // Optional: Calculate easy diff if possible
                            // For now simple display
                            return (
                                <div key={index} className="relative bg-white p-6 rounded-xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1">
                                    <div className="absolute -left-[41px] top-6 w-5 h-5 bg-white border-4 border-slate-300 rounded-full"></div>

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-slate-400 font-medium mb-1">{formatDate(record.date)}</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-bold text-slate-700">{record.weight} kg</span>
                                                {record.bmi && <span className="text-sm text-slate-500 bg-slate-100 px-2 py-0.5 rounded">BMI: {record.bmi}</span>}
                                            </div>
                                        </div>

                                        <div className="flex gap-8 text-sm text-slate-500 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                            <div>
                                                <span className="block text-xs uppercase text-slate-400">Height</span>
                                                {record.height} cm
                                            </div>
                                            <div>
                                                <span className="block text-xs uppercase text-slate-400">Age</span>
                                                {record.age}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressHistory;
