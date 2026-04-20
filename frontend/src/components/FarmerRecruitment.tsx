import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const FarmerRecruitment = () => {
    const navigate = useNavigate();
    return (
        <section className="py-24 relative overflow-hidden bg-white rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 shadow-2xl border border-gray-100">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-light/20 rounded-full blur-3xl -mr-48 -mt-48 opacity-40" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-mars/10 rounded-full blur-3xl -ml-40 -mb-40 opacity-30" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="px-4 py-1.5 bg-brand-dark/5 text-brand-dark rounded-full text-xs font-black uppercase tracking-widest border border-brand-dark/10">
                            Verified Quality
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-black text-brand-dark tracking-tighter leading-tight mt-6">
                            Food with a story. <br />
                            <span className="text-brand-mars font-black">Transparency you can trust.</span>
                        </h2>
                        <p className="text-gray-500 text-lg font-medium mt-6 leading-relaxed max-w-lg">
                            Every harvest on Farmmerce is traceable back to the specific farm that grew it. We partner with local farmers who prioritize your health and the environment.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-8 mt-12">
                            {[
                                { 
                                    icon: Sprout, 
                                    title: "100% Traceable", 
                                    desc: "Scan any product to see exactly when and where it was harvested." 
                                },
                                { 
                                    icon: ShieldCheck, 
                                    title: "Health First", 
                                    desc: "Verified zero-chemical growth practices for peak nutrient density." 
                                },
                                { 
                                    icon: TrendingUp, 
                                    title: "Freshness Guaranteed", 
                                    desc: "Direct delivery means less travel time and maximum shelf life." 
                                }
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="w-10 h-10 bg-brand-dark/5 rounded-xl flex items-center justify-center text-brand-dark">
                                        <item.icon size={20} />
                                    </div>
                                    <h4 className="font-bold text-brand-dark text-base">{item.title}</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12">
                            <button 
                                onClick={() => navigate('/market')}
                                className="inline-flex items-center gap-2 px-10 py-5 bg-brand-dark text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-brand-dark/10 active:scale-95"
                            >
                                Browse Fresh Harvests <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-square bg-gray-50 rounded-[3rem] border border-gray-100 p-4 relative overflow-hidden shadow-inner">
                            <img 
                                src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=1080" 
                                alt="Local Farmer" 
                                className="w-full h-full object-cover rounded-[2.5rem] grayscale focus:grayscale-0 hover:grayscale-0 transition-all duration-700"
                            />
                            
                            {/* Trust Badge Overlay */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute bottom-12 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 hidden sm:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Verified Source</p>
                                        <p className="text-xl font-black text-brand-dark mt-1">Farm-Direct</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Plant Decoration */}
                        <div className="absolute -top-10 -right-4 text-6xl opacity-20 rotate-12 pointer-events-none">🌿</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FarmerRecruitment;
