import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { User, Mail, Phone, MapPin, Save, Sprout, ArrowRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import FarmerApplicationModal from './FarmerApplicationModal';

export default function ProfileForm() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        farmName: '',
        location: '',
        bio: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showFarmerModal, setShowFarmerModal] = useState(false);
    const [appStatus, setAppStatus] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            // Fetch latest user data
            fetch(`${API_URL}/users/${user.id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        address: data.address || '',
                        farmName: data.profile?.farmName || '',
                        location: data.profile?.location || '',
                        bio: data.profile?.bio || ''
                    });
                    setAppStatus(data.profile?.applicationStatus || 'NONE');
                })
                .catch(err => console.error(err));
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`${API_URL}/users/${user?.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    ...(user?.role === 'FARMER' && {
                        profile: {
                            farmName: formData.farmName,
                            location: formData.location,
                            bio: formData.bio
                        }
                    })
                })
            });

            if (response.ok) {
                setMessage('Profile updated successfully!');
                // Optional: Update AuthContext user if needed, but for now just local state
            } else {
                setMessage('Failed to update profile.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error updating profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow-sm border border-gray-100 rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-10 bg-brand-dark relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/10 rounded-[2rem] border border-white/20 flex items-center justify-center text-4xl text-white shadow-2xl">
                            {formData.name ? formData.name[0].toUpperCase() : '👤'}
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Account Settings</h2>
                            <p className="text-white/60 font-medium mt-1">Manage your identity and farm profile</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 sm:p-10">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] border ${message.includes('success') ? 'bg-brand-light/20 text-brand-dark border-brand-light/30' : 'bg-brand-red/10 text-brand-red border-brand-red/20'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${message.includes('success') ? 'bg-brand-dark' : 'bg-brand-red'} animate-pulse`} />
                            {message}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-dark transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light focus:bg-white rounded-2xl font-bold transition-all outline-none"
                                        placeholder="Full Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full pl-12 pr-6 py-4 bg-gray-100/50 border-2 border-transparent rounded-2xl font-bold text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-dark transition-colors" size={18} />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light focus:bg-white rounded-2xl font-bold transition-all outline-none"
                                    placeholder="+234..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Shipping Address</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-5 text-gray-400 group-focus-within:text-brand-dark transition-colors" size={18} />
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    rows={3}
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light focus:bg-white rounded-2xl font-bold transition-all outline-none resize-none"
                                    placeholder="Enter your street address..."
                                />
                            </div>
                        </div>

                        {user?.role === 'FARMER' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-8 border-t border-gray-100 space-y-6"
                            >
                                <h3 className="text-xs font-black text-brand-dark uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-brand-light rounded-full" />
                                    Farmer Identity
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Farm Name</label>
                                        <input
                                            type="text"
                                            value={formData.farmName}
                                            onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light rounded-2xl font-bold transition-all outline-none"
                                            placeholder="Farm Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Farm Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light rounded-2xl font-bold transition-all outline-none"
                                            placeholder="City, State"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Farm Story (Bio)</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={4}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light rounded-2xl font-bold transition-all outline-none resize-none"
                                        placeholder="Tell buyers about your farming story..."
                                    />
                                </div>
                            </motion.div>
                        )}

                        {user?.role === 'BUYER' && appStatus === 'NONE' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 p-8 bg-brand-light/20 rounded-[2rem] border-2 border-dashed border-brand-light/30 relative overflow-hidden group"
                            >
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-light/20 rounded-full blur-2xl group-hover:scale-110 transition-transform" />
                                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-brand-dark">
                                        <Sprout size={32} />
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h4 className="text-xl font-black text-brand-dark tracking-tight">Ready to sell your harvest?</h4>
                                        <p className="text-sm font-medium text-brand-dark/60 mt-1 italic">Apply to become a verified Farmmerce partner</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowFarmerModal(true)}
                                        className="px-6 py-3 bg-brand-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-lg"
                                    >
                                        Apply Now <ArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {appStatus === 'PENDING_FARMER' && (
                            <div className="mt-8 p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm animate-pulse">
                                    <Info size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-indigo-900">Application Under Review</p>
                                    <p className="text-xs font-medium text-indigo-700/60">Our team is vetting your details. We'll notify you soon!</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-brand-dark text-white rounded-[1.5rem] font-black tracking-widest uppercase text-sm hover:bg-black transition-all shadow-xl shadow-brand-dark/10 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                            >
                                <Save size={18} className="text-brand-light" />
                                {loading ? 'Saving Changes...' : 'Save Profile Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <FarmerApplicationModal 
                isOpen={showFarmerModal}
                onClose={() => setShowFarmerModal(false)}
                userId={user?.id || 0}
                onSuccess={() => setAppStatus('PENDING_FARMER')}
            />
        </div>
    );
}
