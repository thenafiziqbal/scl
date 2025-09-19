import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LoginPage: React.FC = () => {
    const { login } = useApp();
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@school.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            // Navigation will be handled by the App component's effect
            // after user state is updated. We don't need to navigate here.
        } catch (err: any) {
            if (err.message && err.message.toLowerCase().includes('invalid login credentials')) {
                setError('ভুল ইমেইল অথবা পাসওয়ার্ড।');
            } else {
                setError('একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-light font-sans">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary">স্কুল পোর্টাল লগইন</h1>
                    <p className="text-gray-500">আপনার একাউন্টে প্রবেশ করুন</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">ইমেইল</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-secondary focus:border-secondary"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">পাসওয়ার্ড</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-secondary focus:border-secondary"
                        />
                    </div>
                    {error && <p className="text-sm text-danger text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-secondary hover:bg-accent text-white font-bold py-2 px-4 rounded-lg shadow-lg disabled:bg-gray-400"
                        >
                            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;