import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MarketplaceShowcase from '../components/MarketplaceShowcase';
import GroupBuyingSection from '../components/GroupBuyingSection';
import FoodBundleSelector from '../components/FoodBundleSelector';
import Features from '../components/Features';
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <Navbar />
            <main>
                {/* Hero — compact, search-first */}
                <Hero />

                {/* ── PRODUCTS — immediately visible after hero ── */}
                <MarketplaceShowcase />

                {/* ── GROUP DEALS ── */}
                <GroupBuyingSection />

                {/* ── MEAL BUNDLES ── */}
                <div className="max-w-7xl mx-auto py-16 px-4">
                    <FoodBundleSelector isCompact />
                </div>

                {/* ── WHY FARMMERCE ── */}
                <Features />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
