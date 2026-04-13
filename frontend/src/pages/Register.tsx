import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ArrowRight, Eye, EyeOff, Leaf, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import { supabase } from '../supabase';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role] = useState('BUYER');
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
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { full_name: name, role } }
            });
            if (authError) throw authError;

            try {
                const response = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.session?.access_token || ''}`
                    },
                    body: JSON.stringify({ name, email, password, role })
                });
                if (response.ok) {
                    const data = await response.json();
                    if (authData.session) {
                        login(data.user, authData.session.access_token);
                        navigate('/dashboard');
                        return;
                    }
                }
            } catch (backendErr) {
                console.warn('Backend sync skipped:', backendErr);
            }

            if (authData.session) {
                login({ id: 0, email, name, role }, authData.session.access_token);
                navigate('/dashboard');
            } else {
                setError('Registration successful! Please check your email for a confirmation link.');
            }
        } catch (err: any) {
            let msg = err.message || 'Failed to register. Please try again.';
            if (msg.toLowerCase().includes('rate limit')) msg = 'Too many attempts. Please wait a few minutes and try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex font-sans overflow-hidden">
            {/* Left Panel — Decorative */}
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:flex lg:w-[45%] bg-brand-dark flex-col justify-between p-12 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-80 h-80 bg-brand-light/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-mars/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

                <Link to="/" className="relative z-10">
                    <img src="/farmmerce-20.png" alt="Farmmerce" className="h-10 w-auto object-contain" />
                </Link>

                <div className="relative z-10 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                    >
                        <p className="text-brand-light/60 text-xs font-black uppercase tracking-[0.3em] mb-4">Join the community</p>
                        <h1 className="text-5xl font-black text-white tracking-tighter leading-[0.95] mb-6">
                            Fresh food.<br />
                            <span className="text-brand-light">Fair prices.</span>
                        </h1>
                        <p className="text-gray-400 text-base font-medium leading-relaxed max-w-sm">
                            Whether you grow it or cook it, Farmmerce connects farms directly to your table.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="space-y-3"
                    >
                        {[
                            { icon: Leaf, text: 'Verified farms, zero middlemen' },
                            { icon: ShoppingBag, text: 'Same-day fresh delivery' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-brand-light/15 rounded-xl flex items-center justify-center">
                                    <Icon size={14} className="text-brand-light" />
                                </div>
                                <p className="text-sm text-gray-400 font-medium">{text}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                    className="absolute bottom-24 right-8 text-5xl opacity-30">🌿</motion.div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 6, delay: 1, ease: 'easeInOut' }}
                    className="absolute top-1/3 right-16 text-3xl opacity-20">🥕</motion.div>
            </motion.div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-16 overflow-y-auto">
                <Link to="/" className="lg:hidden mb-10">
                    <img src="/farmmerce-20.png" alt="Farmmerce" className="h-10 w-auto object-contain" />
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8">
                        <h2 className="text-4xl font-black text-brand-dark tracking-tighter leading-tight">Create account</h2>
                        <p className="mt-2 text-gray-400 font-medium">Start shopping fresh farm produce today</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-xs font-black text-brand-dark/50 uppercase tracking-widest mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    id="name" name="name" type="text" autoComplete="name" required
                                    value={name} onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark text-sm font-medium transition-all shadow-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-black text-brand-dark/50 uppercase tracking-widest mb-2">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    id="email" name="email" type="email" autoComplete="email" required
                                    value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark text-sm font-medium transition-all shadow-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-black text-brand-dark/50 uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    id="password" name="password" type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password" required
                                    value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-12 py-4 bg-white border border-gray-200 rounded-2xl text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark text-sm font-medium transition-all shadow-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-gray-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="rounded-2xl bg-brand-red/5 border border-brand-red/20 px-5 py-4"
                            >
                                <p className="text-sm font-bold text-brand-red">{error}</p>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-brand-dark text-white rounded-full font-black text-sm tracking-tight hover:bg-black transition-all shadow-xl shadow-brand-dark/20 disabled:opacity-50 active:scale-95 mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="h-4 w-4" /></>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-black text-brand-dark hover:text-brand-mars transition-colors">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
