import React, { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

interface Review {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user: { name: string };
}

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: number;
    productName: string;
}

export default function ReviewModal({ isOpen, onClose, productId, productName }: ReviewModalProps) {
    const { user, isAuthenticated } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [avgRating, setAvgRating] = useState(0);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form state
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/products/${productId}/reviews`);
            const data = await res.json();
            setReviews(data.reviews || []);
            setAvgRating(data.avgRating || 0);
            setCount(data.count || 0);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            setLoading(false);
        }
    };

    const checkCanReview = async () => {
        if (!isAuthenticated || !user) return;
        try {
            // Re-using the logic from the backend route directly via a mock check
            // In a real app, you might have a specific Check Eligibility endpoint
            // For now, we'll try to post and handle the 403, or just allow the attempt.
            setCanReview(true);
        } catch (err) {
            setCanReview(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setSuccess(false);
            fetchReviews();
            checkCanReview();
        }
    }, [isOpen, productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !user) return;

        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, rating, comment })
            });

            if (res.ok) {
                setSuccess(true);
                setComment('');
                fetchReviews();
            } else {
                const errData = await res.json();
                alert(errData.error || 'Failed to post review');
            }
        } catch (err) {
            alert('Network error');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-2xl font-black text-brand-dark tracking-tight">{productName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={14} className={s <= Math.round(avgRating) ? 'fill-current' : 'text-gray-200'} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-gray-500">{avgRating.toFixed(1)} ({count} reviews)</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-brand-dark">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                        {/* New Review Form */}
                        {isAuthenticated ? (
                            success ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-brand-light/10 p-8 rounded-3xl text-center border border-brand-light/20"
                                >
                                    <div className="bg-brand-light text-brand-dark w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-brand-dark">Review Shared!</h3>
                                    <p className="text-brand-dark/60 text-sm mt-1">Your feedback helps the community and {productName}'s farmer.</p>
                                    <button onClick={() => setSuccess(false)} className="mt-4 text-sm font-bold text-brand-light underline">Post another</button>
                                </motion.div>
                            ) : (
                                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                    <h3 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                                        <MessageSquare size={18} className="text-brand-light" />
                                        Write a Review
                                    </h3>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onMouseEnter={() => setHoveredStar(s)}
                                                    onMouseLeave={() => setHoveredStar(0)}
                                                    onClick={() => setRating(s)}
                                                    className="transition-transform active:scale-90"
                                                >
                                                    <Star
                                                        size={28}
                                                        className={s <= (hoveredStar || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                            placeholder="Share your experience with this produce..."
                                            className="w-full h-24 p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-light outline-none transition-all resize-none text-sm"
                                            required
                                        />
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold hover:bg-brand-light hover:text-brand-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {submitting ? 'Posting...' : <>Submit Review <Send size={16} /></>}
                                        </button>
                                        <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
                                            Reviews only allowed for delivered orders
                                        </p>
                                    </form>
                                </div>
                            )
                        ) : (
                            <div className="bg-brand-dark/5 p-6 rounded-3xl text-center border border-dashed border-brand-dark/10">
                                <p className="text-sm text-gray-500 font-medium">Please log in to share your feedback.</p>
                            </div>
                        )}

                        {/* Review List */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-brand-dark border-b border-gray-50 pb-2">Community Feedback</h3>
                            {loading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-50 rounded-2xl" />)}
                                </div>
                            ) : reviews.length > 0 ? (
                                reviews.map(r => (
                                    <div key={r.id} className="group">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-bold text-brand-dark text-sm">{r.user.name}</p>
                                            <div className="flex text-yellow-400">
                                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className={s <= r.rating ? 'fill-current' : 'text-gray-200'} />)}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm italic">"{r.comment}"</p>
                                        <p className="text-[10px] text-gray-300 font-bold mt-2 uppercase tracking-tighter">
                                            {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <MessageSquare size={40} className="mx-auto text-gray-100 mb-2" />
                                    <p className="text-sm text-gray-400">Be the first to review this product!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
