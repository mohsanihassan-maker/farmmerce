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
    Tag,
    Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';
import FoodBundleSelector from './FoodBundleSelector';
import { supabase } from '../supabase';
import MealPlannerEmbed from './MealPlannerEmbed';

const QUICK_LINKS = [
    { label: 'Shop All',  icon: ShoppingBag, tab: 'marketplace',  bg: 'bg-brand-dark',   text: 'text-white',       accent: 'text-brand-light' },
    { label: 'My Orders', icon: Clock,        tab: 'my-orders',   bg: 'bg-brand-mars',   text: 'text-white',       accent: 'text-brand-mars/20' },
    { label: 'Meal Plan', icon: ChefHat,      tab: 'meal-planner', bg: 'bg-brand-yellow', text: 'text-brand-dark',       accent: 'text-brand-yellow/20' },
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
    const [localTab, setLocalTab] = useState('home');
    const [allOrders, setAllOrders] = useState<any[]>([]);
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
                    if (Array.isArray(data) && data.length > 0) {
                        setFeaturedProducts(data.slice(0, 8));
                    } else throw new Error('API Empty');
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
                    if (Array.isArray(data) && data.length > 0) setCategories(data);
                    else throw new Error('Empty');
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

    useEffect(() => {
        if (localTab === 'my-orders' && user?.id) {
            const fetchAllOrders = async () => {
                try {
                    const res = await fetch(`${API_URL}/orders?buyerId=${user.id}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data)) setAllOrders(data);
                    }
                } catch {
                    const { data } = await supabase.from('Order').select('*, items:OrderItem(*)').eq('buyerId', user.id).order('createdAt', { ascending: false });
                    if (data) setAllOrders(data);
                }
            };
            fetchAllOrders();
        }
    }, [localTab, user]);

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
        <div className="min-h-full bg-[#FAF8F5]">
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
                                <div className="max-w-[60%] relative z-10">
                                    <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Exclusive Deal</p>
                                    <h3 className="text-white text-2xl font-black leading-tight drop-shadow-sm">{b.title}</h3>
                                    <p className="text-white/80 text-xs mt-2 font-medium">{b.subtitle}</p>
                                </div>
                                {/* Brand Pattern Background */}
                                <div className="absolute inset-0 opacity-[0.05] pointer-events-none grayscale brightness-200">
                                    <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-6xl drop-shadow-lg relative z-10">{b.emoji}</div>
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
                    <FoodBundleSelector isCompact={true} />
                </section>

                {/* ── QUICK LINKS ── */}
                <section>
                    <div className="grid grid-cols-4 gap-3">
                        {QUICK_LINKS.map((q) => (
                            <button
                                key={q.label}
                                onClick={() => {
                                    if (q.tab === 'marketplace') setActiveTab('marketplace');
                                    else setLocalTab(q.tab);
                                }}
                                className={`${q.bg} ${q.text} flex flex-col items-center justify-center gap-2 py-4 px-1 rounded-3xl transition-all active:scale-90 shadow-lg border border-white/10 group hover:-translate-y-1 hover:shadow-xl duration-300`}
                            >
                                <div className="p-2.5 bg-white/20 rounded-2xl shadow-inner group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative">
                                    <q.icon size={26} className="drop-shadow-lg relative z-10 text-current" />
                                    <div className="absolute inset-0 bg-white/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-center leading-tight drop-shadow-sm group-hover:scale-105 transition-transform">{q.label}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {localTab === 'home' && (
                    <>
                        {/* ── RECENT ORDERS ── */}
                        {recentOrders.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-black text-brand-dark uppercase tracking-widest">Recent Orders</h2>
                                    <button onClick={() => setLocalTab('my-orders')} className="text-[10px] text-brand-dark/40 font-black uppercase tracking-widest flex items-center gap-1 hover:text-brand-dark">
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
                    </>
                )}

                {localTab === 'my-orders' && (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h1 className="text-2xl font-black text-brand-dark tracking-tight">Purchase History</h1>
                            <span className="px-4 py-1.5 bg-brand-light/20 text-brand-dark rounded-full text-xs font-black uppercase tracking-widest">
                                {allOrders.length} Orders
                            </span>
                        </div>
                        <div className="space-y-4">
                            {allOrders.map((order: any) => (
                                <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-dark/20 font-black text-xl">📦</div>
                                            <div>
                                                <h3 className="font-black text-brand-dark">Order #{order.id}</h3>
                                                <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl border ${order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' : order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 border-t border-gray-50 pt-4">
                                        {order.items?.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black">{item.quantity}x</span>
                                                    <span className="font-bold text-brand-dark/70">{item.product?.name || 'Product'}</span>
                                                </div>
                                                <span className="font-black text-brand-dark">₦{Number(item.price).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 flex items-center justify-between bg-gray-50/50 rounded-2xl p-4">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Amount</p>
                                            <p className="text-xl font-black text-brand-dark">₦{Number(order.totalAmount).toLocaleString()}</p>
                                        </div>
                                        <button className="px-6 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-black hover:bg-black transition-all active:scale-95 shadow-lg">
                                            Order Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {localTab === 'meal-planner' && (
                    <section>
                        <MealPlannerEmbed />
                    </section>
                )}

                {localTab === 'promos' && (
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-black text-brand-dark tracking-tight leading-none mb-1">Coupon Codes</h2>
                            <p className="text-xs text-gray-400 font-medium">Extra savings for you</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { code: 'FRESH15', title: '15% Off Vegetables', desc: 'Valid on all leafy greens and root vegetables.', color: 'bg-gradient-to-br from-brand-dark to-emerald-600 text-white shadow-xl shadow-brand-dark/20 border-0' },
                            { code: 'SHIPFREE', title: 'Free Delivery', desc: 'On orders above ₦5,000 using our logistics partners.', color: 'bg-gradient-to-br from-brand-mars to-orange-500 text-white shadow-xl shadow-brand-mars/20 border-0' },
                            { code: 'FARMSTRENGTH', title: '₦1,000 Off Bundle', desc: 'Buy any 4 categories and save ₦1,000 instantly.', color: 'bg-gradient-to-br from-brand-yellowDark to-brand-yellow text-brand-dark shadow-xl shadow-brand-yellow/30 border-0' },
                        ].map((promo) => (
                            <div key={promo.code} className={`p-6 rounded-3xl ${promo.color} flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300`}>
                                <div>
                                    <h3 className="font-black text-lg mb-1 drop-shadow-sm">{promo.title}</h3>
                                    <p className={`text-sm mb-4 font-medium ${promo.color.includes('text-white') ? 'text-white/80' : 'text-brand-dark/80'}`}>{promo.desc}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <code className={`px-4 py-2 rounded-xl font-black tracking-widest shadow-inner ${promo.color.includes('text-white') ? 'bg-white/20 backdrop-blur-md border border-white/20 text-white' : 'bg-white/50 backdrop-blur-md border border-white/40 text-brand-dark'}`}>
                                        {promo.code}
                                    </code>
                                    <button className="text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform bg-black/10 px-3 py-2 rounded-lg">Copy</button>
                                </div>
                            </div>
                        ))}
                        </div>
                    </section>
                )}
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
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-dark/5 border border-gray-100 cursor-pointer group active:scale-[0.98] transition-all duration-300 relative"
        >
            <div className="h-28 bg-[#F4F1EE] relative overflow-hidden">
                {/* Brand Pattern Overlay */}
                <div className="absolute inset-0 opacity-[0.03] grayscale pointer-events-none">
                    <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
                </div>
                
                {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out relative z-10" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl relative z-10">
                        {product.name?.[0] === 'T' ? '🍅' : product.name?.[0] === 'O' ? '🧅' : '🥬'}
                    </div>
                )}
                
                {/* Fancy Badge */}
                <div className="absolute top-3 left-3 bg-brand-light/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-brand-dark flex items-center gap-1.5 shadow-sm border border-white/50 z-20 uppercase tracking-tighter">
                    <Sparkles size={10} className="text-brand-dark" /> Fresh
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-15 flex items-center justify-center">
                    <span className="bg-white text-brand-dark px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Quick View
                    </span>
                </div>
            </div>

            <div className="p-4 relative">
                <div className="flex justify-between items-start mb-1">
                    <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] text-brand-dark/40 font-black uppercase tracking-widest truncate">{product.farmer?.name || 'Local Farm'}</p>
                        <h4 className="text-sm font-black text-brand-dark truncate leading-tight mt-0.5">{product.name}</h4>
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Price</span>
                        <span className="text-base font-black text-brand-dark leading-none">₦{parseFloat(String(product.price)).toLocaleString()}</span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="w-10 h-10 bg-brand-dark text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-brand-mars hover:scale-110 transition-all active:scale-95 group/btn"
                    >
                        <ShoppingCart size={18} className="group-hover/btn:rotate-12 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
