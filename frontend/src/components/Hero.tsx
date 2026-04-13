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
        <div className="relative bg-[#013f31] min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-48">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex flex-col items-center">
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 z-10 bg-gradient-to-b from-brand-dark/40 via-transparent to-transparent pointer-events-none"
                />

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-[7.5rem] font-black text-white tracking-tighter mb-4 text-center leading-[0.8] drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] relative z-20"
                >
                    From farm<br/><span className="text-brand-light drop-shadow-[0_10px_10px_rgba(1,63,49,0.5)]">to kitchen...</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg md:text-2xl font-bold text-white mb-12 text-center max-w-xl leading-snug drop-shadow-md relative z-20"
                >
                    Fresh, transparent, and direct. We connect you to the best local harvests with <span className="text-brand-light">zero middle-men.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[2.5rem] p-2 flex items-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 relative z-30"
                >
                    <div className="w-12 h-12 flex items-center justify-center text-brand-dark/20 font-black text-2xl ml-2">⊕</div>
                    <input 
                        type="text" 
                        placeholder="Enter your delivery address" 
                        className="flex-1 bg-transparent border-none outline-none px-4 text-brand-dark font-bold placeholder:text-gray-300 text-lg"
                    />
                    <button className="bg-brand-dark text-white px-12 py-5 rounded-[2rem] font-black text-base tracking-tight hover:bg-black transition-all shadow-lg active:scale-95">
                        Order now
                    </button>
                </motion.div>
            </div>

            {/* Visual Scene Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Rolling Fields Background */}
                <div className="absolute bottom-0 left-0 right-0 w-full">
                    <img 
                        src="/hero-fields.png" 
                        className="w-full h-auto object-cover min-h-[400px] opacity-100" 
                        alt="" 
                    />
                </div>

                {/* Animated Tractors - Deep Field */}
                <motion.div
                    initial={{ x: "-20%", opacity: 0 }}
                    animate={{ x: "110%", opacity: 0.8 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-32 left-0 scale-[0.4] grayscale-[0.2]"
                >
                    <img src="/tractor.png" className="w-32 h-auto" alt="" />
                </motion.div>

                {/* Animated Tractors - Closer Field */}
                <motion.div
                    initial={{ x: "120%", opacity: 0 }}
                    animate={{ x: "-30%", opacity: 1 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
                    className="absolute bottom-16 right-0 scale-75"
                >
                    <img src="/tractor.png" className="w-48 h-auto -scale-x-100" alt="" />
                </motion.div>

                {/* Gradient to blend image with dark green top */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#013f31] via-transparent to-transparent h-1/2" />
            </div>
        </div>
    );
};

export default Hero;
