import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FoodBundleSelector from '../components/FoodBundleSelector';
import Features from '../components/Features';
import MarketplaceShowcase from '../components/MarketplaceShowcase';
import GroupBuyingSection from '../components/GroupBuyingSection';
import FarmerRecruitment from '../components/FarmerRecruitment';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <Navbar />
            <main>
                <Hero />
                
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                    className="max-w-7xl mx-auto py-24 px-4"
                >
                    <FoodBundleSelector isCompact />
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <MarketplaceShowcase />
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <GroupBuyingSection />
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <FarmerRecruitment />
                </motion.div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <Features />
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
