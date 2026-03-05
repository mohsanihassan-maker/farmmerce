import { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Sprout, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Marketplace() {
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
        fetch('http://localhost:3000/api/categories')
            .then(res => res.json())
            .then(data => setCategories(['All', ...data.map((c: any) => c.name)]))
            .catch(() => { });
    }, []);

    // Fetch products whenever filters change
    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (debouncedSearch) params.set('search', debouncedSearch);
        if (category !== 'All') params.set('category', category);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort !== 'newest') params.set('sort', sort === 'Price: Low–High' ? 'price_asc' : 'price_desc');

        fetch(`http://localhost:3000/api/products?${params.toString()}`)
            .then(res => res.json())
            .then(data => { setProducts(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [debouncedSearch, category, minPrice, maxPrice, sort]);

    const handleAddToCart = (productId: number) => {
        const product = products.find((p: any) => p.id === productId);
        if (product) addToCart(product);
    };

    const sortOptions = ['newest', 'Price: Low–High', 'Price: High–Low'];

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Navbar />

            {/* Header / Banner */}
            <div className="bg-brand-dark pt-28 pb-12 rounded-b-[3rem] relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                    <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-light text-xs font-medium mb-3 border border-white/10"
                            >
                                <Sprout size={12} />
                                <span>Fresh Harvests</span>
                            </motion.div>
                            <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
                            <p className="text-gray-400 max-w-xl">
                                Discover fresh produce directly from local farmers.
                            </p>
                        </div>

                        {/* Search + Filter row */}
                        <div className="w-full md:w-auto flex gap-3 min-w-[300px]">
                            <div className="relative group flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-brand-light transition-colors" />
                                </div>
                                <input
                                    className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-xl leading-5 bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-brand-light transition-all shadow-inner"
                                    placeholder="Search produce..."
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`p-3 rounded-xl border transition-all ${showFilters ? 'bg-brand-light text-brand-dark border-brand-light' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                            >
                                <SlidersHorizontal size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Category Chips */}
                    <div className="mt-8 flex flex-nowrap overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`flex-shrink-0 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all border ${category === cat
                                    ? 'bg-brand-light text-brand-dark border-brand-light shadow-md shadow-brand-light/20 scale-105'
                                    : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Expandable filter row */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-4"
                            >
                                <div className="flex flex-wrap gap-3 pt-2">
                                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 border border-white/20">
                                        <span className="text-xs text-white/60 font-medium">Min ₦</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={minPrice}
                                            onChange={e => setMinPrice(e.target.value)}
                                            className="w-20 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 border border-white/20">
                                        <span className="text-xs text-white/60 font-medium">Max ₦</span>
                                        <input
                                            type="number"
                                            placeholder="99999"
                                            value={maxPrice}
                                            onChange={e => setMaxPrice(e.target.value)}
                                            className="w-20 bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                                        />
                                    </div>
                                    <div className="relative flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 border border-white/20">
                                        <span className="text-xs text-white/60 font-medium">Sort:</span>
                                        <select
                                            value={sort}
                                            onChange={e => setSort(e.target.value)}
                                            className="bg-transparent text-white text-sm focus:outline-none appearance-none pr-6 cursor-pointer"
                                        >
                                            {sortOptions.map(o => <option key={o} value={o} className="text-black">{o}</option>)}
                                        </select>
                                        <ChevronDown size={14} className="text-white/40 absolute right-2 pointer-events-none" />
                                    </div>
                                    <button
                                        onClick={() => { setMinPrice(''); setMaxPrice(''); setSort('newest'); setSearchTerm(''); setCategory('All'); }}
                                        className="text-xs text-white/50 hover:text-white transition-colors font-medium px-2"
                                    >
                                        Reset all
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8 relative z-20">
                {/* Categories Filter */}
                <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex overflow-x-auto no-scrollbar mb-10 mx-auto max-w-4xl justify-between md:justify-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${category === cat
                                ? 'bg-brand-dark text-white shadow-md'
                                : 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-100" />
                                <div className="p-5 space-y-3">
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                                    <div className="h-6 bg-gray-100 rounded w-1/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.length > 0 ? products.map((product: any) => (
                            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                        )) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Search className="h-10 w-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                                <p className="text-gray-500">Try adjusting your search terms or filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

