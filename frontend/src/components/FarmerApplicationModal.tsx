import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sprout, MapPin, Building, Info, ArrowRight, CheckCircle2, Landmark, CreditCard } from 'lucide-react';
import { API_URL } from '../config';

interface FarmerApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
    onSuccess: () => void;
}

export default function FarmerApplicationModal({ isOpen, onClose, userId, onSuccess }: FarmerApplicationModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        farmName: '',
        location: '',
        bio: '',
        bankName: '',
        accountNumber: ''
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/users/${userId}/apply-farmer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStep(4); // Success step
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 3000);
            } else {
                alert('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Error submitting application.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="bg-brand-dark px-8 py-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors z-20"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Sprout className="text-brand-light" size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">Onboarding Portal</h2>
                                <p className="text-white/50 text-xs font-medium uppercase tracking-[0.2em] mt-1">Farmer Application • Step {step} of 3</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-gray-100 w-full flex">
                        {[1, 2, 3].map((s) => (
                            <div 
                                key={s} 
                                className={`h-full transition-all duration-500 ${step >= s ? 'bg-brand-light w-1/3' : 'w-0'}`} 
                            />
                        ))}
                    </div>

                    <div className="p-8 sm:p-10">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-brand-dark">Farm Identity</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Let's start with the basics. Tell us about your farming operation.</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Official Farm Name</label>
                                        <div className="relative group">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-dark transition-colors" size={18} />
                                            <input 
                                                type="text" 
                                                value={formData.farmName}
                                                onChange={(e) => setFormData({...formData, farmName: e.target.value})}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light focus:bg-white rounded-2xl font-bold transition-all outline-none"
                                                placeholder="Green Acres Farm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Primary Location</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-dark transition-colors" size={18} />
                                            <input 
                                                type="text" 
                                                value={formData.location}
                                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light focus:bg-white rounded-2xl font-bold transition-all outline-none"
                                                placeholder="City, State"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-brand-dark">Your Story</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Tell buyers what makes your produce special and your farming journey.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Farm Bio / Production Details</label>
                                    <div className="relative group">
                                        <Info className="absolute left-4 top-5 text-gray-400 group-focus-within:text-brand-dark transition-colors" size={18} />
                                        <textarea 
                                            rows={5}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light focus:bg-white rounded-2xl font-bold transition-all outline-none resize-none"
                                            placeholder="We specialize in organic leafy greens and use sustainable practices..."
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-brand-dark">Financial Settlment</h3>
                                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Where should we send your earnings? Payments are processed automatically.</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Bank Name</label>
                                        <div className="relative group">
                                            <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-dark transition-colors" size={18} />
                                            <input 
                                                type="text" 
                                                value={formData.bankName}
                                                onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light focus:bg-white rounded-2xl font-bold transition-all outline-none"
                                                placeholder="e.g. Access Bank"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Account Number</label>
                                        <div className="relative group">
                                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-dark transition-colors" size={18} />
                                            <input 
                                                type="text" 
                                                value={formData.accountNumber}
                                                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light focus:bg-white rounded-2xl font-bold transition-all outline-none"
                                                placeholder="0123456789"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                className="text-center py-10 space-y-6"
                            >
                                <div className="w-20 h-20 bg-brand-light/20 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={48} className="text-brand-dark" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-brand-dark tracking-tight">Application Submitted!</h3>
                                    <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto leading-relaxed">
                                        Your request has been sent to our farm specialists. We'll review your profile and update your status shortly.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Navigation Buttons */}
                        {step < 4 && (
                            <div className="flex items-center gap-3 mt-10 pt-6 border-t border-gray-100">
                                {step > 1 && (
                                    <button 
                                        onClick={prevStep}
                                        className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                                    >
                                        Back
                                    </button>
                                )}
                                <button 
                                    onClick={step === 3 ? handleSubmit : nextStep}
                                    disabled={loading || (step === 1 && (!formData.farmName || !formData.location)) || (step === 3 && (!formData.bankName || !formData.accountNumber))}
                                    className="flex-1 py-4 bg-brand-dark text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-brand-dark/10 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : step === 3 ? 'Finalize Application' : 'Continue'}
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
