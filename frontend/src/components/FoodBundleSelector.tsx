import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, Users, Check, ArrowRight, Zap, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BUNDLES = [
    {
        id: 'lite',
        name: 'Harvest Lite',
        familySize: '2-3 Persons',
        price: 24500,
        savings: '15% Off',
        color: 'from-green-600 to-emerald-400',
        badge: 'bg-green-100 text-green-700',
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
        color: 'from-blue-600 to-cyan-400',
        badge: 'bg-blue-100 text-blue-700',
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
        color: 'from-amber-500 to-orange-400',
        badge: 'bg-amber-100 text-amber-700',
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
        color: 'from-rose-600 to-pink-400',
        badge: 'bg-rose-100 text-rose-700',
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

export default function FoodBundleSelector() {
    const [selectedIdx, setSelectedIdx] = useState(1); // Default to Standard
    const { addToCart } = useCart();
    const bundle = BUNDLES[selectedIdx];

    const handleAddToCart = () => {
        // In a real app, this would add a special bundle product or individual items
        // For now, we'll simulate adding a "Bundle" pseudo-product
        const bundleItem = {
            id: `bundle-${bundle.id}`,
            name: `${bundle.name} Bundle`,
            price: bundle.price,
            farmer: { name: 'Farmmerce Direct' },
            imageUrl: '' // Bundle doesn't have image
        };
        addToCart(bundleItem);
        alert(`${bundle.name} added to your cart!`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between px-2">
                <div>
                    <h2 className="text-xl font-black text-brand-dark tracking-tight leading-none mb-1">Monthly Harvest Bundles</h2>
                    <p className="text-xs text-gray-400 font-medium">Select a range based on your family size</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${bundle.badge}`}>
                    {bundle.savings}
                </div>
            </div>

            {/* Selector Pills */}
            <div className="flex bg-gray-100 p-1.5 rounded-[1.75rem] gap-1 overflow-x-auto no-scrollbar shadow-inner">
                {BUNDLES.map((b, i) => (
                    <button
                        key={b.id}
                        onClick={() => setSelectedIdx(i)}
                        className={`flex-shrink-0 px-5 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative ${
                            selectedIdx === i ? 'text-white' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {selectedIdx === i && (
                            <motion.div
                                layoutId="active-pill"
                                className={`absolute inset-0 rounded-[1.5rem] bg-gradient-to-r shadow-lg ${b.color}`}
                            />
                        )}
                        <span className="relative z-10 whitespace-nowrap">{b.familySize}</span>
                    </button>
                ))}
            </div>

            {/* Main Bundle Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={bundle.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 min-h-[440px] flex flex-col justify-between"
                >
                    {/* Background Accents */}
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br opacity-5 rounded-full blur-3xl -mr-32 -mt-32 ${bundle.color}`} />
                    
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${bundle.color}`}>
                                <ShoppingBasket size={20} />
                            </div>
                            <h3 className="text-2xl font-black text-brand-dark tracking-tight">{bundle.name}</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 pl-1">Bundle Contents</p>
                            <div className="grid grid-cols-1 gap-2.5">
                                {bundle.items.map((item, idx) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-center gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-100/50"
                                    >
                                        <div className="w-5 h-5 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                                            <Check size={12} className="text-green-500" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-700">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Bundle Value</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-brand-dark leading-none">₦{bundle.price.toLocaleString()}</span>
                                    <span className="text-xs text-gray-300 font-bold line-through">₦{(bundle.price * 1.3).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-dark/20 text-xs">Direct from Farm</p>
                                <div className="flex justify-end -space-x-2 mt-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                            <div className="w-full h-full bg-cover flex items-center justify-center text-[8px] font-black">🚜</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className={`w-full py-5 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl active:scale-95`}
                        >
                            <Zap size={16} className="text-brand-light" />
                            Add Bundle to Cart
                        </button>

                        <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2">
                            <span className="flex items-center gap-1"><Leaf size={10} className="text-green-500" /> Farm Fresh</span>
                            <span className="w-1 h-1 bg-gray-200 rounded-full" />
                            <span className="flex items-center gap-1"><Check size={10} className="text-blue-500" /> Free Delivery</span>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
