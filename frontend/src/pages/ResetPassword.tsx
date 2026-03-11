import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../supabase';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [verifying, setVerifying] = useState(true);

    useState(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                setError('Invalid or expired reset link. Please request a new one.');
            }
            setVerifying(false);
        };
        checkSession();
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { error: resetError } = await supabase.auth.updateUser({
                password: password
            });

            if (resetError) {
                throw resetError;
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password');
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
                                <h2 className="text-2xl font-bold text-white">Create New Password</h2>
                                <p className="mt-2 text-sm text-gray-400">
                                    Please enter your new password below.
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                        New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
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
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                                        Confirm New Password
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full pl-10 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:ring-brand-light focus:border-brand-light sm:text-sm p-3 transition-colors"
                                            placeholder="••••••••"
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
                                        {loading ? 'Updating...' : 'Reset Password'}
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
                            <h2 className="text-2xl font-bold text-white mb-2">Password Updated!</h2>
                            <p className="text-gray-400 mb-8">
                                Your password has been successfully reset. Redirecting you to login...
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center text-brand-light font-bold hover:text-white transition-colorsCondensed"
                            >
                                Click here if not redirected
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
