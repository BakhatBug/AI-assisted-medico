import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', {
                name,
                email,
                password,
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-full bg-primary/10 text-3xl mb-4">🚀</div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 mt-2">Join Medico AI and start your journey</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-6 border border-red-100 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-slate-400 bg-slate-50 focus:bg-white"
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-transform active:scale-[0.98] shadow-md shadow-emerald-500/20">
                        Get Started
                    </button>
                </form>
                <div className="mt-8 text-center text-sm text-slate-500">
                    Already have an account? <Link to="/login" className="text-primary hover:text-emerald-700 font-semibold transition-colors">Sign in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
