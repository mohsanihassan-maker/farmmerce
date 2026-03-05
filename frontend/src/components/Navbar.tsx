import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Home, Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const { itemCount } = useCart();
    const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
    const [showNotifications, setShowNotifications] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    return (
        <nav className="fixed w-full z-50 bg-brand-dark/95 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/farmmerce-20.png" alt="Farmmerce" className="h-10 w-auto object-contain" />
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link to="/" className="text-gray-300 hover:text-brand-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
                            <Link to="/market" className="text-gray-300 hover:text-brand-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Market</Link>
                            <a href="#how-it-works" className="text-gray-300 hover:text-brand-light px-3 py-2 rounded-md text-sm font-medium transition-colors">About</a>
                            {isAuthenticated && (
                                <>
                                    <Link to="/meal-planner" className="text-gray-300 hover:text-brand-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Meal Planner</Link>
                                    <Link to="/orders" className="text-gray-300 hover:text-brand-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Orders</Link>
                                    <Link to="/dashboard" className="text-gray-300 hover:text-brand-light px-3 py-2 rounded-md text-sm font-medium transition-colors">Dashboard</Link>
                                    {user?.role === 'ADMIN' && (
                                        <Link to="/dashboard" className="bg-white/10 text-brand-light px-3 py-2 rounded-md text-sm font-bold border border-white/20 hover:bg-white/20 transition-colors">Admin Panel</Link>
                                    )}
                                </>
                            )}
                            {!isAuthenticated && (
                                <Link to="/register" className="text-gray-300 hover:text-brand-light px-3 py-2 rounded-md text-sm font-medium transition-colors">For Farmers</Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {deferredPrompt && (
                            <button
                                onClick={handleInstall}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-light/10 text-brand-light border border-brand-light/20 rounded-full text-xs font-black uppercase tracking-widest hover:bg-brand-light hover:text-brand-dark transition-all animate-pulse"
                            >
                                📱 Install App
                            </button>
                        )}
                        {isAuthenticated ? (
                            <>
                                {/* Notifications Bell */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-white/10 text-brand-light' : 'text-gray-300 hover:text-brand-light'}`}
                                    >
                                        <Bell size={22} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1.5 right-1.5 bg-brand-red text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-brand-dark">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {showNotifications && (
                                            <>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    onClick={() => setShowNotifications(false)}
                                                    className="fixed inset-0 z-40"
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 py-2"
                                                >
                                                    <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
                                                        <h3 className="font-bold text-brand-dark">Notifications</h3>
                                                        {unreadCount > 0 && (
                                                            <button
                                                                onClick={() => markAllRead()}
                                                                className="text-xs text-brand-dark/50 hover:text-brand-dark font-medium transition-colors"
                                                            >
                                                                Clear all
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                                                        {notifications.length > 0 ? (
                                                            notifications.map((n) => (
                                                                <div
                                                                    key={n.id}
                                                                    onClick={() => markRead(n.id)}
                                                                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors relative flex gap-3 ${!n.read ? 'bg-brand-light/5' : ''}`}
                                                                >
                                                                    <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-brand-light' : 'bg-transparent'}`} />
                                                                    <div className="flex-1">
                                                                        <p className={`text-sm leading-tight ${!n.read ? 'font-bold text-brand-dark' : 'text-gray-600'}`}>{n.title}</p>
                                                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.body}</p>
                                                                        <p className="text-[10px] text-gray-300 mt-1 uppercase font-bold tracking-wider">
                                                                            {new Date(n.createdAt).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    {n.read && <Check size={12} className="text-brand-light mt-1" />}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="py-10 text-center">
                                                                <Bell size={32} className="mx-auto text-gray-100 mb-2" />
                                                                <p className="text-sm text-gray-400">No notifications yet</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link to="/cart" className="relative text-gray-300 hover:text-brand-light transition-colors">
                                    <ShoppingCart size={24} />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-brand-dark">
                                            {itemCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-300">Hi, {user?.name?.split(' ')[0]}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-400 hover:text-white transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-white hover:text-brand-light font-medium px-4 py-2 transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="bg-brand-light text-brand-dark px-5 py-2.5 rounded-full font-bold hover:bg-white transition-all transform hover:scale-105">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-brand-dark border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {deferredPrompt && (
                                <button
                                    onClick={handleInstall}
                                    className="w-full text-left flex items-center gap-3 px-3 py-3 bg-brand-light/10 text-brand-light rounded-xl text-sm font-black uppercase tracking-widest my-2 animate-pulse border border-brand-light/20"
                                >
                                    📱 Install Fammerce App
                                </button>
                            )}
                            <Link to="/" className="text-gray-300 hover:text-brand-light block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Home</Link>
                            <Link to="/market" className="text-gray-300 hover:text-brand-light block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Marketplace</Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to="/meal-planner" className="text-gray-300 hover:text-brand-light block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Meal Planner</Link>
                                    <Link to="/dashboard" className="text-gray-300 hover:text-brand-light block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                                    {user?.role === 'ADMIN' && (
                                        <Link to="/dashboard" className="text-brand-light hover:text-white block px-3 py-2 rounded-md text-base font-bold bg-white/5" onClick={() => setIsOpen(false)}>Admin Panel</Link>
                                    )}
                                    <Link to="/cart" className="text-gray-300 hover:text-brand-light block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>
                                        Cart ({itemCount})
                                    </Link>
                                    <div className="py-2 border-t border-white/5 mt-2">
                                        <div className="px-3 py-2 flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            <span>Notifications</span>
                                            {unreadCount > 0 && <button onClick={markAllRead} className="text-brand-light">Mark all read</button>}
                                        </div>
                                        <div className="max-h-48 overflow-y-auto no-scrollbar space-y-1">
                                            {notifications.length > 0 ? (
                                                notifications.slice(0, 5).map(n => (
                                                    <div key={n.id} onClick={() => markRead(n.id)} className={`px-3 py-2 rounded-lg ${!n.read ? 'bg-white/5' : ''}`}>
                                                        <p className={`text-sm ${!n.read ? 'text-white' : 'text-gray-400'}`}>{n.title}</p>
                                                        <p className="text-xs text-gray-500 line-clamp-1">{n.body}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="px-3 py-2 text-xs text-gray-500 italic">No notifications</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left text-red-400 hover:text-red-300 block px-3 py-2 rounded-md text-base font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="pt-4 flex flex-col gap-2">
                                    <Link to="/login" className="text-center text-white hover:text-brand-light font-medium px-4 py-2 border border-white/20 rounded-lg" onClick={() => setIsOpen(false)}>
                                        Log in
                                    </Link>
                                    <Link to="/register" className="text-center bg-brand-light text-brand-dark px-5 py-2.5 rounded-lg font-bold" onClick={() => setIsOpen(false)}>
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
