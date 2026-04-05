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
    Sprout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductForm from '../components/ProductForm';
import ProfileForm from '../components/ProfileForm';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import MarketplaceView from '../components/MarketplaceView';
import BuyerHome from '../components/BuyerHome';
import { QRCodeCanvas } from 'qrcode.react';
import { API_URL } from '../config';
import { api } from '../api';


export default function Dashboard() {
    const { user, isAuthenticated, loading } = useAuth();
    const [viewMode, setViewMode] = useState<any>(user?.role === 'FARMER' ? 'FARMER' : 'BUYER');
    const [activeTab, setActiveTab] = useState(user?.role === 'FARMER' ? 'dashboard' : 'buyer-home');
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
    const [panelEnabled, setPanelEnabled] = useState(false);
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
            <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-light mb-4"></div>
                <p className="text-white font-bold text-xl tracking-tight">Accessing Farmmerce...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 font-inter relative">
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
                                <img src="/farmmerce-20.png" alt="Farmmerce" className="h-8 w-auto object-contain" />
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
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Link to="/" className="flex items-center">
                        <img src="/farmmerce-20.png" alt="Farmmerce" className="h-8 w-auto object-contain" />
                    </Link>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} viewMode={viewMode} setViewMode={setViewMode} user={user} />
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <UserInfo user={user} />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 -ml-2 text-gray-400 md:hidden"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-black text-brand-dark capitalize leading-tight">
                            {activeTab === 'buyer-home' ? 'My Dashboard' : activeTab.replace(/-/g, ' ')}
                        </h1>
                        <div className="ml-4 px-3 py-1 bg-brand-light/20 border border-brand-light/30 rounded-full text-[10px] font-black text-brand-dark flex items-center gap-2 uppercase tracking-widest">
                            <User className="w-3 h-3" />
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

                    {activeTab === 'dashboard' && (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-primary">
                                <dt className="text-sm font-black text-gray-400 uppercase tracking-widest truncate">{viewMode === 'FARMER' ? 'Total Revenue' : 'Total Spent'}</dt>
                                <dd className="text-2xl font-black text-brand-dark mt-1">
                                    ₦{stats ? (viewMode === 'FARMER' ? stats.totalRevenue : stats.totalSpent).toLocaleString() : '...'}
                                </dd>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-blue-500">
                                <dt className="text-sm font-black text-gray-400 uppercase tracking-widest truncate">{viewMode === 'FARMER' ? 'Pending Orders' : 'Orders Placed'}</dt>
                                <dd className="text-2xl font-black text-brand-dark mt-1">
                                    {stats ? (viewMode === 'FARMER' ? stats.pendingOrders : stats.orderCount) : '...'}
                                </dd>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg p-5 border-l-4 border-green-500">
                                <dt className="text-sm font-medium text-gray-500 truncate">CO2 Saved (Est.)</dt>
                                <dd className="text-2xl font-bold text-green-600">
                                    {stats ? stats.co2Saved.toFixed(1) : '...'} <span className="text-sm font-normal text-gray-500">kg</span>
                                </dd>
                            </div>
                            {viewMode === 'FARMER' && stats?.lowStockCount > 0 && (
                                <div className="bg-red-50 overflow-hidden shadow rounded-lg p-5 border-l-4 border-red-500">
                                    <dt className="text-sm font-medium text-red-600 truncate flex items-center gap-2">
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

                                        <div className="border-t border-gray-100 pt-2">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between text-sm py-1">
                                                    <span>{item.quantity}x {item.product.name}</span>
                                                    <span>₦{Number(item.price).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-right font-bold text-gray-900">
                                            Total: ₦{Number(order.totalAmount).toFixed(2)}
                                        </div>
                                    </li>
                                )) : (
                                    <li className="px-6 py-4 text-center text-gray-500">No orders received yet.</li>
                                )}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'my-orders' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">My Purchase History</h3>
                            </div>
                            <ul role="list" className="divide-y divide-gray-200">
                                {orders.length > 0 ? orders.map((order: any) => (
                                    <li key={order.id} className="px-6 py-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-lg font-bold text-gray-900">Order #{order.id}</span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
                                        </div>
                                        <div className="text-sm text-gray-500 mb-2">{new Date(order.createdAt).toLocaleDateString()}</div>

                                        {/* Tracking Info for Buyer */}
                                        {order.trackingNote && (
                                            <div className="bg-blue-50 p-2 rounded mb-2 text-xs text-blue-800 border border-blue-100">
                                                <strong>Tracking Update:</strong> {order.trackingNote}
                                            </div>
                                        )}

                                        <div className="border-t border-gray-100 pt-2">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between text-sm py-1">
                                                    <span>{item.quantity}x {item.product.name}</span>
                                                    <span>₦{Number(item.price).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-right font-bold text-gray-900">
                                            Total: ₦{Number(order.totalAmount).toFixed(2)}
                                        </div>
                                    </li>
                                )) : (
                                    <li className="px-6 py-4 text-center text-gray-500">You haven't placed any orders yet.</li>
                                )}
                            </ul>
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
                                                    <select
                                                        value={u.role}
                                                        onChange={(e) => {
                                                            const newRole = e.target.value;
                                                            fetch(`${API_URL}/admin/users/${u.id}/role`, {
                                                                method: 'PUT',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ role: newRole })
                                                            }).then(() => {
                                                                setAllUsers(prev => prev.map(usr => usr.id === u.id ? { ...usr, role: newRole } : usr));
                                                            });
                                                        }}
                                                        className="text-xs font-bold bg-white border-gray-200 rounded-xl focus:ring-brand-dark"
                                                    >
                                                        <option value="BUYER">Promote to Buyer</option>
                                                        <option value="FARMER">Promote to Farmer</option>
                                                        <option value="ADMIN">Promote to Admin</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                                        <div key={s.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-black">S</div>
                                                <div>
                                                    <p className="font-bold text-brand-dark">Settlement #{s.id}</p>
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{s.reference}</p>
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
                                                <p className="text-[10px] text-gray-400">Gross: ₦{Number(s.amount).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-10 text-center text-gray-500">No settlement history found.</div>
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
                                        fetch(`${API_URL}/group-deals/panel-enabled`, {
                                            method: 'PATCH',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ enabled: newState })
                                        }).then(res => res.json()).then(data => setPanelEnabled(data.enabled));
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
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarContent({ activeTab, setActiveTab, viewMode, setViewMode, user }: { activeTab: string, setActiveTab: (tab: string) => void, viewMode: string, setViewMode: (mode: string) => void, user: any }) {
    if (viewMode === 'BUYER' || user?.role === 'BUYER') {
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

                <button onClick={() => setActiveTab('buyer-home')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl transition-all ${activeTab === 'buyer-home' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <LayoutDashboard className="mr-3 h-5 w-5" />
                    Home
                </button>
                <button onClick={() => setActiveTab('marketplace')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl transition-all ${activeTab === 'marketplace' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <ShoppingBag className="mr-3 h-5 w-5" />
                    Marketplace
                </button>
                <button onClick={() => setActiveTab('my-orders')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl transition-all ${activeTab === 'my-orders' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    My Orders
                </button>
                <Link to="/meal-planner" className="w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl text-gray-500 hover:bg-gray-50 transition-all">
                    <ChefHat className="mr-3 h-5 w-5" />
                    Meal Planner
                </Link>
                <div className="pt-4 border-t border-gray-100 mt-4">
                    <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl transition-all ${activeTab === 'profile' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <User className="mr-3 h-5 w-5" />
                        Profile
                    </button>
                </div>
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

            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'dashboard' ? 'bg-brand-dark text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                <LayoutDashboard className="mr-3 h-5 w-5" />
                Dashboard
            </button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'products' ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Package className="mr-3 h-5 w-5" />
                My Products
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'orders' ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <ShoppingBag className="mr-3 h-5 w-5" />
                Incoming Orders
            </button>
            {user?.role === 'DELIVERY' && (
                <button onClick={() => setActiveTab('logistics')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'logistics' ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <Truck className="mr-3 h-5 w-5" />
                    Logistics
                </button>
            )}
            <button onClick={() => setActiveTab('my-orders')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'my-orders' ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                <ShoppingCart className="mr-3 h-5 w-5" />
                My Orders
            </button>
            {user?.role === 'FARMER' && (
                <button onClick={() => setActiveTab('settlements')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'settlements' ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <Navigation className="mr-3 h-5 w-5" />
                    My Settlements
                </button>
            )}
            {
                user?.role === 'ADMIN' && (
                    <div className="pt-6 pb-2">
                        <p className="px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Platform Admin</p>
                        <div className="space-y-1">
                            <button onClick={() => setActiveTab('admin-stats')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'admin-stats' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <LayoutDashboard className="mr-3 h-5 w-5" />
                                Overview
                            </button>
                            <button onClick={() => setActiveTab('admin-users')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'admin-users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <User className="mr-3 h-5 w-5" />
                                Users
                            </button>
                            <button onClick={() => setActiveTab('admin-orders')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'admin-orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <ShoppingBag className="mr-3 h-5 w-5" />
                                All Orders
                            </button>
                            <button onClick={() => setActiveTab('admin-categories')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'admin-categories' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <Filter className="mr-3 h-5 w-5" />
                                Categories
                            </button>
                            <button onClick={() => setActiveTab('admin-recipes')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'admin-recipes' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <ChefHat className="mr-3 h-5 w-5" />
                                Recipes
                            </button>
                            <button onClick={() => setActiveTab('admin-settlements')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'admin-settlements' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <Navigation className="mr-3 h-5 w-5" />
                                Settlements
                            </button>
                            <button onClick={() => setActiveTab('group-deals')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'group-deals' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}`}>
                                <Users className="mr-3 h-5 w-5" />
                                Group Deals
                            </button>
                        </div>
                    </div>
                )
            }
            <div className="pt-6">
                <Link to="/meal-planner" className="w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl text-gray-500 hover:bg-gray-50 transition-all group">
                    <ChefHat className="mr-3 h-5 w-5" />
                    Meal Planner
                </Link>
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-3 py-3 text-sm font-bold rounded-2xl group transition-all ${activeTab === 'profile' ? 'bg-brand-dark text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
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
