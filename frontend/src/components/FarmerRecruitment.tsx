import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FarmerRecruitment = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-brand-dark rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 shadow-2xl">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-light/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/10 rounded-full blur-3xl -ml-40 -mb-40" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="px-4 py-1.5 bg-brand-light/20 text-brand-light rounded-full text-xs font-black uppercase tracking-widest border border-brand-light/30">
                            Partner with us
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight mt-6">
                            Grow your farm. <br />
                            <span className="text-brand-light">Empower your community.</span>
                        </h2>
                        <p className="text-gray-400 text-lg font-medium mt-6 leading-relaxed max-w-lg">
                            Ditch the middlemen. Sell your harvest directly to local buyers, manage your inventory with ease, and get paid fairly.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-8 mt-12">
                            {[
                                { 
                                    icon: Sprout, 
                                    title: "Fair Pricing", 
                                    desc: "You set your prices. We ensure fair compensation for every harvest." 
                                },
                                { 
                                    icon: TrendingUp, 
                                    title: "Reach More", 
                                    desc: "Access thousands of households looking for fresh, local produce." 
                                },
                                { 
                                    icon: ShieldCheck, 
                                    title: "Secure Payouts", 
                                    desc: "Fast, automated settlements directly to your bank account." 
                                }
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="w-10 h-10 bg-brand-light/10 rounded-xl flex items-center justify-center text-brand-light">
                                        <item.icon size={20} />
                                    </div>
                                    <h4 className="font-bold text-white text-base">{item.title}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <Link 
                                to="/register" 
                                className="inline-flex items-center gap-2 px-10 py-5 bg-brand-light text-brand-dark rounded-full font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-brand-light/10 active:scale-95"
                            >
                                Start Selling Today <ArrowRight size={18} />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-square bg-white/5 rounded-[3rem] border border-white/10 p-4 relative overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=1080" 
                                alt="Farmer" 
                                className="w-full h-full object-cover rounded-[2.5rem] grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            
                            {/* Stats Card Overlay */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute bottom-12 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hidden sm:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green">
                                        <TrendingUp size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Monthly Growth</p>
                                        <p className="text-xl font-black text-brand-dark mt-1">+42% Units</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Plant Decoration */}
                        <div className="absolute -top-10 -right-4 text-6xl opacity-20 rotate-12">🌿</div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default FarmerRecruitment;
