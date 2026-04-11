import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, Users, Check, ArrowRight, Zap, Leaf, Award, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

import { API_URL } from '../config';

export default function FoodBundleSelector({ isPublic = false, isCompact = false }: { isPublic?: boolean, isCompact?: boolean }) {
    const [selectedIdx, setSelectedIdx] = useState(1); // Default to Standard
    const [bundles, setBundles] = useState<any[]>([]);
    const { addToCart } = useCart();
    
    useEffect(() => {
        fetch(`${API_URL}/bundles`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) setBundles(data);
            })
            .catch(err => console.error(err));
    }, []);

    const bundle = bundles[selectedIdx] || bundles[0];
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isCompact || !scrollRef.current) return;
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
                }
            }
        }, 3500);
        return () => clearInterval(interval);
    }, [isCompact]);

    const handleAddToCart = (idx?: number) => {
        if (!bundle) return;
        const b = idx !== undefined ? bundles[idx] : bundle;
        const bundleItem = {
            id: `bundle-${b.id}`,
            name: `${b.name} Bundle`,
            price: b.price,
            farmer: { name: 'Farmmerce Direct' },
            imageUrl: b.imageUrl
        };
        addToCart(bundleItem);
        alert(`${b.name} added to your cart!`);
    };

    if (isCompact) {
        return (
            <div className="w-full px-4 sm:px-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-6 bg-brand-mars rounded-full" />
                    <h2 className="text-xl font-black text-brand-dark tracking-tight leading-none">
                        Featured <span className="text-brand-mars">Bundles</span>
                    </h2>
                </div>
                
                <div 
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory"
                >
                    {bundles.length === 0 && <div className="text-gray-400 text-sm py-4">Loading bundles...</div>}
                    {bundles.map((b, i) => (
                        <motion.div
                            key={b.id}
                            whileHover={{ y: -5 }}
                            className="snap-center flex-shrink-0 w-[260px] bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl hover:border-brand-mars/40 transition-all duration-300 relative"
                        >
                            <div className="h-32 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                                <img src={b.imageUrl} alt={b.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className={`absolute top-0 right-0 m-3 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg backdrop-blur-md border border-white/30 bg-gradient-to-r ${b.color} text-white`}>
                                    Save {b.savings}
                                </div>
                            </div>
                            <div className="p-5">
                                <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest truncate flex items-center gap-1 mb-1">
                                    <Users size={12} className="text-brand-mars" /> {b.familySize}
                                </p>
                                <h3 className="text-base font-black text-brand-dark leading-tight mb-3">{b.name}</h3>
                                
                                {/* "Order Options" summary limit to 2 items */}
                                <div className="space-y-1.5 mb-5">
                                    {b.items.slice(0, 2).map(item => (
                                       <div key={item} className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                          <div className="w-3 h-3 rounded-full flex items-center justify-center shrink-0 bg-gray-100">
                                              <Check size={8} style={{color: b.accentColor}} />
                                          </div>
                                          <span className="truncate">{item}</span>
                                       </div>
                                    ))}
                                    <div className="text-[9px] text-brand-dark/40 font-bold ml-5 uppercase tracking-widest">+{b.items.length - 2} more items</div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-300 line-through leading-none">₦{(b.price * 1.3).toLocaleString()}</p>
                                        <p className="text-lg font-black text-brand-dark leading-none mt-1">₦{b.price.toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(i)}
                                        className="h-10 px-4 bg-brand-dark text-white rounded-xl shadow-lg hover:bg-brand-mars transition-all transform active:scale-95 flex items-center gap-2 group-hover:shadow-brand-mars/20"
                                    >
                                        <ShoppingCart size={14} className="text-brand-light" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Add</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

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
                    {bundles.length === 0 && <span className="p-3 text-sm text-gray-400">Loading...</span>}
                    {bundles.map((b, i) => (
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
            {bundle && (
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
                                    <p className="text-[12px] font-black uppercase tracking-widest text-brand-mars mb-1">Exclusive Monthly Offer</p>
                                    <div className="flex items-baseline gap-4">
                                        <span className="text-5xl lg:text-7xl font-black text-brand-dark leading-none tracking-tighter">₦{bundle.price.toLocaleString()}</span>
                                        <span className="text-lg text-gray-300 font-black line-through">₦{(bundle.price * 1.3).toLocaleString()}</span>
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
                                    onClick={() => handleAddToCart()}
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
            )}
        </div>
    );
}
