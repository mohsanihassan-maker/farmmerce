import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Sprout, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';
import { supabase } from '../supabase';

export default function MarketplaceView() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [categories, setCategories] = useState<string[]>(['All']);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Debounce search input (400ms)
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => setDebouncedSearch(searchTerm), 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [searchTerm]);

    // Fetch categories once
    useEffect(() => {
        fetch(`${API_URL}/categories`)
            .then(res => res.json())
            .then(data => setCategories(['All', ...data.map((c: any) => c.name)]))
            .catch(() => { });
    }, []);

    // Fetch products whenever filters change
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            const params = new URLSearchParams();
            if (debouncedSearch) params.set('search', debouncedSearch);
            if (category !== 'All') params.set('category', category);
            if (minPrice) params.set('minPrice', minPrice);
            if (maxPrice) params.set('maxPrice', maxPrice);
            if (sort !== 'newest') params.set('sort', sort === 'Price: Low–High' ? 'price_asc' : 'price_desc');

            try {
                const res = await fetch(`${API_URL}/products?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setProducts(data);
                        setLoading(false);
                        return;
                    }
                }
                throw new Error('API Offline');
            } catch (err) {
                console.warn('REST API unavailable, falling back to Supabase Direct...');
                let query = supabase.from('Product').select('*, farmer:User(id, name)');

                if (debouncedSearch) query = query.ilike('name', `%${debouncedSearch}%`);
                if (category !== 'All') query = query.eq('categoryName', category);
                if (minPrice) query = query.gte('price', parseFloat(minPrice));
                if (maxPrice) query = query.lte('price', parseFloat(maxPrice));

                if (sort === 'Price: Low–High') query = query.order('price', { ascending: true });
                else if (sort === 'Price: High–Low') query = query.order('price', { ascending: false });
                else query = query.order('createdAt', { ascending: false });

                const { data, error } = await query;
                if (data && !error) setProducts(data);
                setLoading(false);
            }
        };

        loadProducts();
    }, [debouncedSearch, category, minPrice, maxPrice, sort]);

    const handleAddToCart = (productId: number) => {
        const product = products.find((p: any) => p.id === productId);
        if (product) addToCart(product);
    };

    const sortOptions = ['newest', 'Price: Low–High', 'Price: High–Low'];

    return (
        <div className="space-y-6">
            {/* Search + Filter Header */}
            <div className="bg-brand-dark p-8 rounded-[2.5rem] relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                    <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
                </div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-black text-white tracking-tight">Marketplace</h2>
                            <p className="text-gray-400 text-sm font-medium mt-1">Fresh from the farm to your table</p>
                        </div>

                        <div className="w-full md:w-auto flex gap-3 min-w-[300px]">
                            <div className="relative group flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input
                                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-light transition-all text-sm"
                                    placeholder="Search fresh produce..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-3 rounded-xl border transition-all ${showFilters ? 'bg-brand-light text-brand-dark border-brand-light' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                            >
                                <SlidersHorizontal size={18} />
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-6 pt-6 border-t border-white/10"
                            >
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Price Range</span>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={minPrice}
                                            onChange={e => setMinPrice(e.target.value)}
                                            className="w-16 bg-transparent text-white text-xs focus:outline-none placeholder-gray-600"
                                        />
                                        <span className="text-white/20">—</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={maxPrice}
                                            onChange={e => setMaxPrice(e.target.value)}
                                            className="w-16 bg-transparent text-white text-xs focus:outline-none placeholder-gray-600"
                                        />
                                    </div>
                                    <div className="relative flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                                        <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Sort By</span>
                                        <select
                                            value={sort}
                                            onChange={e => setSort(e.target.value)}
                                            className="bg-transparent text-white text-xs focus:outline-none appearance-none pr-6 cursor-pointer"
                                        >
                                            {sortOptions.map(o => <option key={o} value={o} className="text-black">{o}</option>)}
                                        </select>
                                        <ChevronDown size={12} className="text-white/40 absolute right-2 pointer-events-none" />
                                    </div>
                                    <button
                                        onClick={() => { setMinPrice(''); setMaxPrice(''); setSort('newest'); setSearchTerm(''); setCategory('All'); }}
                                        className="text-[10px] font-black text-brand-light/60 hover:text-brand-light uppercase tracking-widest transition-colors px-2"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Category Navigation */}
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-6 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${category === cat
                            ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-brand-dark hover:text-brand-dark'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-3xl h-64 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                    {products.length > 0 ? products.map((product: any) => (
                        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                    )) : (
                        <div className="col-span-full py-20 text-center">
                            <div className="mx-auto h-20 w-20 bg-gray-100 rounded-[2rem] flex items-center justify-center mb-4">
                                <Search className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No results found</h3>
                            <p className="text-sm text-gray-500">Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
