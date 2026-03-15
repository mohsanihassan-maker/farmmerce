import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ArrowRight, Sprout, ShoppingCart, Eye, EyeOff } from 'lucide-react';

import { motion } from 'framer-motion';
import { API_URL } from '../config';

import { supabase } from '../supabase';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('BUYER'); // BUYER or FARMER
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Call backend registration first
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // 2. Now handle Supabase signup to ensure the user exists in SB Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                        role: role
                    }
                }
            });

            if (authError) {
                // If it's a rate limit error, we should tell the user
                if (authError.message.toLowerCase().includes('rate limit exceeded')) {
                    throw authError;
                }
                // For other errors (like user already exists), we just log as we might still have a local account
                console.warn('Supabase signup note:', authError.message);
            }

            // 3. Complete login
            if (authData.session || data.token) {
                const token = authData.session?.access_token || data.token;
                login(data.user, token);
                navigate('/dashboard');
            } else {
                setError('Registration successful! Please check your email for a confirmation link.');
            }

        } catch (err: any) {
            console.error('Registration error:', err);
            let errorMessage = err.message || 'Failed to register. Please try again.';
            
            if (errorMessage.toLowerCase().includes('email rate limit exceeded')) {
                errorMessage = 'Email rate limit exceeded. Supabase free tier allows only a few registration emails per hour. Please wait about 1 minute and try again.';
            } else if (err instanceof TypeError && err.message === 'Failed to fetch') {
                errorMessage = 'Cannot connect to the backend server. Please make sure it is running on http://localhost:3000';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
                <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <Link to="/" className="flex justify-center hover:opacity-80 transition mb-8">
                    <img src="/farmmerce-20.png" alt="Farmmerce" className="h-12 w-auto object-contain" />
                </Link>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-lg border border-white/10 py-8 px-4 shadow-2xl rounded-2xl sm:px-10"
                >
                    <div className="mb-6 text-center">
                        <h2 className="text-2xl font-bold text-white">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-400">
                            Join the future of agriculture
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-brand-light focus:border-brand-light sm:text-sm p-3 transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Email address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-brand-light focus:border-brand-light sm:text-sm p-3 transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-brand-light focus:border-brand-light sm:text-sm p-3 transition-colors"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>

                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                I want to...
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => setRole('BUYER')}
                                    className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'BUYER' ? 'bg-brand-light text-brand-dark border-brand-light' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                                >
                                    <ShoppingCart size={24} />
                                    <span className="font-bold text-sm">Buy Food</span>
                                </div>
                                <div
                                    onClick={() => setRole('FARMER')}
                                    className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'FARMER' ? 'bg-brand-light text-brand-dark border-brand-light' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                                >
                                    <Sprout size={24} />
                                    <span className="font-bold text-sm">Sell Produce</span>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="rounded-lg bg-red-500/10 border border-red-500/20 p-4"
                            >
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-200">
                                            Registration error
                                        </h3>
                                        <div className="mt-1 text-sm text-red-300">
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-brand-dark bg-brand-light hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-brand-light hover:text-white transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
