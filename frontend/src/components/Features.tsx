import React from 'react';
import { Truck, Sprout, Wallet, ShieldCheck, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Sprout className="w-8 h-8 text-brand-dark" />,
        title: "Fresh from the Source",
        description: "Get produce harvested hours before delivery, not days. Direct from local farms to your table.",
        color: "bg-brand-light"
    },
    {
        icon: <Wallet className="w-8 h-8 text-brand-dark" />,
        title: "Fair Prices",
        description: "Save up to 30% by cutting out middlemen. Farmers earn more, you pay less.",
        color: "bg-brand-peach"
    },
    {
        icon: <Truck className="w-8 h-8 text-brand-dark" />,
        title: "Swift Delivery",
        description: "Reliable logistics ensure your food arrives fresh and on time, every time.",
        color: "bg-brand-yellow"
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-brand-dark" />,
        title: "Quality Assured",
        description: "Every farmer is verified. Every product is traceable back to its origin.",
        color: "bg-brand-pink"
    },
    {
        icon: <ChefHat className="w-8 h-8 text-brand-dark" />,
        title: "Smart Meal Planning",
        description: "Generate personalized meal plans based on your budget and preferences.",
        color: "bg-brand-light"
    }
];

const Features = () => {
    return (
        <section id="how-it-works" className="py-24 bg-brand-dark/95 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Why Farmmerce?</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                            We're building a food system that works for everyone. Better food for you, better business for farmers.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-brand-light/30 transition-all duration-300 group hover:shadow-2xl hover:shadow-brand-light/5"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
