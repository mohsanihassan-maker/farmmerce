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
        <nav className="fixed w-full z-50 top-4 px-4 sm:px-6 lg:px-8 pointer-events-none">
            <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl shadow-brand-dark/5 rounded-[2rem] pointer-events-auto">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/farmmerce-20.png" alt="Farmmerce" className="h-10 w-auto object-contain" />
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-1">
                            <Link to="/" className="text-gray-600 hover:text-brand-dark hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-bold transition-all">Home</Link>
                            <Link to="/market" className="text-gray-600 hover:text-brand-dark hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-bold transition-all">Market</Link>
                            <Link to="/" className="text-gray-600 hover:text-brand-dark hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-bold transition-all">About</Link>
                            {isAuthenticated && (
                                <Link to="/dashboard" className="text-brand-dark hover:bg-gray-50 border border-gray-100 px-4 py-2 rounded-full text-sm font-black transition-all">Dashboard ⊕</Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4 pr-2">
                        {deferredPrompt && (
                            <button
                                onClick={handleInstall}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-light text-brand-dark rounded-full text-xs font-black uppercase tracking-widest transition-all animate-pulse shadow-sm"
                            >
                                📱 App
                            </button>
                        )}
                        {isAuthenticated ? (
                            <>
                                {/* Notifications Bell */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-gray-100 text-brand-dark' : 'text-gray-400 hover:text-brand-dark hover:bg-gray-50'}`}
                                    >
                                        <Bell size={22} />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1.5 right-1.5 bg-brand-red text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
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
                                                    className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 py-2"
                                                >
                                                    <div className="px-5 py-3 border-b border-gray-50 flex justify-between items-center">
                                                        <h3 className="font-black text-brand-dark tracking-tight">Updates</h3>
                                                        {unreadCount > 0 && (
                                                            <button
                                                                onClick={() => markAllRead()}
                                                                className="text-[10px] font-black uppercase tracking-widest text-brand-dark/40 hover:text-brand-dark transition-colors"
                                                            >
                                                                Clear
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                                                        {notifications.length > 0 ? (
                                                            notifications.map((n) => (
                                                                <div
                                                                    key={n.id}
                                                                    onClick={() => markRead(n.id)}
                                                                    className={`px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors relative flex gap-3 ${!n.read ? 'bg-brand-light/10' : ''}`}
                                                                >
                                                                    <div className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-brand-green' : 'bg-transparent'}`} />
                                                                    <div className="flex-1">
                                                                        <p className={`text-sm leading-tight ${!n.read ? 'font-black text-brand-dark' : 'font-medium text-gray-500'}`}>{n.title}</p>
                                                                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{n.body}</p>
                                                                    </div>
                                                                    {n.read && <Check size={12} className="text-brand-light mt-1" />}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="py-12 text-center">
                                                                <Bell size={24} className="mx-auto text-gray-200 mb-3" />
                                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">All caught up</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link to="/cart" className="relative p-2 text-gray-400 hover:text-brand-dark hover:bg-gray-50 rounded-full border border-transparent transition-all">
                                    <ShoppingCart size={22} />
                                    {itemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                            {itemCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                                    <div className="w-8 h-8 rounded-full bg-brand-light/30 flex items-center justify-center text-brand-dark font-black text-xs">
                                        {user?.name?.[0]}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-400 hover:text-brand-red p-2 rounded-full transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-brand-dark font-black text-sm px-4 py-2 hover:bg-gray-50 rounded-full transition-colors">
                                    Sign in
                                </Link>
                                <Link to="/register" className="bg-[#0F8B4F] text-white px-6 py-2.5 rounded-full font-black text-sm tracking-tight hover:bg-[#004B23] transition-all focus:ring-2 focus:ring-[#0F8B4F] focus:ring-offset-2">
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
                            <Link to="/market" className="text-gray-300 hover:text-brand-light block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>Market</Link>
                            <Link to="/" className="text-gray-300 hover:text-brand-light block px-3 py-2 rounded-md text-base font-medium" onClick={() => setIsOpen(false)}>About</Link>

                            {isAuthenticated ? (
                                <>
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
