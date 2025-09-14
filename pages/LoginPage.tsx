import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@school.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useApp();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        setTimeout(() => { // Simulating network delay
            const success = login(email);
            if (!success) {
                setError('লগইন ব্যর্থ। ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।');
            }
            setLoading(false);
        }, 500);
    };
    
    const setCredentials = (userEmail: string) => {
        setEmail(userEmail);
        setPassword('password');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6 animate-fadeIn">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-primary">স্কুল পোর্টালে স্বাগতম</h2>
                    <p className="text-gray-500 mt-2">আপনার ইমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন</p>
                </div>
                
                <div className="flex justify-center space-x-2">
                    <button onClick={() => setCredentials('admin@school.com')} className="text-xs bg-gray-200 px-2 py-1 rounded">Admin</button>
                    <button onClick={() => setCredentials('teacher@school.com')} className="text-xs bg-gray-200 px-2 py-1 rounded">Teacher</button>
                    <button onClick={() => setCredentials('librarian@school.com')} className="text-xs bg-gray-200 px-2 py-1 rounded">Librarian</button>
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
                    <div>
                        <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
                        <input 
                            type="password" 
                            id="loginPassword" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-secondary focus:border-secondary transition"
                        />
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