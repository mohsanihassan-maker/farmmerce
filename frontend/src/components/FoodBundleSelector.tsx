import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, Users, Check, ArrowRight, Zap, Leaf, Award } from 'lucide-react';
import { useCart } from '../context/CartContext';

// NOTE: These paths are absolute to the user's current environment for local preview.
const BUNDLES = [
    {
        id: 'lite',
        name: 'Harvest Lite',
        familySize: '2-3 Persons',
        price: 24500,
        savings: '15% Off',
        color: 'from-brand-dark to-brand-light/40',
        badge: 'bg-brand-light/20 text-brand-dark',
        imageUrl: '/harvest_lite_bundle_1775397493609.png',
        accentColor: '#013f31',
        items: [
            '5kg Long Grain Rice',
            '2kg Brown Beans',
            '2L Premium Veg Oil',
            '2 Large Tubers of Yam',
            '1 Small Basket Veggies',
            '1kg Red Onions'
        ]
    },
    {
        id: 'standard',
        name: 'Harvest Standard',
        familySize: '4-5 Persons',
        price: 48500,
        savings: '25% Off',
        color: 'from-brand-mars to-brand-mars/40',
        badge: 'bg-brand-mars/10 text-brand-mars font-black',
        imageUrl: '/harvest_standard_bundle_1775397565651.png',
        accentColor: '#ff6f64',
        featured: true,
        items: [
            '10kg Long Grain Rice',
            '5kg Brown Beans',
            '5L Premium Veg Oil',
            '5 Medium Tubers of Yam',
            '1 Large Basket Veggies',
            '3kg Red Onions'
        ]
    },
    {
        id: 'pro',
        name: 'Harvest Pro',
        familySize: '6-8 Persons',
        price: 88000,
        savings: '30% Off',
        color: 'from-brand-yellowDark to-brand-yellow/40',
        badge: 'bg-brand-yellow/20 text-brand-yellowDark font-black',
        imageUrl: '/harvest_pro_bundle_1775397604426.png',
        accentColor: '#f6c744',
        items: [
            '25kg Long Grain Rice',
            '10kg Brown Beans',
            '10L Premium Veg Oil',
            '10 Large Tubers of Yam',
            '2 Large Baskets Veggies',
            '1 Crate Fresh Farm Eggs',
            '5kg Red Onions'
        ]
    },
    {
        id: 'feast',
        name: 'Harvest Feast',
        familySize: '10+ Persons',
        price: 165000,
        savings: '35% Off',
        color: 'from-brand-purple to-brand-pink/40',
        badge: 'bg-brand-pink/20 text-brand-purple font-black',
        imageUrl: '/harvest_feast_bundle_1775397672304.png',
        accentColor: '#81295c',
        items: [
            '50kg Long Grain Rice',
            '20kg Brown Beans',
            '20L Premium Veg Oil',
            '20 Large Tubers of Yam',
            '4 Large Baskets Veggies',
            '2 Crates Fresh Farm Eggs',
            '10kg Red Onions',
            '1 Whole Broiler Chicken'
        ]
    }
];

export default function FoodBundleSelector({ isPublic = false }: { isPublic?: boolean }) {
    const [selectedIdx, setSelectedIdx] = useState(1); // Default to Standard
    const { addToCart } = useCart();
    const bundle = BUNDLES[selectedIdx];

    const handleAddToCart = () => {
        const bundleItem = {
            id: `bundle-${bundle.id}`,
            name: `${bundle.name} Bundle`,
            price: bundle.price,
            farmer: { name: 'Farmmerce Direct' },
            imageUrl: bundle.imageUrl
        };
        addToCart(bundleItem);
        alert(`${bundle.name} added to your cart!`);
    };

    return (
        <div className={`space-y-8 ${isPublic ? 'max-w-6xl mx-auto py-12' : ''}`}>
            {/* ── HEADER ── */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between px-4 gap-4`}>
                <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Leaf className="text-brand-dark w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-dark/40">Direct Harvest Program</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter leading-none mb-1">
                        Monthly <span className="bg-gradient-to-r from-brand-mars to-brand-yellow font-black bg-clip-text text-transparent">Family Bundles</span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-400 font-medium">Choose your range and save up to 35% compared to open market prices.</p>
                </div>
                <div className="flex bg-gray-100/80 p-2 rounded-[2rem] gap-1 shadow-inner overflow-x-auto no-scrollbar">
                    {BUNDLES.map((b, i) => (
                        <button
                            key={b.id}
                            onClick={() => setSelectedIdx(i)}
                            className={`flex-shrink-0 px-6 py-3 rounded-[1.75rem] text-[11px] font-black uppercase tracking-widest transition-all duration-300 relative ${
                                selectedIdx === i ? 'text-white' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {selectedIdx === i && (
                                <motion.div
                                    layoutId="active-pill"
                                    className={`absolute inset-0 rounded-[1.75rem] shadow-xl bg-gradient-to-r ${b.color}`}
                                />
                            )}
                            <span className="relative z-10 whitespace-nowrap">{b.familySize}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── MAIN BUNDLE SHOWCASE ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-white rounded-[3rem] shadow-2xl border border-gray-100 mx-4"
                >
                    {/* Visual Section */}
                    <div className="relative h-64 lg:h-auto overflow-hidden bg-brand-dark">
                        <motion.img
                            key={bundle.imageUrl}
                            src={bundle.imageUrl}
                            alt={bundle.name}
                            initial={{ scale: 1.1, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${bundle.badge}`}>
                                    {bundle.savings} Applied
                                </div>
                                {bundle.featured && (
                                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                        <Award size={12} /> Popular
                                    </div>
                                )}
                            </div>
                            <h3 className="text-4xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-lg">{bundle.name}</h3>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-8 lg:p-12 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl bg-gradient-to-br ${bundle.color}`}>
                                    <ShoppingBasket size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly Provisions</p>
                                    <p className="text-xl font-bold text-brand-dark">Direct from 8+ Farms</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-10">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 pl-1">Included in this bundle</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {bundle.items.map((item, idx) => (
                                        <motion.div
                                            key={item}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                            className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100/50 hover:bg-white hover:border-brand-dark/20 transition-all cursor-default"
                                        >
                                            <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                                                <Check size={14} style={{ color: bundle.accentColor }} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">{item}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2 pt-6 border-t border-gray-100">
                                <div>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">One Monthly Payment</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl lg:text-5xl font-black text-brand-dark leading-none tracking-tighter">₦{bundle.price.toLocaleString()}</span>
                                        <span className="text-sm text-gray-300 font-black line-through">₦{(bundle.price * 1.3).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="hidden sm:block text-right">
                                    <div className="flex justify-end -space-x-3 mb-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                                                <div className="w-full h-full bg-cover flex items-center justify-center text-xs font-black">🚜</div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified Local Farms</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 py-5 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl active:scale-95`}
                                >
                                    <Zap size={16} className="text-brand-light" />
                                    Add Bundle to Cart
                                </button>
                                <button className="px-8 py-5 border-2 border-gray-100 text-brand-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:border-brand-dark hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                    <ArrowRight size={16} /> Details
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">
                                <span className="flex items-center gap-2"><Leaf size={14} className="text-brand-dark" /> 100% Organic</span>
                                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                <span className="flex items-center gap-2"><Check size={14} style={{ color: bundle.accentColor }} /> Free Logistics</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
