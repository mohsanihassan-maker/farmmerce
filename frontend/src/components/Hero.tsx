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
                
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-[7rem] font-black text-white tracking-tighter mb-4 text-center leading-[0.85]"
                >
                    From farm<br/><span className="text-brand-light">to kitchen...</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg md:text-xl font-bold text-white/60 mb-10 text-center max-w-xl leading-snug"
                >
                    Fresh, transparent, and direct. We connect you to the best local harvests with zero middle-men.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-2xl bg-white rounded-full p-2 flex items-center shadow-2xl shadow-black/20 border border-white/10 relative z-30"
                >
                    <div className="w-10 h-10 flex items-center justify-center text-brand-dark/20 font-black text-xl ml-2">⊕</div>
                    <input 
                        type="text" 
                        placeholder="Enter your delivery address" 
                        className="flex-1 bg-transparent border-none outline-none px-4 text-brand-dark font-bold placeholder:text-gray-300"
                    />
                    <button className="bg-brand-dark text-white px-10 py-4 rounded-full font-black text-sm tracking-tight hover:bg-black transition-all shadow-lg active:scale-95">
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
