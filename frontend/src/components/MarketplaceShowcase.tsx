import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import ProductCard from './ProductCard';
import { API_URL } from '../config';
import { supabase } from '../supabase';

export default function MarketplaceShowcase() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                // Try REST API first
                const res = await fetch(`${API_URL}/products`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setProducts(data.slice(0, 8));
                        return;
                    }
                }
                throw new Error('API Offline');
            } catch (err) {
                console.warn('REST API unavailable, falling back to Supabase Direct...');
                // Fallback: Direct Supabase Fetch
                const { data, error } = await supabase
                    .from('Product')
                    .select('*, farmer:User(id, name)')
                    .limit(8)
                    .order('createdAt', { ascending: false });

                if (data && !error) {
                    setProducts(data);
                }
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    const handleAddToCart = (id: number) => {
        // Since we're on the landing page, we might just redirect to login 
        // or show a toast that adding to cart requires login.
        // For now, let's just log it.
        console.log(`Add to cart product ${id}`);
        // In a real app, this would use a CartContext
    };

    if (loading) return (
        <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-light mx-auto"></div>
        </div>
    );

    if (products.length === 0) return (
        <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] mx-4 border-2 border-dashed border-gray-100 flex flex-col items-center gap-4">
            <ShoppingBag className="w-12 h-12 text-gray-200" />
            <div>
                <p className="text-lg font-black text-brand-dark">Marketplace is Restocking</p>
                <p className="text-sm text-gray-400 font-medium">We're harvesting fresh items from the fields right now.</p>
            </div>
        </div>
    );

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-brand-dark/60 font-black uppercase tracking-[0.2em] text-xs mb-4 block">
                            Direct from source
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tight leading-[1.1]">
                            Today's <span className="text-brand-mars">Fresh</span> Arrivals
                        </h2>
                        <p className="mt-4 text-gray-500 font-medium text-lg leading-relaxed">
                            Skipping the middleman means you get it fresher, faster, and cheaper.
                            Harvested today, on your table tomorrow.
                        </p>
                    </div>

                    <button
                        onClick={() => window.location.href = '/market'}
                        className="flex items-center gap-2 px-8 py-4 bg-brand-dark text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-black transition-all group shadow-xl shadow-brand-dark/10"
                    >
                        Explore Marketplace
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-brand-light" />
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                >
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="h-full"
                        >
                            <ProductCard
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Categories Quick Links */}
                <div className="mt-20 pt-20 border-t border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'Vegetables', color: 'bg-brand-light/20 text-brand-dark border-brand-light/30', iconColor: 'text-brand-dark' },
                            { name: 'Fruits',     color: 'bg-brand-mars/10 text-brand-mars border-brand-mars/20', iconColor: 'text-brand-mars' },
                            { name: 'Grains',     color: 'bg-brand-yellow/20 text-brand-yellowDark border-brand-yellow/30', iconColor: 'text-brand-yellowDark' },
                            { name: 'Livestock',  color: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20', iconColor: 'text-brand-purple' }
                        ].map((cat) => (
                            <motion.div
                                key={cat.name}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`p-8 rounded-[2rem] bg-gradient-to-br ${cat.color} border cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className="absolute -right-4 -bottom-4 opacity-5 transform group-hover:scale-150 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                                    <ShoppingBag className="w-40 h-40" />
                                </div>
                                <div className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 shadow-sm relative z-10">
                                    <ShoppingBag className={`w-7 h-7 ${cat.iconColor}`} />
                                </div>
                                <h4 className="font-black text-2xl mb-1 relative z-10 tracking-tight">{cat.name}</h4>
                                <p className="text-sm opacity-80 font-bold uppercase tracking-widest relative z-10">Shop Fresh →</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
