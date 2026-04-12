import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (resetError) throw resetError;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to request password reset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] flex font-sans overflow-hidden">
            {/* Left Panel */}
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

                <div className="relative z-10">
                    <p className="text-brand-light/60 text-xs font-black uppercase tracking-[0.3em] mb-4">Account recovery</p>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-[0.95] mb-6">
                        Lost your<br />
                        <span className="text-brand-light">password?</span>
                    </h1>
                    <p className="text-gray-400 text-base font-medium leading-relaxed max-w-sm">
                        No worries — we'll send you a secure link to reset it. Takes less than a minute.
                    </p>
                    <div className="flex items-center gap-3 mt-8">
                        <div className="w-8 h-8 bg-brand-light/15 rounded-xl flex items-center justify-center">
                            <Leaf size={14} className="text-brand-light" />
                        </div>
                        <p className="text-sm text-gray-400 font-medium">Your account is safe and secure</p>
                    </div>
                </div>

                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                    className="absolute bottom-24 right-8 text-5xl opacity-30">🔑</motion.div>
            </motion.div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-16">
                <Link to="/" className="lg:hidden mb-10">
                    <img src="/farmmerce-20.png" alt="Farmmerce" className="h-10 w-auto object-contain" />
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    {!success ? (
                        <>
                            <div className="mb-10">
                                <h2 className="text-4xl font-black text-brand-dark tracking-tighter leading-tight">Reset password</h2>
                                <p className="mt-2 text-gray-400 font-medium">Enter your email and we'll send you a secure reset link.</p>
                            </div>

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-xs font-black text-brand-dark/50 uppercase tracking-widest mb-2">
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark text-sm font-medium transition-all shadow-sm"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

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
                                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-brand-dark text-white rounded-full font-black text-sm tracking-tight hover:bg-black transition-all shadow-xl shadow-brand-dark/20 disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Send Reset Link <ArrowRight className="h-4 w-4" /></>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-dark transition-colors">
                                    <ArrowLeft className="h-4 w-4" /> Back to Login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                className="inline-flex items-center justify-center w-24 h-24 bg-brand-light/20 rounded-[2rem] mb-8"
                            >
                                <CheckCircle className="h-12 w-12 text-brand-dark" />
                            </motion.div>

                            <h2 className="text-4xl font-black text-brand-dark tracking-tighter mb-3">Check your email</h2>
                            <p className="text-gray-400 font-medium leading-relaxed mb-2">
                                We've sent reset instructions to
                            </p>
                            <p className="font-black text-brand-dark mb-8">{email}</p>
                            <p className="text-xs text-gray-300 font-medium leading-relaxed mb-10 max-w-sm mx-auto">
                                Check your inbox and spam folder. If you had an account before March 2026 and don't receive an email,{' '}
                                <Link to="/register" className="text-brand-dark font-bold underline underline-offset-2">register again</Link> with the same email to migrate your account.
                            </p>

                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 py-4 px-8 bg-brand-dark text-white rounded-full font-black text-sm tracking-tight hover:bg-black transition-all shadow-xl shadow-brand-dark/20"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to Login
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
