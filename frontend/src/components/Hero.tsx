import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Leaf } from 'lucide-react';

const Hero = () => {
    const navigate = useNavigate();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 30, // 30px max movement
                y: (e.clientY / window.innerHeight - 0.5) * 30,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    return (
        <div className="relative bg-brand-dark min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Premium Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-light/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-mars/5 rounded-full blur-[100px] -ml-20 -mb-20"></div>
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Content Section */}
                    <div className="flex-1 text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-2 mb-8"
                        >
                            <span className="flex items-center gap-2 py-2 px-4 rounded-full bg-brand-light/10 text-brand-light text-xs font-black uppercase tracking-widest border border-brand-light/20 backdrop-blur-sm">
                                <span className="w-2 h-2 bg-brand-light rounded-full animate-pulse"></span>
                                Freshly Harvested Today
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-6xl md:text-[5.5rem] font-black text-white leading-[1] tracking-tight mb-8 drop-shadow-2xl"
                        >
                            Eat Fresh. <br />
                            Pay <span className="text-brand-light underline decoration-brand-light/30 underline-offset-8 drop-shadow-[0_0_15px_rgba(212,255,166,0.3)]">Fair.</span> <br />
                            Support <span className="text-brand-yellow drop-shadow-[0_0_15px_rgba(249,216,137,0.3)]">Local.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed font-medium"
                        >
                            The direct link between Nigeria's best farmers and your table.
                            Fresh groceries delivered within 24 hours of harvest.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap gap-5"
                        >
                            <button
                                onClick={() => navigate('/market')}
                                className="group relative bg-brand-light text-brand-dark px-10 py-5 rounded-[2rem] font-black text-lg flex items-center gap-3 hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-brand-light/20"
                            >
                                Order Fresh Produce
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="group bg-white/5 border border-white/10 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-md"
                            >
                                <Leaf className="w-6 h-6 text-brand-light" />
                                Become a Farmer
                            </button>
                        </motion.div>

                        {/* Social Proof Stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="mt-16 flex items-center gap-12 border-t border-white/10 pt-10"
                        >
                            <div>
                                <p className="text-3xl font-black text-white">2.5k+</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Families Fed</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div>
                                <p className="text-3xl font-black text-white">45min</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Avg. Delivery</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div>
                                <p className="text-3xl font-black text-brand-light">12.4t</p>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">CO2 Offset</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Section */}
                    <div className="flex-1 relative hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0, x: mousePos.x, y: mousePos.y }}
                            transition={{
                                opacity: { duration: 1, ease: "easeOut" },
                                scale: { duration: 1, ease: "easeOut" },
                                rotate: { duration: 1, ease: "easeOut" },
                                x: { type: "spring", stiffness: 50, damping: 20 },
                                y: { type: "spring", stiffness: 50, damping: 20 }
                            }}
                            className="relative z-10"
                        >
                            <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-brand-dark group">
                                <img
                                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop"
                                    className="w-full h-[600px] object-cover opacity-80"
                                    alt="Fresh Produce Marketplace"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>

                                {/* Overlay Card */}
                                <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center shadow-xl shadow-brand-light/20 overflow-hidden p-2">
                                            <img src="/mark.png" alt="Farmmerce" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-white">Joe's Organic Basket</h4>
                                            <p className="text-brand-light/80 font-bold">Arriving in 12 mins</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badges */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-10 bg-brand-yellow text-brand-dark p-6 rounded-[2.5rem] shadow-2xl z-20 font-black text-center border-4 border-brand-dark"
                            >
                                <div className="text-3xl mb-1 text-brand-dark">💎</div>
                                <div className="text-sm uppercase tracking-tighter">Premium<br />Quality</div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 -left-12 bg-white text-brand-dark p-6 rounded-[2.5rem] shadow-2xl z-20 border-4 border-brand-dark"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-${i * 200} flex items-center justify-center text-xs font-bold`}>
                                                👤
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-brand-dark/40">
                                        150+ Happy <br />Customers today
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/50 animate-bounce cursor-pointer z-20"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 rotate-90 opacity-0 hidden">Scroll</div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </motion.div>
        </div>
    );
};

export default Hero;
