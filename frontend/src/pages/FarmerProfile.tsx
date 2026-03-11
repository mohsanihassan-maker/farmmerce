import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { MapPin, Star, Package, ArrowLeft, ShieldCheck, MessageCircle, Calendar, Award, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../config';

export default function FarmerProfile() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [farmer, setFarmer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`${API_URL}/users/${id}/profile`)
            .then(res => res.json())
            .then(data => {
                setFarmer(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = (productId: number) => {
        const product = farmer?.products?.find((p: any) => p.id === productId);
        if (product) addToCart(product);
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-brand-dark" />
        </div>
    );

    if (!farmer) return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
            <p className="text-xl font-bold text-brand-dark">Farmer not found</p>
            <Link to="/market" className="text-brand-dark/60 underline">Back to marketplace</Link>
        </div>
    );

    const avgRating = farmer.avgRating ?? 0;
    const totalReviews = farmer.totalReviews ?? 0;

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Navbar />

            {/* Hero */}
            {/* Hero Banner */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
                    alt="Farm Banner"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
            </div>

            {/* Profile Info Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-brand-dark/10 border border-brand-dark/5">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-[2.5rem] bg-brand-light flex items-center justify-center text-5xl font-black text-brand-dark border-4 border-white shadow-xl flex-shrink-0">
                            {farmer.name?.[0] ?? 'F'}
                        </div>

                        <div className="flex-1 pt-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight">
                                    {farmer.profile?.farmName || farmer.name}
                                </h1>
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black uppercase rounded-full border border-blue-100">
                                        <ShieldCheck size={14} /> Verified
                                    </span>
                                    {farmer.id === 1 && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-yellow/20 text-brand-yellow-dark text-xs font-black uppercase rounded-full border border-brand-yellow/30">
                                            <Trophy size={14} /> Farmer of the Month
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 mt-4">
                                {farmer.profile?.location && (
                                    <div className="flex items-center gap-1.5 text-brand-dark/60 text-sm font-bold">
                                        <MapPin size={16} className="text-brand-light" />
                                        {farmer.profile.location}
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-brand-dark/60 text-sm font-bold">
                                    <Calendar size={16} className="text-brand-light" />
                                    Since {new Date(farmer.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="flex text-brand-yellow">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={14} className={s <= Math.round(avgRating) ? 'fill-current' : 'text-gray-200'} />
                                        ))}
                                    </div>
                                    <span className="text-brand-dark font-black text-sm">{avgRating.toFixed(1)}</span>
                                    <span className="text-brand-dark/40 text-xs font-bold">({totalReviews} reviews)</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto flex gap-3 pt-2">
                            <button className="flex-1 md:flex-none px-6 py-4 bg-brand-dark text-white rounded-2xl font-black text-sm hover:bg-brand-light hover:text-brand-dark transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-brand-dark/10">
                                <MessageCircle size={18} /> Message
                            </button>
                            <button className="md:px-4 px-6 py-4 border-2 border-brand-dark/5 rounded-2xl text-brand-dark hover:bg-brand-dark hover:text-white transition-all">
                                <Package size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar: Farmer Stats & Story */}
                    <div className="lg:col-span-1 space-y-8">
                        <section className="bg-white rounded-[2.5rem] p-8 border border-brand-dark/5 shadow-xl shadow-brand-dark/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-light/10 rounded-full blur-3xl -mr-16 -mt-16" />
                            <h3 className="text-xl font-bold text-brand-dark mb-4 relative">Our Story</h3>
                            <p className="text-brand-dark/70 text-sm leading-relaxed whitespace-pre-line relative">
                                {farmer.profile?.bio || "We are a local farm dedicated to providing the freshest produce to our community. Every harvest is handled with care to ensure the highest quality. We believe in sustainable farming and fair prices for both the producer and the consumer."}
                            </p>
                            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center gap-4 text-brand-dark/40 italic text-xs">
                                <span>"Quality produce, straight from our fields to your home."</span>
                            </div>
                        </section>

                        <section className="bg-brand-light/10 rounded-[2.5rem] p-8 border border-brand-light/20">
                            <h3 className="text-xl font-bold text-brand-dark mb-6">Farm Details</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-brand-dark/60 font-medium">Location</span>
                                    <span className="text-sm text-brand-dark font-bold">{farmer.profile?.location || 'Lagos, NG'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-brand-dark/60 font-medium">Member Since</span>
                                    <span className="text-sm text-brand-dark font-bold">{new Date(farmer.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-brand-dark/60 font-medium">Verified Source</span>
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-lg">TRUSTED</span>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-[2.5rem] p-8 border border-brand-dark/5 shadow-xl shadow-brand-dark/5">
                            <h3 className="text-xl font-bold text-brand-dark mb-6">Recent Reviews</h3>
                            <div className="space-y-6">
                                {farmer.reviews?.length > 0 ? farmer.reviews.slice(0, 3).map((r: any) => (
                                    <div key={r.id} className="pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-bold text-brand-dark">{r.user?.name || 'Customer'}</p>
                                            <div className="flex text-brand-yellow">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={10} className={s <= r.rating ? 'fill-current' : 'text-gray-200'} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-xs text-brand-dark/60 leading-relaxed italic">"{r.comment}"</p>
                                    </div>
                                )) : (
                                    <p className="text-sm text-brand-dark/40 text-center py-4">No reviews yet.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-black text-brand-dark mb-8 flex items-center gap-3">
                            <Package className="text-brand-light" />
                            Current Harvests
                        </h2>
                        {farmer.products?.length > 0 ? (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {farmer.products.map((product: any) => (
                                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                                ))}
                            </motion.div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-brand-dark/5">
                                <p className="text-brand-dark/40 font-medium">No products listed currently.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
