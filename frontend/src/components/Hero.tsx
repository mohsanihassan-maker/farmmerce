import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Leaf, ArrowRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

const QUICK_CATEGORIES = ['Vegetables', 'Fruits', 'Grains', 'Livestock', 'Eggs & Dairy'];

const Hero = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/market?search=${encodeURIComponent(search.trim())}`);
        } else {
            navigate('/market');
        }
    };

    return (
        <div className="relative bg-[#013f31] overflow-hidden">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
            </div>

            {/* Animated tractor - subtle background element */}
            <motion.div
                initial={{ x: "-10%", opacity: 0 }}
                animate={{ x: "110%", opacity: 0.15 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-0 left-0 pointer-events-none"
            >
                <img src="/tractor.png" className="w-20 h-auto" alt="" />
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-28 pb-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                    {/* Left: Copy */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light/15 text-brand-light text-xs font-bold mb-4 border border-brand-light/20"
                        >
                            <Leaf size={11} />
                            <span>100% Farm Direct · Zero Middlemen</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.05 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[0.9] mb-4"
                        >
                            Fresh from the farm,<br />
                            <span className="text-brand-light">straight to you.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-white/60 text-base md:text-lg font-medium mb-6 max-w-lg mx-auto lg:mx-0"
                        >
                            Harvested today, delivered tomorrow. Shop verified local produce with full traceability.
                        </motion.p>

                        {/* Search Bar */}
                        <motion.form
                            onSubmit={handleSearch}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-[0_10px_30px_rgba(0,0,0,0.3)] max-w-lg mx-auto lg:mx-0"
                        >
                            <Search size={16} className="text-gray-300 ml-2 shrink-0" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search tomatoes, yam, eggs…"
                                className="flex-1 bg-transparent border-none outline-none text-brand-dark font-semibold placeholder:text-gray-300 text-sm"
                            />
                            <button
                                type="submit"
                                className="bg-brand-dark text-white px-5 py-3 rounded-xl font-black text-xs tracking-tight hover:bg-black transition-all shadow-lg active:scale-95 whitespace-nowrap flex items-center gap-1.5"
                            >
                                <ShoppingBag size={13} />
                                Shop Now
                            </button>
                        </motion.form>

                        {/* Quick Category Pills */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                            className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start"
                        >
                            {QUICK_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => navigate(`/market?category=${encodeURIComponent(cat)}`)}
                                    className="px-3 py-1.5 text-[11px] font-bold text-white/70 bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 hover:text-white transition-all"
                                >
                                    {cat}
                                </button>
                            ))}
                            <button
                                onClick={() => navigate('/market')}
                                className="px-3 py-1.5 text-[11px] font-bold text-brand-light bg-brand-light/10 rounded-lg border border-brand-light/20 hover:bg-brand-light/20 transition-all flex items-center gap-1"
                            >
                                All Products <ArrowRight size={10} />
                            </button>
                        </motion.div>
                    </div>

                    {/* Right: Stats / Trust */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="hidden lg:flex flex-col gap-4 shrink-0"
                    >
                        {[
                            { value: '500+', label: 'Local Farmers', color: 'text-brand-light' },
                            { value: '48h', label: 'Farm to Door', color: 'text-brand-yellow' },
                            { value: '100%', label: 'Traceable', color: 'text-brand-mars' },
                        ].map(stat => (
                            <div key={stat.label} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl px-6 py-4 text-right">
                                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Bottom fade into page */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
    );
};

export default Hero;
