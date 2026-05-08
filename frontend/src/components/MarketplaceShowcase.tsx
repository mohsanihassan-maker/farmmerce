import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, SlidersHorizontal, ShoppingBag, X, Flame } from 'lucide-react';
import ProductCard from './ProductCard';
import { API_URL } from '../config';
import { supabase } from '../supabase';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CATEGORY_EMOJIS: Record<string, string> = {
    All: '🛒',
    Vegetables: '🥦',
    Fruits: '🍊',
    Grains: '🌾',
    Livestock: '🐄',
    'Eggs & Dairy': '🥚',
    Herbs: '🌿',
};

export default function MarketplaceShowcase() {
    const { addToCart } = useCart();
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [activeCategory, setActiveCategory] = useState('All');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showAll, setShowAll] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounce search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setDebouncedSearch(search), 350);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [search]);

    // Fetch products once
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/products?limit=24&sort=newest`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setAllProducts(data);
                        // Extract unique categories
                        const cats = ['All', ...Array.from(new Set(data.map((p: any) => p.categoryName).filter(Boolean))) as string[]];
                        setCategories(cats);
                        return;
                    }
                }
                throw new Error('API Empty');
            } catch {
                const { data } = await supabase
                    .from('Product')
                    .select('*, farmer:User(id, name), category:Category(name)')
                    .limit(24)
                    .order('createdAt', { ascending: false });
                if (data) {
                    const normalized = data.map((p: any) => ({
                        ...p,
                        categoryName: p.category?.name,
                    }));
                    setAllProducts(normalized);
                    const cats = ['All', ...Array.from(new Set(normalized.map((p: any) => p.categoryName).filter(Boolean))) as string[]];
                    setCategories(cats);
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // Filter locally
    useEffect(() => {
        let filtered = allProducts;
        if (activeCategory !== 'All') {
            filtered = filtered.filter(p => p.categoryName === activeCategory);
        }
        if (debouncedSearch.trim()) {
            const q = debouncedSearch.toLowerCase();
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(q) ||
                p.categoryName?.toLowerCase().includes(q) ||
                p.farmer?.name?.toLowerCase().includes(q)
            );
        }
        setProducts(filtered);
        setShowAll(false);
    }, [allProducts, activeCategory, debouncedSearch]);

    const handleAddToCart = (id: number) => {
        const product = allProducts.find((p: any) => p.id === id);
        if (product) addToCart(product);
    };

    const displayed = showAll ? products : products.slice(0, 12);

    return (
        <section className="bg-white py-10 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Section Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-dark/40 mb-2">
                            Direct from source
                        </p>
                        <h2 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight leading-tight flex items-center gap-3">
                            <Flame size={26} className="text-orange-500 shrink-0" />
                            Fresh Today
                        </h2>
                    </div>

                    <Link
                        to="/market"
                        className="flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all group shadow-lg shadow-brand-dark/10 shrink-0 self-start sm:self-auto"
                    >
                        Full Marketplace
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-brand-light" />
                    </Link>
                </div>

                {/* ── Search + Filter Bar ── */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search produce, farms…"
                            className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-brand-dark placeholder:text-gray-300 focus:outline-none focus:border-brand-dark/30 focus:bg-white transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Category pills — horizontal scroll on mobile */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar sm:pb-0 flex-1">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap border ${
                                    activeCategory === cat
                                        ? 'bg-brand-dark text-white border-brand-dark shadow-md scale-105'
                                        : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-brand-dark/30 hover:text-brand-dark'
                                }`}
                            >
                                <span>{CATEGORY_EMOJIS[cat] || '🌱'}</span>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Product Grid ── */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-2xl h-52 animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100"
                    >
                        <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-lg font-black text-brand-dark">
                            {debouncedSearch ? `No results for "${debouncedSearch}"` : 'Marketplace is Restocking'}
                        </p>
                        <p className="text-sm text-gray-400 font-medium mt-1">
                            {debouncedSearch ? 'Try a different search term.' : 'We&apos;re harvesting fresh items right now.'}
                        </p>
                        {debouncedSearch && (
                            <button
                                onClick={() => setSearch('')}
                                className="mt-4 px-4 py-2 bg-brand-dark text-white rounded-xl text-xs font-black hover:bg-black transition-all"
                            >
                                Clear Search
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <>
                        <motion.div
                            layout
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
                        >
                            <AnimatePresence mode="popLayout">
                                {displayed.map((product, i) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.25, delay: i * 0.03 }}
                                        className="h-full"
                                    >
                                        <ProductCard product={product} onAddToCart={handleAddToCart} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Show more / View all */}
                        {!showAll && products.length > 12 && (
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="px-8 py-3 border-2 border-brand-dark text-brand-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all"
                                >
                                    Show {products.length - 12} More Products
                                </button>
                                <Link
                                    to="/market"
                                    className="flex items-center gap-2 px-8 py-3 bg-brand-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all group"
                                >
                                    View All in Marketplace
                                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}

                        {showAll && (
                            <div className="mt-8 text-center">
                                <Link
                                    to="/market"
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-brand-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all group"
                                >
                                    Open Full Marketplace
                                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}
                    </>
                )}

                {/* ── Category Quick Tiles ── */}
                <div className="mt-12 pt-10 border-t border-gray-100">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-5 text-center">Browse by category</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {[
                            { name: 'Vegetables', emoji: '🥦', color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100 text-emerald-800' },
                            { name: 'Fruits',     emoji: '🍊', color: 'bg-orange-50 hover:bg-orange-100 border-orange-100 text-orange-800' },
                            { name: 'Grains',     emoji: '🌾', color: 'bg-amber-50 hover:bg-amber-100 border-amber-100 text-amber-800' },
                            { name: 'Livestock',  emoji: '🐄', color: 'bg-rose-50 hover:bg-rose-100 border-rose-100 text-rose-800' },
                            { name: 'Eggs & Dairy', emoji: '🥚', color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-100 text-yellow-800' },
                            { name: 'Herbs',      emoji: '🌿', color: 'bg-teal-50 hover:bg-teal-100 border-teal-100 text-teal-800' },
                        ].map(cat => (
                            <Link
                                key={cat.name}
                                to={`/market?category=${encodeURIComponent(cat.name)}`}
                                className={`flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl border font-black text-sm text-center transition-all hover:-translate-y-0.5 hover:shadow-md duration-200 ${cat.color}`}
                            >
                                <span className="text-3xl">{cat.emoji}</span>
                                <span className="text-xs uppercase tracking-widest leading-tight">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
