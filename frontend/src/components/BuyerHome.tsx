import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ShoppingBag,
    ChefHat,
    ShoppingCart,
    Star,
    Leaf,
    Bell,
    Search,
    Flame,
    Award,
    Clock,
    ArrowRight,
    Zap,
    Tag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';
import FoodBundleSelector from './FoodBundleSelector';
import { supabase } from '../supabase';

const QUICK_LINKS = [
    { label: 'Shop All',  icon: ShoppingBag, tab: 'marketplace',  bg: 'bg-brand-dark',   text: 'text-white',       accent: 'text-brand-light' },
    { label: 'My Orders', icon: Clock,        tab: 'my-orders',   bg: 'bg-brand-mars',   text: 'text-white',       accent: 'text-brand-mars/20' },
    { label: 'Meal Plan', icon: ChefHat,      tab: 'meal-planner', bg: 'bg-brand-yellowDark', text: 'text-white',       accent: 'text-brand-yellow/20' },
    { label: 'Promos',    icon: Tag,          tab: 'promos',       bg: 'bg-brand-red',    text: 'text-white',       accent: 'text-brand-red/20' },
];

const PROMO_BANNERS = [
    {
        id: 1,
        title: '15% Off Fresh Vegetables',
        subtitle: 'Direct from farms this week only',
        emoji: '🥦',
        gradient: 'from-green-600 to-emerald-400',
    },
    {
        id: 2,
        title: 'Free Delivery Today',
        subtitle: 'On all orders over ₦3,000',
        emoji: '🚚',
        gradient: 'from-blue-600 to-cyan-400',
    },
    {
        id: 3,
        title: 'Bundle & Save More',
        subtitle: 'Buy 3 categories, save 20%',
        emoji: '🛒',
        gradient: 'from-orange-500 to-yellow-400',
    },
];

