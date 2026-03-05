import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
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
