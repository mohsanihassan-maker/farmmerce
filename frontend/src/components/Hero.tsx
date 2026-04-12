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
        <div className="relative bg-[#FAF8F5] min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center">
                
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-[6.5rem] font-black text-brand-dark tracking-tighter mb-4 text-center leading-[0.9]"
                >
                    Farm Prices.<br/>Guaranteed.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg md:text-xl font-bold text-gray-500 mb-10 text-center max-w-xl leading-snug"
                >
                    We connect you directly to trusted local farmers so you pay exactly what the harvest is worth.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-2xl bg-white rounded-full p-2.5 flex items-center shadow-xl shadow-brand-dark/5 border border-gray-100 relative z-20"
                >
                    <div className="w-10 h-10 flex items-center justify-center text-brand-light font-black text-xl ml-2">⊕</div>
                    <input 
                        type="text" 
                        placeholder="Enter a delivery address" 
                        className="flex-1 bg-transparent border-none outline-none px-4 text-brand-dark font-medium placeholder:text-gray-400"
                    />
                    <button className="bg-[#0F8B4F] text-white px-8 py-4 rounded-full font-black text-sm tracking-tight hover:bg-[#004B23] transition-all">
                        Order now
                    </button>
                </motion.div>

                {/* Vector Scene at bottom */}
                <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none translate-y-10 z-0">
                    <div className="relative max-w-7xl mx-auto h-[400px]">
                        {/* Static scenery elements (simulated as SVG/DIVs) */}
                        <div className="absolute bottom-0 left-10 w-64 h-80 bg-brand-yellow border-t-[40px] border-l-[30px] border-r-[30px] border-t-yellow-600/20 border-l-transparent border-r-transparent shadow-2xl">
                            <div className="flex gap-4 p-4 mt-10">
                                <div className="w-full h-8 bg-black/80"></div>
                                <div className="w-full h-8 bg-black/80"></div>
                            </div>
                            <div className="flex gap-4 p-4">
                                <div className="w-full h-8 bg-black/80"></div>
                                <div className="w-full h-8 bg-black/80"></div>
                            </div>
                            <div className="flex gap-4 p-4">
                                <div className="w-full h-8 bg-black/80"></div>
                                <div className="w-full h-8 bg-black/80"></div>
                            </div>
                        </div>

                        <div className="absolute bottom-0 right-32 w-48 h-96 bg-blue-400 shadow-2xl">
                            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-8 h-32 bg-blue-500 clip-triangle"></div>
                        </div>

                        {/* Stadium shape */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-64 border-4 border-white bg-black rounded-t-[100px] flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-12 gap-2 p-4">
                                {Array(24).fill(0).map((_, i) => (
                                    <div key={i} className="bg-green-400 w-full h-full skew-x-12 opacity-80"></div>
                                ))}
                            </div>
                        </div>

                        {/* Trees */}
                        <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-green-500 rounded-full blur-[2px]"></div>
                        <div className="absolute bottom-10 left-[35%] w-24 h-24 bg-green-500 rounded-full blur-[2px]"></div>
                        <div className="absolute bottom-5 right-1/4 w-40 h-40 bg-green-500 rounded-full blur-[2px]"></div>
                        <div className="absolute bottom-8 right-[35%] w-28 h-28 bg-green-500 rounded-full blur-[2px]"></div>
                        
                        {/* Road */}
                        <div className="absolute -bottom-[200px] left-0 right-0 h-48 bg-gray-500 -skew-y-2 origin-bottom-left z-10 w-[120%] -ml-[10%]">
                            <div className="w-full h-2 mt-20 border-t-4 border-dashed border-white/50"></div>
                        </div>

                        {/* Animated Scooter/Tractor */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100vw" }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-20 z-20"
                        >
                            <div className="text-[6rem] drop-shadow-2xl">🚜</div>
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Hero;
