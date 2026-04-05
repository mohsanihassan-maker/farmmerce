import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FoodBundleSelector from '../components/FoodBundleSelector';
import Features from '../components/Features';
import MarketplaceShowcase from '../components/MarketplaceShowcase';
import GroupBuyingSection from '../components/GroupBuyingSection';
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-brand-dark overflow-x-hidden">
            <Navbar />
            <main>
                <Hero />
                <section className="bg-gray-50 py-20 border-y border-gray-100">
                    <FoodBundleSelector isPublic />
                </section>
                <MarketplaceShowcase />
                <Features />
                {/* Additional Sections can go here */}
            </main>
            <Footer />
            <GroupBuyingSection />
        </div>
    );
};

export default LandingPage;