export default function BuyerHome({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
    const { user } = useAuth();
    const { itemCount: cartCount } = useCart();
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [activeBanner, setActiveBanner] = useState(0);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        // Auto-cycle promo banners
        const t = setInterval(() => setActiveBanner(b => (b + 1) % PROMO_BANNERS.length), 4000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const loadContent = async () => {
            // 1. Fetch Products
            try {
                const res = await fetch(`${API_URL}/products?sort=newest&limit=8`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setFeaturedProducts(data.slice(0, 8));
                    }
                } else throw new Error();
            } catch {
                console.warn('REST API Products fallback to Supabase...');
                const { data } = await supabase.from('Product').select('*, farmer:User(id, name)').limit(8).order('createdAt', { ascending: false });
                if (data) setFeaturedProducts(data);
            }

            // 2. Fetch Categories
            try {
                const res = await fetch(`${API_URL}/categories`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) setCategories(data);
                } else throw new Error();
            } catch {
                console.warn('REST API Categories fallback to Supabase...');
                const { data } = await supabase.from('Category').select('*');
                if (data) setCategories(data);
            }

            // 3. Recent Orders (Only if logged in)
            if (user?.id) {
                try {
                    const res = await fetch(`${API_URL}/orders?buyerId=${user.id}&limit=3`);
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data)) setRecentOrders(data.slice(0, 3));
                    } else throw new Error();
                } catch {
                    console.warn('REST API Orders fallback to Supabase...');
                    const { data } = await supabase.from('Order').select('*, items:OrderItem(*)').eq('buyerId', user.id).limit(3).order('createdAt', { ascending: false });
                    if (data) setRecentOrders(data);
                }
            }
        };

        loadContent();
    }, [user]);

    const firstName = user?.name?.split(' ')[0] || 'there';
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const statusStyle: Record<string, string> = {
        PENDING: 'bg-brand-yellow/20 text-brand-yellowDark',
        CONFIRMED: 'bg-brand-mars/10 text-brand-mars',
        SHIPPED: 'bg-brand-purple/10 text-brand-purple',
        DELIVERED: 'bg-brand-light/30 text-brand-dark',
    };

    return (
        <div className="min-h-full bg-gray-50">
            {/* ── HEADER ── */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-20 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">{greeting} 👋</p>
                        <h1 className="text-xl font-black text-brand-dark leading-tight">{firstName}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 bg-brand-light/10 rounded-2xl text-brand-dark hover:bg-brand-light/20 transition-all">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{cartCount}</span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-3">
                    <button
                        onClick={() => setActiveTab('marketplace')}
                        className="w-full flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-400 text-sm hover:border-brand-dark/30 transition-all text-left shadow-sm"
                    >
                        <Search size={16} className="shrink-0" />
                        <span>Search fresh produce, farms…</span>
                    </button>
                    <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar px-1">
                        {['Tomato', 'Onion', 'Yam', 'Fresh Eggs'].map(tag => (
                            <button key={tag} onClick={() => setActiveTab('marketplace')} className="text-[10px] font-bold text-gray-400 bg-gray-100/50 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-7 py-5 pb-28">
                {/* ── PROMO BANNER ── */}
                <section>
                    <div className="relative overflow-hidden rounded-[2rem] h-40 shadow-xl">
                        {PROMO_BANNERS.map((b, i) => (
                            <motion.div
                                key={b.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: i === activeBanner ? 1 : 0, scale: i === activeBanner ? 1 : 0.95 }}
                                transition={{ duration: 0.5 }}
                                className={`absolute inset-0 bg-gradient-to-br ${b.gradient} p-7 flex items-center justify-between`}
                            >
                                <div className="max-w-[60%]">
                                    <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Exclusive Deal</p>
                                    <h3 className="text-white text-2xl font-black leading-tight drop-shadow-sm">{b.title}</h3>
                                    <p className="text-white/80 text-xs mt-2 font-medium">{b.subtitle}</p>
                                </div>
                                <div className="text-6xl drop-shadow-lg">{b.emoji}</div>
                            </motion.div>
                        ))}
                        {/* Dots */}
                        <div className="absolute bottom-4 left-7 flex gap-2">
                            {PROMO_BANNERS.map((_, i) => (
                                <button key={i} onClick={() => setActiveBanner(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeBanner ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── FOOD BUNDLE SELECTOR ── */}
                <section>
                    <FoodBundleSelector />
                </section>

                {/* ── QUICK LINKS ── */}
                <section>
                    <div className="grid grid-cols-4 gap-3">
                        {QUICK_LINKS.map((q) => (
                            <button
                                key={q.label}
                                onClick={() => setActiveTab(q.tab)}
                                className={`${q.bg} ${q.text} flex flex-col items-center justify-center gap-2 py-4 px-1 rounded-3xl transition-all active:scale-90 shadow-lg border border-white/10`}
                            >
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <q.icon size={20} className="text-white" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-center leading-tight">{q.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* ── RECENT ORDERS ── */}
                {recentOrders.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest">Recent Orders</h2>
                            <button onClick={() => setActiveTab('my-orders')} className="text-[10px] text-brand-dark/40 font-black uppercase tracking-widest flex items-center gap-1 hover:text-brand-dark">
                                See all <ArrowRight size={10} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {recentOrders.map((order: any) => (
                                <div key={order.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-brand-dark/5 rounded-xl flex items-center justify-center">
                                            <ShoppingBag size={16} className="text-brand-dark/60" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-brand-dark">Order #{order.id}</p>
                                            <p className="text-xs text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''} • ₦{Number(order.totalAmount).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${statusStyle[order.status] || 'bg-gray-100 text-gray-500'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── CATEGORIES ── */}
                {categories.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest">Shop by Category</h2>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {categories.slice(0, 8).map((cat: any) => (
                                <button key={cat.id} onClick={() => setActiveTab('marketplace')}
                                    className="flex-shrink-0 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:border-brand-dark hover:text-brand-dark transition-all whitespace-nowrap shadow-sm">
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── FEATURED PRODUCTS ── */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest flex items-center gap-2">
                            <Flame size={14} className="text-orange-500" /> Fresh Today
                        </h2>
                        <button onClick={() => setActiveTab('marketplace')} className="text-[10px] text-brand-dark/40 font-black uppercase tracking-widest flex items-center gap-1 hover:text-brand-dark">
                            View all <ArrowRight size={10} />
                        </button>
                    </div>

                    {featuredProducts.length === 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl h-48 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {featuredProducts.map((product: any, i: number) => (
                                <ProductCard key={product.id} product={product} index={i} onTap={() => setActiveTab('marketplace')} />
                            ))}
                        </div>
                    )}
                </section>

                {/* ── WHY FARMMERCE ── */}
                <section className="bg-brand-dark rounded-[2rem] p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-28 h-28 bg-brand-light/10 rounded-full -mr-8 -mt-8 blur-2xl" />
                    <h3 className="font-black text-lg mb-4">Why Farm-Fresh?</h3>
                    <div className="space-y-3 relative z-10">
                        {[
                            { icon: Leaf, text: '100% from verified local farms' },
                            { icon: Zap, text: 'Harvested within 48 hours' },
                            { icon: Award, text: 'Zero middlemen, better prices' },
                            { icon: Star, text: 'Eco-tracked from field to fork' },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex items-center gap-3">
                                <div className="w-7 h-7 bg-brand-light/20 rounded-lg flex items-center justify-center shrink-0">
                                    <Icon size={13} className="text-brand-light" />
                                </div>
                                <p className="text-sm text-white/80 font-medium">{text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

function ProductCard({ product, index, onTap }: { product: any; index: number; onTap: () => void }) {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={onTap}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group active:scale-95 transition-all"
        >
            <div className="h-32 bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden">
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                        {product.name?.[0] === 'T' ? '🍅' : product.name?.[0] === 'O' ? '🧅' : '🥬'}
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-black text-green-700 flex items-center gap-1">
                    <Leaf size={9} /> Fresh
                </div>
            </div>
            <div className="p-3">
                <p className="text-xs text-gray-400 font-medium truncate">{product.farmer?.name || 'Local Farm'}</p>
                <p className="text-sm font-black text-brand-dark truncate mt-0.5">{product.name}</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-base font-black text-brand-dark">₦{parseFloat(String(product.price)).toLocaleString()}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="w-10 h-10 bg-brand-dark text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-brand-mars transition-all active:scale-90"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
