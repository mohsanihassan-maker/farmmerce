import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
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

            if (resetError) {
                throw resetError;
            }

            setSuccess(true);

        } catch (err: any) {
            setError(err.message || 'Failed to request password reset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
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
                    {!success ? (
                        <>
                            <div className="mb-6 text-center">
                                <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                                <p className="mt-2 text-sm text-gray-400">
                                    Enter your email and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
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
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-brand-light focus:border-brand-light sm:text-sm p-3 transition-colors"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                                        <p className="text-sm text-red-300">{error}</p>
                                    </div>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-brand-dark bg-brand-light hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                                    >
                                        {loading ? 'Processing...' : 'Send Reset Link'}
                                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="flex justify-center mb-6">
                                <div className="p-4 bg-brand-light/20 rounded-full">
                                    <CheckCircle className="h-12 w-12 text-brand-light" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                We've sent password reset instructions to <strong>{email}</strong>. 
                                Please check your inbox and your spam folder.
                                <br /><br />
                                <span className="text-xs italic">Note: If you haven't received the email after 5 minutes and you had an account before our recent upgrade (March 2026), please <Link to="/register" className="text-brand-light underline">Register again</Link> with the same email to migrate your account.</span>
                            </p>

                            <Link
                                to="/login"
                                className="inline-flex items-center text-brand-light font-bold hover:text-white transition-colors"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                            </Link>
                        </div>
                    )}


                    {!success && (
                        <div className="mt-6 text-center">
                            <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-brand-light transition-colors">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
