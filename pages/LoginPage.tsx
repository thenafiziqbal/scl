import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

type Role = 'admin' | 'teacher' | 'librarian';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@school.com');
    const [password, setPassword] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [activeRole, setActiveRole] = useState<Role>('admin');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useApp();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => { // Simulating network delay
            const success = login(email, password);
            if (!success) {
                setError('লগইন ব্যর্থ। ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
            }
            setLoading(false);
        }, 500);
    };
    
    const setCredentials = (userEmail: string, role: Role) => {
        setEmail(userEmail);
        setPassword('password');
        setActiveRole(role);
        setError('');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-light p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fadeIn">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary">স্কুল পোর্টালে স্বাগতম</h2>
                    <p className="text-gray-500 mt-2">আপনার ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন</p>
                </div>
                
                <div className="flex justify-center space-x-2">
                    <button 
                        onClick={() => setCredentials('admin@school.com', 'admin')} 
                        className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${activeRole === 'admin' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-slate-700 hover:bg-gray-300'}`}
                    >
                        Admin
                    </button>
                    <button 
                        onClick={() => setCredentials('teacher@school.com', 'teacher')} 
                        className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${activeRole === 'teacher' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-slate-700 hover:bg-gray-300'}`}
                    >
                        Teacher
                    </button>
                    <button 
                        onClick={() => setCredentials('librarian@school.com', 'librarian')} 
                        className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${activeRole === 'librarian' ? 'bg-primary text-white shadow-md' : 'bg-gray-200 text-slate-700 hover:bg-gray-300'}`}
                    >
                        Librarian
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">ইমেইল</label>
                        <input 
                            type="email" 
                            id="loginEmail" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-secondary focus:border-secondary transition"
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            id="loginPassword" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-secondary focus:border-secondary transition"
                        />
                         <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 top-7 flex items-center pr-3 text-gray-500 hover:text-primary"
                            aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
                         >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                    </div>
                    {error && <p className="text-sm text-danger text-center">{error}</p>}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-secondary hover:bg-accent text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'প্রসেসিং...' : 'প্রবেশ করুন'}
                    </button>
                </form>
            </div>
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); } 
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default LoginPage;