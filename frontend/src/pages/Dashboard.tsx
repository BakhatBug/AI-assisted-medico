import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);

        const fetchProfile = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${parsedUser.token}` },
                };
                const { data } = await api.get('/health', config);
                setProfile(data);
            } catch (error) {
                console.log('No profile found or error fetching');
            }
        };

        fetchProfile();
    }, [navigate]);

    if (!user) return <div className="flex justify-center items-center h-full text-slate-500">Loading...</div>;

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Hello, {user.name}! 👋</h1>
                    <p className="text-slate-500 mt-1">Here's your health overview for today.</p>
                </div>
            </header>

            {!profile ? (
                <div className="bg-amber-50 md:max-w-xl mx-auto p-6 rounded-xl border border-amber-200 text-center shadow-sm">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h3 className="text-xl font-bold text-amber-900 mb-2">Complete Your Profile</h3>
                    <p className="text-amber-700 mb-6">We need your basic health data to calculate your personalized plan.</p>
                    <button
                        onClick={() => navigate('/profile')}
                        className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                        Setup Profile
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Metrics Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-700">Health Metrics</h3>
                            <span className="text-2xl">📊</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-slate-500">BMI</span>
                                <span className="text-lg font-semibold text-primary">{profile.stats?.bmi}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-slate-500">BMR</span>
                                <span className="font-medium">{profile.stats?.bmr} kcal</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-slate-500">Target</span>
                                <span className="font-medium">{profile.stats?.calories} kcal</span>
                            </div>
                        </div>
                    </div>

                    {/* Profile Summary */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-700">Your Profile</h3>
                            <button onClick={() => navigate('/profile')} className="text-sm text-primary hover:text-emerald-700 font-medium">Edit</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-50 p-3 rounded-lg">
                                <p className="text-slate-400 text-xs">Height</p>
                                <p className="font-semibold text-slate-700 text-lg">{profile.height} cm</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg">
                                <p className="text-slate-400 text-xs">Weight</p>
                                <p className="font-semibold text-slate-700 text-lg">{profile.weight} kg</p>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg col-span-2">
                                <p className="text-slate-400 text-xs">Goal</p>
                                <p className="font-semibold text-slate-700 capitalize">{profile.goal.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Card */}
                    <div className="bg-gradient-to-br from-primary to-emerald-600 p-6 rounded-xl shadow-md text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Diet Plan Generator</h3>
                            <p className="text-emerald-50 text-sm opacity-90">Get a new AI-crafted meal plan adapted to your latest stats.</p>
                        </div>
                        <button
                            onClick={() => navigate('/capture')}
                            className="mt-6 bg-white text-emerald-600 font-bold py-3 px-4 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 relative z-10"
                        >
                            <span>🥗</span> Create New Plan
                        </button>
                        {/* Decorative Circle */}
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                    </div>

                    {/* AI Insights (Full Body Scan) */}
                    {profile.lastDietPlan?.estimated_stats && (
                        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-md md:col-span-2 lg:col-span-3 border border-slate-800">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🤖</span>
                                <div>
                                    <h3 className="font-bold text-lg">AI Body Analysis Insights</h3>
                                    <p className="text-slate-400 text-xs">Derived from your recent full-body scan</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Est. BMI', value: profile.lastDietPlan.estimated_stats.bmi },
                                    { label: 'Shoulder Width', value: profile.lastDietPlan.estimated_stats.shoulder_width },
                                    { label: 'Est. Height', value: profile.lastDietPlan.estimated_stats.height },
                                    { label: 'Est. Weight', value: profile.lastDietPlan.estimated_stats.weight }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
                                        <p className="text-lg font-bold text-emerald-400">{stat.value || 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Current Plan Preview */}
                    {profile.lastDietPlan && (
                        <div className="md:col-span-2 lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">📋 Current Plan: {profile.lastDietPlan.plan_name}</h3>
                                    <p className="text-slate-500 text-sm mt-1 italic max-w-2xl">"{profile.lastDietPlan.analysis}"</p>
                                </div>
                                <button
                                    onClick={() => navigate('/plan')}
                                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
                                >
                                    View Full 7-Day Plan &rarr;
                                </button>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Day 1 Preview</h4>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {profile.lastDietPlan.days && profile.lastDietPlan.days[0]?.meals.map((meal: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 min-w-[160px] flex-shrink-0">
                                            <div className="text-xs font-bold text-primary mb-1 uppercase">{meal.type}</div>
                                            <div className="text-sm text-slate-800 font-medium line-clamp-2">{meal.food}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
