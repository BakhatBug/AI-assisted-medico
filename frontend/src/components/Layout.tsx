import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', icon: '📊' },
        { label: 'Profile', path: '/profile', icon: '👤' },
        { label: 'My Plan', path: '/plan', icon: '📅' },
        { label: 'New Scan', path: '/capture', icon: '📸' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 text-slate-800">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm fixed h-full z-10">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-primary tracking-tight">Medico AI</h1>
                    <p className="text-xs text-secondary mt-1">AI-Assisted Diet Planning</p>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {menuItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${location.pathname === item.path
                                    ? 'bg-emerald-50 text-emerald-600 font-semibold shadow-sm ring-1 ring-emerald-200'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }}
                        className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 relative">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 p-4 flex justify-between items-center z-20">
                <h1 className="text-xl font-bold text-primary">Medico AI</h1>
                <button onClick={() => navigate('/dashboard')} className="text-2xl">☰</button>
            </div>
        </div>
    );
};

export default Layout;
