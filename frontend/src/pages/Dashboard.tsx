import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    User,
    LogOut,
    QrCode,
    X,
    Bell,
    Truck,
    ShoppingCart,
    ChefHat,
    Navigation,
    CheckCircle,
    Menu,
    Home,
    Filter,
    Users,
    Sprout,
    Clock,
    MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';
import ProductForm from '../components/ProductForm';
import ProfileForm from '../components/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import MarketplaceView from '../components/MarketplaceView';
import BuyerHome from '../components/BuyerHome';
import MealPlannerEmbed from '../components/MealPlannerEmbed';
import FoodBundleSelector from '../components/FoodBundleSelector';
import { QRCodeCanvas } from 'qrcode.react';
import { API_URL } from '../config';
import { api } from '../api';


export default function Dashboard() {
    const { user, isAuthenticated, loading } = useAuth();
    const [viewMode, setViewMode] = useState<any>(user?.role === 'FARMER' ? 'FARMER' : user?.role === 'ADMIN' ? 'ADMIN' : 'BUYER');
    const [activeTab, setActiveTab] = useState(user?.role === 'FARMER' ? 'dashboard' : user?.role === 'ADMIN' ? 'admin-stats' : 'buyer-home');
    const [orders, setOrders] = useState<any[]>([]);
    const [myProducts, setMyProducts] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [selectedQr, setSelectedQr] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [availableTasks, setAvailableTasks] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [adminStats, setAdminStats] = useState<any>(null);
    const [allOrders, setAllOrders] = useState<any[]>([]);
    const [allCategories, setAllCategories] = useState<any[]>([]);
    const [allRecipes, setAllRecipes] = useState<any[]>([]);
    const [pendingSettlements, setPendingSettlements] = useState<any[]>([]);
    const [allSettlements, setAllSettlements] = useState<any[]>([]);
    const [allDeals, setAllDeals] = useState<any[]>([]);
    const [allBundles, setAllBundles] = useState<any[]>([]);
    const [panelEnabled, setPanelEnabled] = useState(false);
    const [selectedAdminUser, setSelectedAdminUser] = useState<any>(null);
    const [pendingApplications, setPendingApplications] = useState<any[]>([]);
    const [bundleForm, setBundleForm] = useState<any>({ name: '', familySize: '', price: '', savings: '', color: 'from-blue-500 to-indigo-600', badge: '', imageUrl: '', items: '[]' });
    const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
    const navigate = useNavigate();

    const fetchStats = () => {
        if (!user) return;
        api.get(`/users/${user.id}/stats`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    };


    const fetchMyOrders = () => {
        if (!user) return;
        api.get(`/orders?buyerId=${user.id}`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err));
    };


    const fetchIncomingOrders = () => {
        if (!user) return;
        api.get(`/orders?farmerId=${user.id}`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err));
    };


    const fetchLogisticsTasks = () => {
        if (!user) return;
        // Fetch available tasks (unassigned)
        fetch(`${API_URL}/logistics/available`)
            .then(res => res.json())
            .then(data => setAvailableTasks(data))
            .catch(err => console.error(err));

        // Fetch assigned tasks (to this agent)
        fetch(`${API_URL}/logistics/tasks/${user.id}`)
            .then(res => res.json())
            .then(data => setOrders(data)) // Reusing orders state for assigned tasks
            .catch(err => console.error(err));
    };

    useEffect(() => {
        if (!user) return;

        if (activeTab === 'dashboard') {
            fetchStats();
        }
        if (activeTab === 'orders') { // Incoming Orders
            fetchIncomingOrders();
        }
        if (activeTab === 'my-orders') {
            fetchMyOrders();
        }
        if (activeTab === 'products') {
            fetch(`${API_URL}/products`)
                .then(res => res.json())
                .catch(err => console.error(err))
                .then(data => {
                    if (data && Array.isArray(data)) {
                        setMyProducts(data.filter((p: any) => p.farmerId === user.id));
                    }
                });
        }
        if (activeTab === 'logistics') {
            fetchLogisticsTasks();
        }
        if (activeTab === 'admin-users') {
            api.get('/admin/users')
                .then(res => res.json())
                .then(data => setAllUsers(data))
                .catch(err => console.error(err));
        }
        if (activeTab === 'admin-stats') {
            api.get('/admin/stats')
                .then(res => res.json())
                .then(data => setAdminStats(data))
                .catch(err => console.error(err));
        }
        if (activeTab === 'admin-orders') {
            api.get('/admin/orders')
                .then(res => res.json())
                .then(data => setAllOrders(data))
                .catch(err => console.error(err));
        }
        if (activeTab === 'admin-farmer-requests') {
            api.get('/admin/applications')
                .then(res => res.json())
                .then(data => setPendingApplications(data))
                .catch(err => console.error(err));
        }

        if (activeTab === 'admin-categories') {
            fetch(`${API_URL}/categories`)
                .then(res => res.json())
                .then(data => setAllCategories(data))
                .catch(err => console.error(err));
        }
        if (activeTab === 'admin-recipes') {
            fetch(`${API_URL}/recipes`)
                .then(res => res.json())
                .then(data => setAllRecipes(data))
                .catch(err => console.error(err));
        }
        if (activeTab === 'admin-settlements' || activeTab === 'settlements') {
            // Fetch pending payouts
            fetch(`${API_URL}/settlements/pending`)
                .then(res => res.json())
                .then(data => setPendingSettlements(data))
                .catch(err => console.error(err));

            // Fetch history
            fetch(`${API_URL}/settlements`)
                .then(res => res.json())
                .then(data => setAllSettlements(data))
                .catch(err => console.error(err));
        }
        if (activeTab === 'admin-bundles') {
            api.get('/bundles')
                .then(res => res.json())
                .then(data => setAllBundles(data))
                .catch(err => console.error(err));
        }
        if (activeTab === 'group-deals') {
            fetch(`${API_URL}/group-deals`)
                .then(res => res.json())
                .then(data => setAllDeals(data))
                .catch(err => console.error(err));

            // Fetch ALL products so admins can create deals for any product
            fetch(`${API_URL}/products`)
                .then(res => res.json())
                .then(data => setMyProducts(data));

            // Fetch current panel toggle state
            fetch(`${API_URL}/group-deals/panel-enabled`)
                .then(res => res.json())
                .then(data => setPanelEnabled(data.enabled))
                .catch(err => console.error(err));
        }
    }, [activeTab, user]);

    const handleCreateProduct = async (data: any) => {
        if (!user) return;
        try {
            const productData = { ...data, farmerId: user.id };
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (response.ok) {
                alert('Product Created Successfully!');
                // Refresh products list
                const refresh = await fetch(`${API_URL}/products`).then(res => res.json());
                if (refresh && Array.isArray(refresh)) {
                    setMyProducts(refresh.filter((p: any) => p.farmerId === user.id));
                }
            } else alert('Failed to create product');
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating product');
        }
    };

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center gap-5">
                <img src="/farmmerce-20.png" alt="Farmmerce" className="h-10 w-auto object-contain opacity-60 animate-pulse" />
                <div className="flex gap-2">
                    {[0,1,2].map(i => (
                        <div key={i} className="w-2 h-2 bg-brand-dark rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
                <p className="text-brand-dark/40 font-black text-xs uppercase tracking-[0.3em]">Loading dashboard…</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#FAF8F5] font-sans relative">
            {/* QR Modal */}
            {selectedQr && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
                        <div className="p-8 text-center relative">
                            <button onClick={() => setSelectedQr(null)} className="absolute top-6 right-6 text-gray-400 hover:text-brand-dark transition-colors">
                                <X className="w-8 h-8" />
                            </button>

                            <div className="mb-6">
                                <div className="inline-block p-4 bg-brand-light/20 rounded-[2rem] mb-4">
                                    <QrCode className="w-8 h-8 text-brand-dark" />
                                </div>
                                <h3 className="text-2xl font-black text-brand-dark tracking-tight">Product Passport</h3>
                                <p className="text-gray-500 font-medium">Scan to verify farm-to-table journey</p>
                            </div>

                            <div className="flex flex-col items-center gap-8 px-4">
                                <div className="p-6 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 group hover:border-brand-dark transition-colors duration-500">
                                    <QRCodeCanvas
                                        value={`${window.location.origin}/trace/${selectedQr.traceabilityId}`}
                                        size={220}
                                        level="H"
                                        includeMargin={true}
                                        className="rounded-xl"
                                    />
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="p-5 bg-brand-dark rounded-3xl text-left">
                                        <p className="text-[10px] font-black text-brand-light uppercase tracking-widest mb-1">Product Identity</p>
                                        <h4 className="text-white font-bold text-lg">{selectedQr.name}</h4>
                                        <p className="text-gray-400 text-xs mt-1">ID: {selectedQr.traceabilityId}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => window.print()}
                                            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 rounded-2xl font-bold text-brand-dark hover:bg-gray-200 transition-all"
                                        >
                                            <Package size={18} />
                                            Print Label
                                        </button>
                                        <Link
                                            to={`/trace/${selectedQr.traceabilityId}`}
                                            target="_blank"
                                            className="flex items-center justify-center gap-2 px-6 py-4 bg-brand-light text-brand-dark rounded-2xl font-bold hover:bg-brand-dark hover:text-white transition-all"
                                        >
                                            Test Trace
                                        </Link>
                                    </div>
                                </div>

                                {/* Journey Step Quick Add */}
                                <div className="w-full mt-4 pt-6 border-t border-gray-100 text-left">
                                    <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Update Journey</h5>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        const stage = formData.get('stage') as string;
                                        const location = formData.get('location') as string;

                                        fetch(`${API_URL}/products/${selectedQr.id}/journey`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ stage, location })
                                        }).then(res => {
                                            if (res.ok) alert('Journey updated!');
                                        });
                                    }} className="grid grid-cols-2 gap-2">
                                        <input name="stage" placeholder="Stage (e.g. Packed)" className="text-xs p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-dark" required />
                                        <input name="location" placeholder="Location" className="text-xs p-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-brand-dark" required />
                                        <button type="submit" className="col-span-2 py-3 bg-brand-dark text-white rounded-xl font-bold text-xs hover:bg-black transition-all">
                                            Add Journey Milestone
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 md:hidden flex flex-col shadow-2xl"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
                                <Logo variant="dark" className="h-8 w-auto" />
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                                <SidebarContent activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsMobileMenuOpen(false); }} viewMode={viewMode} setViewMode={setViewMode} user={user} />
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col shadow-sm relative overflow-hidden">
                {/* Brand Pattern Background */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none grayscale">
                    <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
                </div>
                
                <div className="h-16 flex items-center px-6 border-b border-gray-100 relative z-10">
                    <Link to="/" className="flex items-center">
                        <Logo variant="dark" className="h-8 w-auto" />
                    </Link>
                </div>
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto relative z-10">
                    <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} viewMode={viewMode} setViewMode={setViewMode} user={user} />
                </nav>
                <div className="p-4 border-t border-gray-100 relative z-10">
                    <UserInfo user={user} />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-gray-400 hover:text-brand-dark md:hidden transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-black text-brand-dark tracking-tighter capitalize leading-none">
                            {activeTab === 'buyer-home' ? 'My Dashboard' : activeTab.replace(/-/g, ' ')}
                        </h1>
                        <div className="hidden sm:flex ml-2 px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black text-gray-500 items-center gap-1.5 uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            {viewMode}
                        </div>
                    </div>
                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => { setIsNotifOpen(!isNotifOpen); }}
                            className="relative p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                        >
                            <Bell className="h-6 w-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {isNotifOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-80 bg-white rounded-[1.5rem] shadow-2xl border border-gray-100 z-50 overflow-hidden"
                                    >
                                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                            <h3 className="font-black text-brand-dark text-sm">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button onClick={markAllRead} className="text-[10px] font-bold text-brand-dark/40 hover:text-brand-dark transition-colors uppercase tracking-widest">
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>
                                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                            {notifications.length === 0 ? (
                                                <div className="py-10 text-center">
                                                    <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                                    <p className="text-xs text-gray-400 font-medium">No notifications yet</p>
                                                </div>
                                            ) : notifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => markRead(n.id)}
                                                    className={`px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-brand-light/10' : ''}`}
                                                >
                                                    <p className={`text-sm font-bold ${!n.read ? 'text-brand-dark' : 'text-gray-500'}`}>{n.title}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{n.body}</p>
                                                    <p className="text-[10px] text-gray-300 mt-1 font-medium">
                                                        {new Date(n.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {activeTab === 'buyer-home' && <BuyerHome setActiveTab={setActiveTab} />}

                    <div className={`p-4 sm:p-6 lg:p-8 ${activeTab === 'buyer-home' ? 'hidden' : ''}`}>
                    {activeTab === 'marketplace' && <MarketplaceView />}
                    {activeTab === 'meal-planner' && <MealPlannerEmbed />}
                    {activeTab === 'promos' && (
                        <div className="space-y-12">
                            <FoodBundleSelector />
                            
                            <div className="space-y-6">
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
                        </div>
                    </div>
                    )}

                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-brand-dark">
                                <dt className="text-sm font-black text-gray-400 uppercase tracking-widest truncate">{viewMode === 'FARMER' ? 'Total Revenue' : 'Total Spent'}</dt>
                                <dd className="text-2xl font-black text-brand-dark mt-1">
                                    ₦{stats ? (viewMode === 'FARMER' ? stats.totalRevenue : stats.totalSpent).toLocaleString() : '...'}
                                </dd>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-brand-mars">
                                <dt className="text-sm font-black text-gray-400 uppercase tracking-widest truncate">{viewMode === 'FARMER' ? 'Pending Orders' : 'Orders Placed'}</dt>
                                <dd className="text-2xl font-black text-brand-dark mt-1">
                                    {stats ? (viewMode === 'FARMER' ? stats.pendingOrders : stats.orderCount) : '...'}
                                </dd>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-brand-light">
                                <dt className="text-sm font-black text-gray-400 uppercase tracking-widest truncate">CO2 Saved (Est.)</dt>
                                <dd className="text-2xl font-black text-brand-dark mt-1">
                                    {stats ? stats.co2Saved.toFixed(1) : '...'} <span className="text-xs font-black uppercase tracking-widest text-gray-400">kg</span>
                                </dd>
                            </div>
                            {viewMode === 'FARMER' && stats?.lowStockCount > 0 && (
                                <div className="bg-brand-red/5 overflow-hidden shadow rounded-lg p-5 border-l-4 border-brand-red">
                                    <dt className="text-sm font-black text-brand-red uppercase tracking-widest truncate flex items-center gap-2">
                                        <Bell className="w-4 h-4" />
                                        Low Stock Alerts
                                    </dt>
                                    <dd className="text-2xl font-bold text-red-700">
                                        {stats.lowStockCount}
                                    </dd>
                                </div>
                            )}
                            <Link to="/meal-planner" className="bg-brand-yellow/10 overflow-hidden shadow rounded-lg p-5 hover:bg-brand-yellow/20 transition-colors border border-brand-yellow/30 group">
                                <dt className="flex items-center gap-2 text-sm font-medium text-brand-dark truncate">
                                    <span className="p-1 bg-brand-yellow/20 rounded-full group-hover:bg-brand-yellow/40 transition-colors">
                                        <ChefHat className="w-4 h-4" />
                                    </span>
                                    Weekly Meal Planner
                                </dt>
                                <dd className="mt-1 text-sm text-gray-600">Smart planning, less waste.</dd>
                            </Link>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="max-w-4xl mx-auto space-y-8">
                            {/* Add Product Section */}
                            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Product</h3>
                                </div>
                                <div className="border-t border-gray-200">
                                    <ProductForm onSubmit={handleCreateProduct} />
                                </div>
                            </div>

                            {/* My Products List */}
                            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">My Listings</h3>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {myProducts.length > 0 ? myProducts.map((product: any) => (
                                        <li key={product.id} className="px-6 py-4 flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                <div className="text-sm text-gray-500">₦{product.price} / {product.unit}</div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedQr(product)}
                                                className="flex items-center text-sm text-primary hover:text-green-800"
                                            >
                                                <QrCode className="w-5 h-5 mr-1" />
                                                View QR
                                            </button>
                                        </li>
                                    )) : (
                                        <li className="px-6 py-4 text-gray-500 text-center">No products listed yet.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Incoming Orders (Sales)</h3>
                            </div>
                            <ul role="list" className="divide-y divide-gray-200">
                                {orders.length > 0 ? orders.map((order: any) => (
                                    <li key={order.id} className="px-6 py-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-lg font-bold text-gray-900">Order #{order.id}</span>
                                            <select
                                                value={order.status}
                                                onChange={(e) => {
                                                    const newStatus = e.target.value;
                                                    // Optimistic update
                                                    const updatedOrders = orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o);
                                                    setOrders(updatedOrders);

                                                    fetch(`${API_URL}/orders/${order.id}/status`, {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ status: newStatus })
                                                    }).catch(err => console.error('Failed to update status', err));
                                                }}
                                                className={`ml-2 text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-indigo-500 ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : order.status === 'READY_FOR_PICKUP' ? 'bg-brand-light/30 text-brand-dark' : 'bg-yellow-100 text-yellow-800'}`}
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="CONFIRMED">CONFIRMED</option>
                                                <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
                                                <option value="SHIPPED">SHIPPED (In Transit)</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                            </select>
                                        </div>
                                        <div className="text-sm text-gray-500 mb-2">Buyer: {order.buyer?.name} ({order.buyer?.email})</div>
                                        {/* Added Shipping Details */}
                                        <div className="text-sm text-gray-700 mb-2 bg-gray-50 p-2 rounded">
                                            <p><strong>Shipping To:</strong> {order.shippingAddress || 'N/A'}</p>
                                            <p><strong>Payment:</strong> {order.paymentMethod === 'cod' ? 'Pay on Delivery' : 'Card'} </p>
                                            {/* Delivery Note Input */}
                                            <div className="mt-2 border-t pt-2">
                                                <label className="block text-xs font-medium text-gray-500">Tracking / Delivery Note:</label>
                                                <input
                                                    type="text"
                                                    defaultValue={order.trackingNote || ''}
                                                    onBlur={(e) => {
                                                        fetch(`${API_URL}/orders/${order.id}/status`, {
                                                            method: 'PUT',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ trackingNote: e.target.value })
                                                        }).catch(err => console.error('Failed to update note', err));
                                                    }}
                                                    placeholder="Add tracking info..."
                                                    className="mt-1 block w-full text-xs border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 border-t border-gray-100 pt-4">
                                            {order.items.map((item: any) => {
                                                const isMine = item.product.farmerId === user.id;
                                                return (
                                                    <div key={item.id} className={`flex justify-between items-center p-3 rounded-2xl border ${isMine ? 'bg-brand-light/5 border-brand-light/20' : 'bg-gray-50/30 border-gray-100'}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${isMine ? 'bg-brand-light text-brand-dark' : 'bg-gray-100 text-gray-400'}`}>
                                                                {item.quantity}x
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-brand-dark">{item.product.name}</p>
                                                                {isMine && <span className="text-[9px] font-black text-brand-mars uppercase tracking-widest">My Product</span>}
                                                            </div>
                                                        </div>
                                                        <span className="font-black text-brand-dark">₦{Number(item.price).toLocaleString()}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-6 flex items-center justify-between bg-gray-50/50 rounded-2xl p-4">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Order Total</p>
                                                <p className="text-xl font-black text-brand-dark">₦{Number(order.totalAmount).toLocaleString()}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                {order.status === 'CONFIRMED' && (
                                                    <button 
                                                        onClick={() => {
                                                            fetch(`${API_URL}/orders/${order.id}/status`, {
                                                                method: 'PUT',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ status: 'READY_FOR_PICKUP' })
                                                            }).then(() => window.location.reload());
                                                        }}
                                                        className="px-6 py-2.5 bg-brand-mars text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-brand-mars/10"
                                                    >
                                                        Mark Ready
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="px-6 py-20 text-center text-gray-400 font-black uppercase tracking-[0.2em] text-xs">No orders received yet.</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'my-orders' && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h1 className="text-2xl font-black text-brand-dark tracking-tight">Purchase History</h1>
                                <span className="px-4 py-1.5 bg-brand-light/20 text-brand-dark rounded-full text-xs font-black uppercase tracking-widest">
                                    {orders.length} Orders
                                </span>
                            </div>

                            <div className="space-y-4">
                                {orders.length > 0 ? orders.map((order: any) => (
                                    <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-dark/20 font-black text-xl">
                                                    📦
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-brand-dark">Order #{order.id}</h3>
                                                    <p className="text-xs text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] rounded-xl border ${
                                                order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-amber-50 text-amber-700 border-amber-100'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        {order.trackingNote && (
                                            <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-2xl mb-4 flex items-center gap-3">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                                <p className="text-xs text-indigo-700 font-bold">
                                                    <span className="opacity-60 font-black uppercase tracking-widest text-[9px] block mb-0.5">Tracking Update</span>
                                                    {order.trackingNote}
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-2 border-t border-gray-50 pt-4">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black">{item.quantity}x</span>
                                                        <span className="font-bold text-brand-dark/70">{item.product.name}</span>
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
                                )) : (
                                    <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-gray-100">
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShoppingCart size={32} className="text-gray-200" />
                                        </div>
                                        <h3 className="text-lg font-black text-brand-dark mb-1">No orders yet</h3>
                                        <p className="text-sm text-gray-400 max-w-xs mx-auto">Start exploring the marketplace to find fresh farm produce today!</p>
                                        <button onClick={() => setActiveTab('marketplace')} className="mt-6 px-8 py-3 bg-brand-light text-brand-dark rounded-2xl font-black text-sm hover:bg-white transition-all shadow-md">
                                            Go Shopping
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'logistics' && (
                        <div className="space-y-8">
                            {/* Available Tasks */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-2xl border border-gray-100">
                                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50/50">
                                    <h3 className="text-lg leading-6 font-bold text-brand-dark flex items-center gap-2">
                                        <Navigation className="w-5 h-5 text-blue-500" />
                                        Available Pickups
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">Orders marked "Ready for Pickup" by farmers</p>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {availableTasks.length > 0 ? availableTasks.map((task: any) => (
                                        <li key={task.id} className="px-6 py-5 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-brand-dark">Order #{task.id}</p>
                                                    <p className="text-xs text-brand-dark/60 mt-1">
                                                        <span className="font-bold">{task.items.length} items</span> • {task.buyer?.address || task.shippingAddress}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        fetch(`${API_URL}/logistics/assign/${task.id}`, {
                                                            method: 'POST',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ agentId: user.id })
                                                        }).then(() => fetchLogisticsTasks());
                                                    }}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-bold rounded-xl shadow-sm text-white bg-brand-dark hover:bg-black transition-all"
                                                >
                                                    Assign to Me
                                                </button>
                                            </div>
                                        </li>
                                    )) : (
                                        <li className="px-6 py-10 text-center">
                                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <Navigation className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium">No new orders waiting for pickup right now.</p>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* My Active Tasks */}
                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        My Deliveries
                                    </h3>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {orders.length > 0 ? orders.map((task: any) => (
                                        <li key={task.id} className="px-6 py-4 bg-gray-50/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold">Order #{task.id}</span>
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => {
                                                        fetch(`${API_URL}/logistics/tasks/${task.id}/status`, {
                                                            method: 'PUT',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ status: e.target.value })
                                                        }).then(() => fetchLogisticsTasks());
                                                    }}
                                                    className="text-xs border-gray-300 rounded-md"
                                                >
                                                    <option value="SHIPPED">IN TRANSIT</option>
                                                    <option value="DELIVERED">DELIVERED</option>
                                                </select>
                                            </div>
                                            <p className="text-sm text-gray-600"><strong>Buyer:</strong> {task.buyer?.name}</p>
                                            <p className="text-sm text-gray-600 mb-2"><strong>Address:</strong> {task.buyer?.address || task.shippingAddress}</p>

                                            <input
                                                type="text"
                                                placeholder="Add delivery note..."
                                                defaultValue={task.trackingNote || ''}
                                                onBlur={(e) => {
                                                    fetch(`${API_URL}/logistics/tasks/${task.id}/status`, {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ trackingNote: e.target.value })
                                                    });
                                                }}
                                                className="mt-1 block w-full text-xs border-gray-300 rounded-md"
                                            />
                                        </li>
                                    )) : (
                                        <li className="px-6 py-4 text-center text-gray-500 text-sm">No active deliveries assigned.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="max-w-4xl mx-auto">
                            <ProfileForm />
                        </div>
                    )}

                    {activeTab === 'admin-stats' && adminStats && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Platform Users</p>
                                    <h4 className="text-3xl font-black text-brand-dark">{adminStats.userCount}</h4>
                                    <p className="text-[10px] text-green-600 font-bold mt-2">Active growing community</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Onboarded Farmers</p>
                                    <h4 className="text-3xl font-black text-brand-dark">{adminStats.farmerCount}</h4>
                                    <p className="text-[10px] text-brand-dark/60 font-medium mt-2">Supplying fresh produce</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Transaction Value</p>
                                    <h4 className="text-3xl font-black text-brand-dark">₦{adminStats.totalRevenue.toLocaleString()}</h4>
                                    <p className="text-[10px] text-blue-600 font-bold mt-2">Empowering local economy</p>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Platform Impact</p>
                                    <h4 className="text-3xl font-black text-green-600">{adminStats.totalCo2Saved.toFixed(1)}kg</h4>
                                    <p className="text-[10px] text-green-600/60 font-medium mt-2">CO2 emissions avoided</p>
                                </div>
                            </div>

                            <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2.5rem]">
                                <h3 className="text-xl font-bold text-indigo-900 mb-2">Platform System Health</h3>
                                <p className="text-indigo-700/70 text-sm">All microservices operational. Database connected to SQLite Main. API cluster active.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'admin-users' && (
                        <div className="bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-gray-100">
                            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-xl font-black text-brand-dark tracking-tight">User Directory</h3>
                                <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-500">{allUsers.length} Users Found</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">User Details</th>
                                            <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Current Role</th>
                                            <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {allUsers.map((u: any) => (
                                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-brand-light/20 rounded-xl flex items-center justify-center text-brand-dark font-black">
                                                            {u.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-brand-dark">{u.name}</p>
                                                            <p className="text-xs text-gray-400">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' :
                                                        u.role === 'FARMER' ? 'bg-green-100 text-green-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => {
                                                                const newRole = e.target.value;
                                                                api.put(`/admin/users/${u.id}/role`, { role: newRole })
                                                                    .then(() => {
                                                                        setAllUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: newRole } : usr));
                                                                    });
                                                            }}
                                                            className="text-xs font-bold bg-white border-gray-200 rounded-xl focus:ring-brand-dark"
                                                        >
                                                            <option value="BUYER">Promote to Buyer</option>
                                                            <option value="FARMER">Promote to Farmer</option>
                                                            <option value="ADMIN">Promote to Admin</option>
                                                        </select>
                                                        <button
                                                            onClick={() => {
                                                                api.get(`/users/${u.id}`)
                                                                    .then(res => res.json())
                                                                    .then(data => setSelectedAdminUser(data))
                                                                    .catch(console.error);
                                                            }}
                                                            className="px-4 py-2 bg-brand-light/10 text-brand-dark rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all shadow-sm"
                                                        >
                                                            View Profile
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedAdminUser && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm">
                            <div className="bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl relative">
                                <button onClick={() => setSelectedAdminUser(null)} className="absolute top-6 right-6 p-2 bg-gray-100/50 rounded-full hover:bg-gray-200 transition-colors">
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-brand-light/20 rounded-[1.5rem] flex items-center justify-center text-brand-dark font-black text-2xl">
                                        {selectedAdminUser.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-brand-dark">{selectedAdminUser.name}</h3>
                                        <p className="text-sm font-medium text-gray-500">{selectedAdminUser.email}</p>
                                        <span className="px-3 py-1 mt-2 inline-block rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-700">
                                            {selectedAdminUser.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Contact Information</p>
                                        <div className="space-y-2">
                                            <p className="font-bold text-sm text-brand-dark flex items-center justify-between"><span className="text-gray-500">Phone</span> {selectedAdminUser.phone || 'Not Provided'}</p>
                                            <p className="font-bold text-sm text-brand-dark flex items-center justify-between"><span className="text-gray-500">Address</span> {selectedAdminUser.address || 'Not Provided'}</p>
                                            <p className="font-bold text-sm text-brand-dark flex items-center justify-between"><span className="text-gray-500">Joined</span> {new Date(selectedAdminUser.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {selectedAdminUser.role === 'FARMER' && selectedAdminUser.profile && (
                                        <div className="bg-green-50/50 p-5 rounded-3xl border border-green-100">
                                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Sprout className="w-3 h-3" /> Farmer Profile
                                            </p>
                                            <div className="space-y-2">
                                                <p className="font-bold text-sm text-brand-dark flex items-center justify-between"><span className="text-green-700/60">Farm Name</span> {selectedAdminUser.profile.farmName || 'N/A'}</p>
                                                <p className="font-bold text-sm text-brand-dark flex items-center justify-between"><span className="text-green-700/60">Location</span> {selectedAdminUser.profile.location || 'N/A'}</p>
                                            </div>
                                            {selectedAdminUser.profile.bio && (
                                                <div className="mt-4 pt-4 border-t border-green-100">
                                                    <p className="text-xs font-medium text-brand-dark leading-relaxed italic">"{selectedAdminUser.profile.bio}"</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'admin-orders' && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-black text-brand-dark px-2">Monitor Platform Sales</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {allOrders.map((o: any) => (
                                    <div key={o.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-brand-light/10 rounded-2xl flex flex-col items-center justify-center border border-brand-light/20">
                                                <ShoppingBag className="w-6 h-6 text-brand-dark" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-black text-brand-dark">Order #{o.id}</p>
                                                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full font-bold text-gray-500">{o.status}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Placed by <span className="font-bold text-brand-dark">{o.buyer.name}</span> • {new Date(o.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-brand-dark">₦{Number(o.totalAmount).toLocaleString()}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{o.items.length} Products</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'admin-categories' && (
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                                <h3 className="text-xl font-black text-brand-dark mb-6">Manage Product Categories</h3>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const name = (e.currentTarget.elements.namedItem('catName') as HTMLInputElement).value;
                                    fetch(`${API_URL}/categories`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ name })
                                    }).then(res => res.json()).then(cat => setAllCategories([...allCategories, cat]));
                                    (e.currentTarget.elements.namedItem('catName') as HTMLInputElement).value = '';
                                }} className="flex gap-2">
                                    <input name="catName" placeholder="New category name..." className="flex-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm font-bold" required />
                                    <button type="submit" className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-bold hover:bg-black transition-all">Add Category</button>
                                </form>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {allCategories.map(cat => (
                                    <div key={cat.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between group">
                                        <span className="font-bold text-brand-dark">{cat.name}</span>
                                        <button onClick={() => {
                                            fetch(`${API_URL}/categories/${cat.id}`, { method: 'DELETE' })
                                                .then(() => setAllCategories(allCategories.filter(c => c.id !== cat.id)));
                                        }} className="p-2 text-red-400 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'admin-recipes' && (
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-brand-dark mb-6 tracking-tight">Add New Platform Recipe</h3>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const ingredientsStr = formData.get('ingredients') as string;
                                    const ingredients = ingredientsStr.split('\n').map(line => {
                                        const [name, keyword, qty] = line.split(',');
                                        return { name: name.trim(), productKeyword: keyword?.trim(), quantity: parseInt(qty) };
                                    });

                                    fetch(`${API_URL}/recipes`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            title: formData.get('title'),
                                            description: formData.get('description'),
                                            instructions: formData.get('instructions'),
                                            imageUrl: formData.get('imageUrl'),
                                            servings: Number(formData.get('servings')),
                                            mealType: formData.get('mealType'),
                                            ingredients
                                        })
                                    }).then(res => res.json()).then(recipe => {
                                        setAllRecipes([recipe, ...allRecipes]);
                                        (e.target as HTMLFormElement).reset();
                                        alert('Recipe added to platform!');
                                    });
                                }} className="space-y-4">
                                    <input name="title" placeholder="Recipe Title" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm font-bold" required />
                                    <div className="flex gap-4">
                                        <input name="servings" type="number" min="1" placeholder="Servings (e.g. 4)" className="flex-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm font-bold" required />
                                        <select name="mealType" className="flex-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm font-bold" required>
                                            <option value="BREAKFAST">Breakfast</option>
                                            <option value="LUNCH">Lunch</option>
                                            <option value="DINNER">Dinner</option>
                                        </select>
                                    </div>
                                    <textarea name="description" placeholder="Short description..." className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm" />
                                    <textarea name="instructions" placeholder="Step by step instructions..." className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm" />
                                    <input name="imageUrl" placeholder="Image URL" className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm" />

                                    <div className="p-6 bg-brand-light/10 rounded-3xl border border-brand-light/30">
                                        <label className="text-xs font-black text-brand-dark uppercase tracking-widest mb-2 block">Ingredients (Comma separated per line)</label>
                                        <textarea
                                            name="ingredients"
                                            rows={4}
                                            placeholder="Fresh Tomatoes, tomato, 3&#10;Basil Bunch, basil, 1"
                                            className="w-full p-4 bg-white/50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-xs font-mono"
                                            required
                                        />
                                        <p className="text-[10px] text-brand-dark/60 mt-2">Format: Name, Product Keyword, Quantity</p>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-brand-dark text-white rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-brand-dark/20">Publish Platform Recipe</button>
                                </form>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {allRecipes.map((r: any) => (
                                    <div key={r.id} className="bg-white p-6 rounded-[2rem] shadow-lg border border-gray-50">
                                        <img src={r.imageUrl} alt={r.title} className="w-full h-40 object-cover rounded-2xl mb-4" />
                                        <h4 className="font-black text-brand-dark">{r.title}</h4>
                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{r.description}</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {r.ingredients?.map((ing: any, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600">{ing.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'admin-settlements' && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-2xl font-black text-brand-dark tracking-tight">Settlement Management</h3>
                                <div className="flex gap-2">
                                    <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-2xl text-xs font-bold border border-yellow-200">
                                        {pendingSettlements.length} Pending Farmers
                                    </span>
                                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-2xl text-xs font-bold border border-green-200">
                                        Settlement History Active
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white shadow-xl rounded-[2.5rem] overflow-hidden border border-gray-100">
                                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-yellow-50/30">
                                    <div>
                                        <h4 className="text-lg font-black text-brand-dark">Pending Payouts</h4>
                                        <p className="text-xs text-gray-500 font-medium italic">Farmers with delivered items awaiting settlement (10% platform fee deducted)</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Farmer</th>
                                                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Bank Details</th>
                                                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Gross Sales</th>
                                                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Net Payable</th>
                                                <th className="px-8 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {pendingSettlements.map((p: any) => (
                                                <tr key={p.farmerId} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6 font-bold text-brand-dark">{p.farmerName}</td>
                                                    <td className="px-8 py-6">
                                                        {p.bankDetails ? (
                                                            <div className="text-xs">
                                                                <p className="font-bold">{p.bankDetails.bankName}</p>
                                                                <p className="text-gray-500">{p.bankDetails.accountNumber}</p>
                                                            </div>
                                                        ) : <span className="text-xs text-red-400 font-bold">Incomplete</span>}
                                                    </td>
                                                    <td className="px-8 py-6 font-medium">₦{Number(p.totalAmount).toLocaleString()}</td>
                                                    <td className="px-8 py-6">
                                                        <span className="text-lg font-black text-green-600">₦{Number(p.netAmount).toLocaleString()}</span>
                                                        <p className="text-[10px] text-gray-400">Commission: ₦{Number(p.commission).toLocaleString()}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <button
                                                            onClick={() => {
                                                                const reference = `SET-${Date.now()}`;
                                                                if (!confirm(`Settle ₦${p.netAmount.toLocaleString()} to ${p.farmerName}?`)) return;

                                                                fetch(`${API_URL}/settlements`, {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({
                                                                        farmerId: p.farmerId,
                                                                        itemIds: p.items.map((i: any) => i.id),
                                                                        amount: p.totalAmount,
                                                                        commission: p.commission,
                                                                        netAmount: p.netAmount,
                                                                        reference
                                                                    })
                                                                }).then(() => {
                                                                    alert('Settlement processed!');
                                                                    window.location.reload();
                                                                });
                                                            }}
                                                            className="px-6 py-2 bg-brand-dark text-white rounded-xl font-bold text-xs hover:bg-black transition-all shadow-md active:scale-95"
                                                        >
                                                            Process Payout
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {pendingSettlements.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-10 text-center text-gray-500 font-medium">No pending payouts at this time.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-white shadow-xl rounded-[2.5rem] border border-gray-100 overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                                    <h4 className="text-lg font-black text-brand-dark">Settlement Record History</h4>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {allSettlements.map((s: any) => (
                                        <div key={s.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${s.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    S
                                                </div>
                                                <div>
                                                    <p className="font-bold text-brand-dark">{s.farmer?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{s.reference || 'No Reference'}</p>
                                                </div>
                                            </div>
                                            <div className="text-center px-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${s.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-brand-light/30 text-brand-dark'}`}>
                                                    {s.status}
                                                </span>
                                                <p className="text-[10px] text-gray-400 mt-1">{new Date(s.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-brand-dark">₦{Number(s.netAmount).toLocaleString()}</p>
                                                {s.status !== 'COMPLETED' && (
                                                    <button
                                                        onClick={() => {
                                                            fetch(`${API_URL}/settlements/${s.id}/status`, {
                                                                method: 'PATCH',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ status: 'COMPLETED', settlementDate: new Date() })
                                                            }).then(() => {
                                                                alert('Status updated to Completed');
                                                                window.location.reload();
                                                            });
                                                        }}
                                                        className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
                                                    > Mark Paid </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settlements' && (
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-2xl font-black text-brand-dark tracking-tight">Financial Overview</h3>
                                <div className="flex gap-2">
                                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-2xl text-xs font-bold border border-green-200">
                                        Active Payout Account
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Earned (Net)</p>
                                    <h4 className="text-3xl font-black text-brand-dark">₦{allSettlements.filter(s => s.farmerId === user.id).reduce((acc, s) => acc + Number(s.netAmount), 0).toLocaleString()}</h4>
                                </div>
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Platform Fees Paid</p>
                                    <h4 className="text-3xl font-black text-red-600">₦{allSettlements.filter(s => s.farmerId === user.id).reduce((acc, s) => acc + Number(s.commission), 0).toLocaleString()}</h4>
                                </div>
                            </div>

                            <div className="bg-white shadow-xl rounded-[2.5rem] border border-gray-100 overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-100">
                                    <h4 className="text-lg font-black text-brand-dark">Payout History</h4>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {allSettlements.filter(s => s.farmerId === user.id).length > 0 ? allSettlements.filter(s => s.farmerId === user.id).map((s: any) => (
                                        <div key={s.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-all group-hover:scale-110 ${s.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-brand-light/20 text-brand-dark'}`}>
                                                    💸
                                                </div>
                                                <div>
                                                    <p className="font-black text-brand-dark flex items-center gap-2">
                                                        Payout #{s.id}
                                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${s.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                            {s.status}
                                                        </span>
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Ref: {s.reference}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium mt-1 italic">Issued {new Date(s.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-brand-dark">₦{Number(s.netAmount).toLocaleString()}</p>
                                                <div className="flex items-center justify-end gap-2 mt-1">
                                                    <span className="text-[10px] text-gray-400 font-bold">Gross: ₦{Number(s.amount).toLocaleString()}</span>
                                                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                                                    <span className="text-[10px] text-red-400 font-black opacity-60">Fee: -10%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-20 text-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                                                <Navigation size={32} />
                                            </div>
                                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No payout history found.</p>
                                            <p className="text-[10px] text-gray-500 mt-1">Your earnings will appear here once orders are delivered.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'group-deals' && (
                        <div className="space-y-12">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                                <div>
                                    <h3 className="text-3xl font-black text-brand-dark tracking-tight">Group Deal Hub</h3>
                                    <p className="text-brand-dark/50 font-medium">Create and manage your collective selling campaigns</p>
                                </div>
                            </div>

                            {/* Seasonal Panel Toggle */}
                            <div className={`flex items-center justify-between p-6 rounded-[2rem] border-2 ${panelEnabled ? 'bg-brand-dark border-brand-light/30' : 'bg-gray-50 border-gray-200'} transition-all duration-300`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${panelEnabled ? 'bg-brand-light/20 text-brand-light' : 'bg-gray-200 text-gray-400'}`}>
                                        🛒
                                    </div>
                                    <div>
                                        <p className={`font-black text-sm ${panelEnabled ? 'text-white' : 'text-brand-dark'}`}>Floating Group Buy Panel</p>
                                        <p className={`text-xs font-medium ${panelEnabled ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {panelEnabled ? '🟢 Currently visible on the landing page' : '⚪ Hidden — enable to show seasonal group buy deals'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const newState = !panelEnabled;
                                        api.patch('/group-deals/panel-enabled', { enabled: newState })
                                            .then(res => res.json())
                                            .then(data => setPanelEnabled(data.enabled));
                                    }}
                                    className={`px-6 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg ${panelEnabled
                                        ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white'
                                        : 'bg-brand-light text-brand-dark hover:bg-white'
                                        }`}
                                >
                                    {panelEnabled ? 'Disable Panel' : 'Enable Panel'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-brand-dark/5 border border-brand-dark/5">
                                    <h4 className="text-xl font-black text-brand-dark mb-8 uppercase tracking-widest text-xs opacity-50">Setup Active Deal</h4>
                                    <form className="space-y-6" onSubmit={(e: any) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target);
                                        const dealData = Object.fromEntries(formData.entries());
                                        fetch(`${API_URL}/group-deals`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                ...dealData,
                                                farmerId: user.id,
                                                originalPrice: Number(dealData.originalPrice),
                                                discountPrice: Number(dealData.discountPrice),
                                                minParticipants: Number(dealData.minParticipants),
                                                durationHours: Number(dealData.durationHours)
                                            })
                                        }).then(res => {
                                            if (res.ok) {
                                                alert('Group Deal launched successfully!');
                                                window.location.reload();
                                            } else {
                                                alert('Failed to launch deal');
                                            }
                                        });
                                    }}>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Target Product</label>
                                            <select name="productId" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light rounded-2xl font-bold transition-all outline-none" required>
                                                <option value="">Select a product...</option>
                                                {myProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Title</label>
                                                <input name="title" type="text" placeholder="e.g. Weekend Tomato Sale" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light rounded-2xl font-bold transition-all outline-none" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Duration (Hours)</label>
                                                <input name="durationHours" type="number" placeholder="24" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light rounded-2xl font-bold transition-all outline-none" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Normal Price</label>
                                                <input name="originalPrice" type="number" placeholder="1500" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light rounded-2xl font-bold transition-all outline-none" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Deal Price</label>
                                                <input name="discountPrice" type="number" placeholder="1000" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light rounded-2xl font-bold transition-all outline-none" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Min People</label>
                                                <input name="minParticipants" type="number" placeholder="5" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light rounded-2xl font-bold transition-all outline-none" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest pl-1">Description</label>
                                            <textarea name="description" placeholder="Short pitch for the deal..." className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-light rounded-2xl font-bold transition-all outline-none h-32 resize-none" required />
                                        </div>
                                        <button type="submit" className="w-full py-5 bg-brand-light text-brand-dark rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white transition-all shadow-lg shadow-brand-light/10 active:scale-95">
                                            Launch Campaign
                                        </button>
                                    </form>
                                </div>

                                <div className="space-y-6">
                                    <h4 className="text-xl font-black text-brand-dark px-2 uppercase tracking-widest text-xs opacity-50">Active Campaigns</h4>
                                    <div className="bg-brand-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/10 rounded-full blur-3xl -mr-16 -mt-16" />
                                        <div className="space-y-6 relative z-10">
                                            {allDeals.map(d => (
                                                <div key={d.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <p className="font-bold text-lg">{d.title}</p>
                                                            <p className="text-[10px] text-white/40 uppercase tracking-widest">Farmer: {d.product?.farmer?.name || 'Unknown'}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-1 bg-brand-mars text-[8px] font-black rounded uppercase">Live</span>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to deactivate this deal?')) {
                                                                        fetch(`${API_URL}/group-deals/${d.id}/deactivate`, { method: 'PATCH' })
                                                                            .then(() => window.location.reload());
                                                                    }
                                                                }}
                                                                className="px-2 py-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[8px] font-black rounded uppercase"
                                                            >
                                                                Deactivate
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="text-[10px] text-white/40 font-black uppercase">Members</p>
                                                            <p className="text-xl font-black text-brand-light">{d.groups?.[0]?.members?.length || 0} / {d.minParticipants}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] text-white/40 font-black uppercase">Expires</p>
                                                            <p className="text-xs font-bold text-brand-yellow">Active</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {allDeals.length === 0 && (
                                                <div className="py-20 text-center opacity-30">
                                                    <Users className="mx-auto mb-4" size={48} />
                                                    <p className="text-sm font-bold">No deals live yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'admin-bundles' && (
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-brand-dark mb-6 tracking-tight">Create New Promotion Bundle</h3>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        let itemsArray = [];
                                        try { itemsArray = JSON.parse(bundleForm.items); } catch(err) { alert('Items must be valid JSON array.'); return; }
                                        const res = await fetch(`${API_URL}/bundles`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ ...bundleForm, items: itemsArray })
                                        });
                                        if (res.ok) {
                                            const newBundle = await res.json();
                                            setAllBundles([...allBundles, newBundle]);
                                            setBundleForm({ name: '', familySize: '', price: '', savings: '', color: 'from-blue-500 to-indigo-600', badge: '', imageUrl: '', items: '[]' });
                                            alert("Bundle created successfully!");
                                        } else alert('Failed to create bundle');
                                    } catch(e) { console.error(e); }
                                }} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input placeholder="Bundle Name (e.g. Student Pack)" value={bundleForm.name} onChange={e => setBundleForm({...bundleForm, name: e.target.value})} className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm font-bold font-sans" required />
                                        <input placeholder="Family Size (e.g. 1-2 Persons)" value={bundleForm.familySize} onChange={e => setBundleForm({...bundleForm, familySize: e.target.value})} className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm font-bold font-sans" required />
                                        <input type="number" placeholder="Price (₦)" value={bundleForm.price} onChange={e => setBundleForm({...bundleForm, price: e.target.value})} className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm font-bold font-sans" required />
                                        <input placeholder="Savings Text (e.g. Save 15%)" value={bundleForm.savings} onChange={e => setBundleForm({...bundleForm, savings: e.target.value})} className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm font-bold font-sans" />
                                        <input placeholder="Badge Class (e.g. bg-brand-yellow text-white)" value={bundleForm.badge} onChange={e => setBundleForm({...bundleForm, badge: e.target.value})} className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm font-bold font-sans" />
                                        <select value={bundleForm.color} onChange={e => setBundleForm({...bundleForm, color: e.target.value})} className="p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-sm font-bold font-sans" required>
                                            <option value="from-blue-500 to-indigo-600">Blue-Indigo Gradient</option>
                                            <option value="from-emerald-400 to-green-600">Emerald-Green Gradient</option>
                                            <option value="from-orange-400 to-red-500">Orange-Red Gradient</option>
                                            <option value="from-purple-500 to-pink-500">Purple-Pink Gradient</option>
                                        </select>
                                    </div>
                                    <div className="p-4 bg-brand-light/10 rounded-2xl border border-brand-light/20">
                                        <label className="text-[10px] font-black text-brand-dark uppercase tracking-widest mb-2 block">Items JSON Payload</label>
                                        <textarea rows={2} value={bundleForm.items} onChange={e => setBundleForm({...bundleForm, items: e.target.value})} className="w-full p-4 bg-white/50 rounded-2xl border-none focus:ring-2 focus:ring-brand-dark text-xs font-mono font-bold" required />
                                        <p className="text-[10px] text-gray-500 mt-1">Example: <code className="font-bold">[{'{"name":"Rice","qty":"2kg","keyword":"rice"}'}]</code></p>
                                    </div>
                                    <button type="submit" className="w-full py-5 bg-brand-dark text-white rounded-2xl font-black tracking-widest uppercase hover:bg-black transition-all shadow-xl shadow-brand-dark/20 text-sm">Create Platform Bundle</button>
                                </form>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                                <h3 className="text-2xl font-black text-brand-dark mb-6 tracking-tight">Active Bundles</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {allBundles.map(bundle => (
                                        <div key={bundle.id} className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex flex-col justify-between items-start gap-4 hover:shadow-lg transition-all relative group">
                                            <button onClick={async () => {
                                                if(!confirm('Delete this bundle?')) return;
                                                const res = await fetch(`${API_URL}/bundles/${bundle.id}`, { method: 'DELETE' });
                                                if(res.ok) setAllBundles(allBundles.filter(b => b.id !== bundle.id));
                                            }} className="absolute top-4 right-4 p-2 bg-red-100 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white shadow-sm z-10">
                                                <X size={16} strokeWidth={3} />
                                            </button>
                                            <div className="flex gap-4 items-center w-full pr-8">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br ${bundle.color} shrink-0`}>
                                                    <Package size={24} />
                                                </div>
                                                <div className="truncate w-full">
                                                    <p className="font-bold text-brand-dark text-lg truncate w-full">{bundle.name}</p>
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black truncate">{bundle.familySize}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between w-full items-center mt-2 pt-4 border-t border-gray-200">
                                                <p className="text-2xl font-black text-brand-dark">₦{bundle.price}</p>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${bundle.badge}`}>{bundle.savings}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {allBundles.length === 0 && (
                                    <div className="text-center py-10 opacity-50">
                                        <Package className="mx-auto mb-4" size={48} />
                                        <p className="text-sm font-bold uppercase tracking-widest">No active bundles</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'admin-farmer-requests' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div>
                                    <h3 className="text-2xl font-black text-brand-dark tracking-tight">Farmer Onboarding</h3>
                                    <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">Vet new partnership applications</p>
                                </div>
                                <span className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-200">
                                    {pendingApplications.length} Pending
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {pendingApplications.map((app: any) => (
                                    <motion.div 
                                        key={app.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col md:flex-row"
                                    >
                                        <div className="p-8 md:w-1/3 bg-gray-50/50 border-r border-gray-100">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-16 h-16 bg-brand-light/30 rounded-[1.5rem] flex items-center justify-center text-brand-dark font-black text-2xl">
                                                    {app.name[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-brand-dark leading-none">{app.name}</h4>
                                                    <p className="text-xs text-gray-400 mt-1">{app.email}</p>
                                                    <p className="text-[10px] text-brand-dark font-black uppercase mt-2 px-2 py-0.5 bg-brand-light/20 rounded inline-block">Current: {app.role}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                                                    <MapPin size={14} className="text-brand-mars" />
                                                    {app.profile?.location || 'Location missing'}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                                                    <Clock size={14} className="text-indigo-400" />
                                                    Joined {new Date(app.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Sprout size={18} className="text-brand-green" />
                                                    <h5 className="text-sm font-black text-brand-dark uppercase tracking-widest">Farm Details</h5>
                                                </div>
                                                <div className="bg-brand-light/5 p-6 rounded-3xl border border-brand-light/10 mb-6">
                                                    <p className="text-lg font-black text-brand-dark mb-2">"{app.profile?.farmName || 'Unnamed Farm'}"</p>
                                                    <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                                                        {app.profile?.bio || 'No bio provided for this application.'}
                                                    </p>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Bank</p>
                                                        <p className="text-xs font-bold text-brand-dark">{app.profile?.bankName || 'N/A'}</p>
                                                    </div>
                                                    <div className="px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100">
                                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Account</p>
                                                        <p className="text-xs font-bold text-brand-dark">{app.profile?.accountNumber || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => {
                                                        if(confirm(`Approve ${app.name} as a Farmer?`)) {
                                                            api.post(`/admin/applications/${app.id}/approve`, {})
                                                                .then(() => {
                                                                    setPendingApplications(prev => prev.filter(a => a.id !== app.id));
                                                                    alert('Farmer approved!');
                                                                });
                                                        }
                                                    }}
                                                    className="flex-1 py-4 bg-brand-dark text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-brand-dark/10 active:scale-95"
                                                >
                                                    Approve Partner
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if(confirm(`Reject application for ${app.name}?`)) {
                                                            api.post(`/admin/applications/${app.id}/reject`, {})
                                                                .then(() => {
                                                                    setPendingApplications(prev => prev.filter(a => a.id !== app.id));
                                                                    alert('Application rejected.');
                                                                });
                                                        }
                                                    }}
                                                    className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {pendingApplications.length === 0 && (
                                    <div className="py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                            <CheckCircle size={32} />
                                        </div>
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">All caught up!</p>
                                        <p className="text-xs font-medium text-gray-500 mt-1">No pending farmer applications at the moment.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    </div>
                </main>

                {/* ── MOBILE BOTTOM NAV (BUYER ONLY) ── */}
                {(user?.role === 'BUYER' || viewMode === 'BUYER') && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 px-6 py-3 flex items-center justify-around z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:hidden">
                        {[
                            { label: 'Home',    icon: Home,      tab: 'buyer-home' },
                            { label: 'Market',  icon: ShoppingBag, tab: 'marketplace' },
                            { label: 'Orders',  icon: Clock,       tab: 'my-orders' },
                            { label: 'Meal',    icon: ChefHat,     tab: 'meal-planner' },
                            { label: 'Profile', icon: User,        tab: 'profile' },
                        ].map(({ label, icon: Icon, tab }) => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`flex flex-col items-center gap-1 transition-all ${activeTab === tab ? 'text-brand-dark' : 'text-gray-400'}`}>
                                <Icon size={20} className={activeTab === tab ? 'scale-110' : ''} />
                                <span className={`text-[8px] font-black uppercase tracking-widest ${activeTab === tab ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
                                {activeTab === tab && <motion.div layoutId="bubble" className="absolute -top-1 w-1 h-1 bg-brand-dark rounded-full" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function SidebarContent({ activeTab, setActiveTab, viewMode, setViewMode, user }: { activeTab: string, setActiveTab: (tab: string) => void, viewMode: string, setViewMode: (mode: string) => void, user: any }) {
    const adminSection = user?.role === 'ADMIN' ? (
        <div className="pt-6 pb-2">
            <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Platform Admin</p>
            <div className="space-y-1">
                <button onClick={() => setActiveTab('admin-stats')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'admin-stats' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Overview
                </button>
                <button onClick={() => setActiveTab('admin-users')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'admin-users' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <User className="mr-3 h-5 w-5" />
                    Users
                </button>
                <button onClick={() => setActiveTab('admin-orders')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'admin-orders' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <ShoppingBag className="mr-3 h-5 w-5" />
                    All Orders
                </button>
                <button onClick={() => setActiveTab('admin-categories')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'admin-categories' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <Filter className="mr-3 h-5 w-5" />
                    Categories
                </button>
                <button onClick={() => setActiveTab('admin-recipes')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'admin-recipes' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <ChefHat className="mr-3 h-5 w-5" />
                    Recipes
                </button>
                <button onClick={() => setActiveTab('admin-settlements')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'admin-settlements' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <Navigation className="mr-3 h-5 w-5" />
                    Settlements
                </button>
                <button onClick={() => setActiveTab('group-deals')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'group-deals' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <Users className="mr-3 h-5 w-5" />
                    Group Deals
                </button>
                <button onClick={() => setActiveTab('admin-bundles')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'admin-bundles' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <Package className="mr-3 h-5 w-5" />
                    Food Bundles
                </button>
                <button onClick={() => setActiveTab('admin-farmer-requests')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'admin-farmer-requests' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-105' : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'}`}>
                    <Sprout className="mr-3 h-5 w-5" />
                    Farmer Requests
                </button>
            </div>
        </div>
    ) : null;

    if (viewMode === 'BUYER') {
        return (
            <>
                <Link to="/" className="w-full flex items-center px-3 py-2.5 text-xs font-black rounded-2xl text-brand-dark/50 hover:bg-gray-50 transition-all mb-2 uppercase tracking-widest">
                    <Home className="mr-3 h-4 w-4" />
                    Back to Site
                </Link>

                {user?.role === 'FARMER' && (
                    <button
                        onClick={() => {
                            setViewMode('FARMER');
                            setActiveTab('dashboard');
                        }}
                        className="w-full flex items-center px-3 py-3 text-xs font-black rounded-2xl text-white bg-brand-dark hover:bg-black transition-all mb-4 uppercase tracking-widest"
                    >
                        <Sprout className="mr-3 h-4 w-4 text-brand-light" />
                        Switch to Farmer Mode
                    </button>
                )}

                <p className="px-3 text-[9px] font-black text-gray-300 uppercase tracking-widest mb-2">Shop</p>

                <button onClick={() => setActiveTab('buyer-home')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full transition-all mb-1 ${activeTab === 'buyer-home' ? 'bg-brand-dark text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Home
                </button>
                <button onClick={() => setActiveTab('marketplace')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full transition-all mb-1 ${activeTab === 'marketplace' ? 'bg-brand-dark text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <ShoppingBag className="mr-3 h-5 w-5" />
                    Marketplace
                </button>
                <button onClick={() => setActiveTab('my-orders')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full transition-all mb-1 ${activeTab === 'my-orders' ? 'bg-brand-dark text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    My Orders
                </button>
                <button onClick={() => setActiveTab('meal-planner')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full transition-all mb-1 ${activeTab === 'meal-planner' ? 'bg-brand-dark text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <ChefHat className="mr-3 h-5 w-5" />
                    Meal Planner
                </button>
                <div className="pt-4 border-t border-gray-100 mt-4">
                    <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full transition-all ${activeTab === 'profile' ? 'bg-brand-dark text-white shadow-xl scale-105' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <User className="mr-3 h-5 w-5" />
                        Profile
                    </button>
                </div>
                {adminSection}
            </>
        );
    }

    return (
        <>
            <Link to="/" className="w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl text-brand-dark bg-brand-light/20 hover:bg-brand-light/40 transition-all mb-4">
                <Home className="mr-3 h-5 w-5" />
                Back to Site
            </Link>

            {user?.role === 'FARMER' && (
                <button
                    onClick={() => {
                        setViewMode('BUYER');
                        setActiveTab('marketplace');
                    }}
                    className="w-full flex items-center px-3 py-3 text-xs font-black rounded-2xl text-brand-dark bg-brand-light hover:bg-white transition-all mb-6 uppercase tracking-widest"
                >
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    Buyer Mode
                </button>
            )}

            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'dashboard' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
            </button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'products' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                <Package className="mr-3 h-5 w-5" />
                My Products
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'orders' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                <ShoppingBag className="mr-3 h-5 w-5" />
                Incoming Orders
            </button>
            {user?.role === 'DELIVERY' && (
                <button onClick={() => setActiveTab('logistics')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'logistics' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <Truck className="mr-3 h-5 w-5" />
                    Logistics
                </button>
            )}
            <button onClick={() => setActiveTab('my-orders')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'my-orders' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                <ShoppingCart className="mr-3 h-5 w-5" />
                My Orders
            </button>
            {user?.role === 'FARMER' && (
                <button onClick={() => setActiveTab('settlements')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'settlements' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <Navigation className="mr-3 h-5 w-5" />
                    My Settlements
                </button>
            )}
            {adminSection}
            <div className="pt-6">
                <Link to="/meal-planner" className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 text-gray-500 hover:bg-gray-100 hover:text-brand-dark`}>
                    <ChefHat className="mr-3 h-5 w-5" />
                    Meal Planner
                </Link>
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-4 py-3.5 text-sm font-black tracking-tight rounded-full group transition-all mb-1 ${activeTab === 'profile' ? 'bg-[#0F8B4F] text-white shadow-xl shadow-[#0F8B4F]/20 scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-brand-dark'}`}>
                    <User className="mr-3 h-5 w-5" />
                    Profile
                </button>
            </div>
        </>
    );
}

function UserInfo({ user }: { user: any }) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-2xl bg-brand-light/20 flex items-center justify-center text-brand-dark font-black">
                    {user?.name?.[0] || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{user?.role || 'Member'}</p>
                </div>
            </div>
            <button
                onClick={() => {
                    localStorage.removeItem('fammerce_user');
                    window.location.href = '/login';
                }}
                className="w-full flex items-center justify-center px-4 py-3 border border-red-100 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
            >
                Sign out
            </button>
        </div>
    );
}
