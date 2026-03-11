import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ChevronRight, Clock, MapPin, CreditCard, User, Star, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import { api } from '../api';


export default function OrderHistory() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewingItem, setReviewingItem] = useState<any>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user) return;

        api.get(`/orders?buyerId=${user.id}`)
            .then(res => res.json())
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [user]);


    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !reviewingItem) return;

        setSubmitting(true);
        try {
            const res = await api.post(`/products/${reviewingItem.productId}/reviews`, {
                userId: user.id,
                rating,
                comment
            });


            if (res.ok) {
                setReviewingItem(null);
                setRating(5);
                setComment('');
                alert('Review submitted successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to submit review');
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800';
            case 'READY_FOR_PICKUP': return 'bg-orange-100 text-orange-800';
            case 'CONFIRMED': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark/5 flex flex-col font-sans">
            <Navbar />
            <div className="flex-1 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-bold text-brand-dark tracking-tight">Your Orders</h1>
                            <p className="text-brand-dark/60 mt-2 text-lg">Track and manage your farm-fresh purchases</p>
                        </div>
                        <Link to="/market" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-dark border border-brand-dark/10 rounded-2xl font-bold hover:bg-brand-dark hover:text-white transition-all shadow-sm">
                            Continue Shopping <ChevronRight size={18} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-32 bg-white rounded-[2.5rem] border border-brand-dark/5 shadow-xl shadow-brand-dark/5">
                            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-brand-dark mx-auto"></div>
                            <p className="mt-6 text-brand-dark/60 font-medium text-lg">Loading your orders...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-brand-dark/5 border border-brand-dark/5 p-16 text-center">
                            <div className="bg-brand-dark/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <ShoppingBag className="text-brand-dark/40" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-brand-dark mb-3">No orders placed yet</h2>
                            <p className="text-brand-dark/60 mb-10 max-w-sm mx-auto text-lg leading-relaxed">
                                You haven't made any purchases. Explore our local farms and find something fresh!
                            </p>
                            <Link
                                to="/market"
                                className="inline-flex items-center justify-center px-10 py-4 bg-brand-dark text-brand-light font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-brand-dark/20 text-lg"
                            >
                                Browse Marketplace
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {orders.map((order, idx) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white rounded-[2.5rem] shadow-2xl shadow-brand-dark/5 border border-brand-dark/5 overflow-hidden transition-all hover:shadow-brand-dark/10 group mb-10"
                                >
                                    <div className="px-8 py-6 bg-brand-dark text-white flex flex-wrap items-center justify-between gap-6 transition-colors group-hover:bg-black">
                                        <div className="flex items-center gap-10">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1.5 opacity-60">Order Placed</p>
                                                <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1.5 opacity-60">Total Amount</p>
                                                <p className="text-sm font-bold text-brand-light text-lg">₦{Number(order.totalAmount).toLocaleString()}</p>
                                            </div>
                                            <div className="hidden sm:block">
                                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1.5 opacity-60">Order ID</p>
                                                <p className="text-sm font-mono text-brand-light/40">#ORDER-{String(order.id).padStart(4, '0')}</p>
                                            </div>
                                        </div>
                                        <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${getStatusColor(order.status)} ring-4 ring-white/5`}>
                                            {order.status}
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        {/* Status Alerts */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                            {order.trackingNote && (
                                                <div className="bg-brand-light/5 border border-brand-light/10 rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm">
                                                    <div className="p-2 bg-brand-light/20 rounded-xl text-brand-dark">
                                                        <Clock size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-brand-dark/30 uppercase tracking-widest mb-1">Latest Update</p>
                                                        <p className="text-sm text-brand-dark font-medium leading-relaxed">{order.trackingNote}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {order.deliveryAgent && (
                                                <div className="bg-brand-yellow/5 border border-brand-yellow/10 rounded-2xl p-5 flex items-start gap-4 backdrop-blur-sm">
                                                    <div className="p-2 bg-brand-yellow/20 rounded-xl text-brand-yellow-dark">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black text-brand-yellow-dark/40 uppercase tracking-widest mb-1">Courier Assigned</p>
                                                        <p className="text-sm text-brand-dark font-medium">
                                                            {order.deliveryAgent.name} {order.deliveryAgent.phone ? `(${order.deliveryAgent.phone})` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                            <div className="md:col-span-2 space-y-6">
                                                {order.items.map((item: any) => (
                                                    <div key={item.id} className="flex gap-6 items-center group/item">
                                                        <div className="w-24 h-24 rounded-3xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 p-1.5 shadow-inner transition-transform group-hover/item:scale-105">
                                                            <img
                                                                src={item.product?.imageUrl || "https://placehold.co/200"}
                                                                alt={item.product?.name}
                                                                className="w-full h-full object-cover rounded-[1.25rem]"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <Link to={`/market`} className="text-xl font-bold text-brand-dark hover:text-brand-light transition-colors block mb-1">
                                                                {item.product?.name}
                                                            </Link>
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-xs font-black bg-brand-dark/5 text-brand-dark/40 px-3 py-1 rounded-full uppercase tracking-tighter">Qty: {item.quantity}</span>
                                                                <span className="text-lg font-black text-brand-dark">₦{Number(item.price).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        {order.status === 'DELIVERED' && (
                                                            <button
                                                                onClick={() => setReviewingItem(item)}
                                                                className="px-6 py-3 bg-brand-light/10 text-brand-dark border border-brand-dark/10 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-brand-dark hover:text-white transition-all flex items-center gap-2 shadow-sm active:scale-95"
                                                            >
                                                                <Star size={18} /> Review
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="space-y-8 pt-8 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-12 flex flex-col justify-center">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-brand-dark/5 rounded-xl text-brand-dark/30">
                                                        <MapPin size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest mb-1.5">Shipping To</p>
                                                        <p className="text-sm text-brand-dark leading-relaxed font-bold">
                                                            {order.shippingAddress || 'No address provided'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4">
                                                    <div className="p-2 bg-brand-dark/5 rounded-xl text-brand-dark/30">
                                                        <CreditCard size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-brand-dark/40 uppercase tracking-widest mb-1.5">Paid Via</p>
                                                        <p className="text-sm text-brand-dark font-bold">
                                                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Secure Card Payment'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {reviewingItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={() => setReviewingItem(null)} />
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 overflow-hidden shadow-2xl">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-brand-dark">Review Product</h3>
                                <button onClick={() => setReviewingItem(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex gap-4 items-center mb-8 p-4 bg-gray-50 rounded-2xl">
                                <img
                                    src={reviewingItem.product?.imageUrl || "https://placehold.co/200"}
                                    alt={reviewingItem.product?.name}
                                    className="w-16 h-16 object-cover rounded-xl"
                                />
                                <p className="font-bold text-brand-dark text-lg">{reviewingItem.product?.name}</p>
                            </div>

                            <form onSubmit={handleReviewSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-brand-dark mb-4">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setRating(s)}
                                                className="p-1 transition-transform active:scale-95"
                                            >
                                                <Star
                                                    size={32}
                                                    className={`${s <= rating ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-300'} transition-colors`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-brand-dark mb-2">Comment</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-dark transition-colors resize-none"
                                        placeholder="Tell us what you think about this product..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-brand-dark text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg shadow-brand-dark/20 flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Submitting...' : 'Post Review'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
