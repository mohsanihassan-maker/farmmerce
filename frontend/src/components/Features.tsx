import React from 'react';
import { Truck, Sprout, Wallet, ShieldCheck, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <Sprout className="w-8 h-8 text-brand-dark" />,
        title: "Nutrient Dense",
        description: "Harvested hours before delivery to preserve vitamins and minerals. Peak freshness for your health.",
        color: "bg-brand-light"
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-brand-dark" />,
        title: "Verified Traceability",
        description: "Every item is traceable to its source. Know your farmer, know your food's journey.",
        color: "bg-brand-pink"
    },
    {
        icon: <ChefHat className="w-8 h-8 text-brand-dark" />,
        title: "Clean Eating",
        description: "Zero-chemical standards. We only partner with farms that prioritize natural, healthy growing.",
        color: "bg-brand-yellow"
    },
    {
        icon: <Wallet className="w-8 h-8 text-brand-dark" />,
        title: "Transparent Pricing",
        description: "Save more by buying direct. Quality nutrition shouldn't come with a middleman markup.",
        color: "bg-brand-peach"
    },
    {
        icon: <Truck className="w-8 h-8 text-brand-dark" />,
        title: "Swift Logistics",
        description: "Our optimized routes ensure farm-to-table delivery within 48 hours of harvest.",
        color: "bg-brand-light"
    }
];

const Features = () => {
    return (
        <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-6">Invest in Your Health</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                            We're redefining the food system with a focus on transparency, nutrition, and direct access to local harvests.
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
