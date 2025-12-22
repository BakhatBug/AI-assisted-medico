import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const HealthProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        height: '',
        weight: '',
        activityLevel: 'sedentary',
        waterIntake: '0',
        goal: 'maintain'
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('userInfo')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await api.post('/health', formData, config);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error saving profile');
        }
    };

    const inputClasses = "w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-slate-50 focus:bg-white";
    const labelClasses = "block text-sm font-medium text-slate-700 mb-1";

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage Health Profile</h2>

            {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-6 border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>Age</label>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} required className={inputClasses} placeholder="e.g. 25" />
                    </div>
                    <div>
                        <label className={labelClasses}>Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className={inputClasses}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClasses}>Height (cm)</label>
                        <input type="number" name="height" value={formData.height} onChange={handleChange} required className={inputClasses} placeholder="e.g. 175" />
                    </div>
                    <div>
                        <label className={labelClasses}>Weight (kg)</label>
                        <input type="number" name="weight" value={formData.weight} onChange={handleChange} required className={inputClasses} placeholder="e.g. 70" />
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Activity Level</label>
                    <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className={inputClasses}>
                        <option value="sedentary">Sedentary (little or no exercise)</option>
                        <option value="light">Lightly active (1-3 days/week)</option>
                        <option value="moderate">Moderately active (3-5 days/week)</option>
                        <option value="active">Active (6-7 days/week)</option>
                        <option value="very_active">Very active (physical job or 2x training)</option>
                    </select>
                </div>

                <div>
                    <label className={labelClasses}>Goal</label>
                    <select name="goal" value={formData.goal} onChange={handleChange} className={inputClasses}>
                        <option value="lose_weight">Lose Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="gain_weight">Gain Weight</option>
                    </select>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors shadow-md shadow-emerald-500/20">
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default HealthProfile;
