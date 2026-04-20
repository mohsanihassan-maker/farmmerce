import { Plus, ShoppingBasket, ExternalLink, Star, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ReviewModal from './ReviewModal';

interface ProductCardProps {
    product: any;
    onAddToCart: (id: number) => void;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
    return (
        <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    size={11}
                    className={star <= Math.round(rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-200'}
                />
            ))}
            <span className="text-[10px] text-gray-400 font-medium ml-0.5">
                {rating > 0 ? `${rating.toFixed(1)} (${count})` : 'No reviews'}
            </span>
        </div>
    );
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    return (
        <>
            <motion.div
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-[0_15px_35px_-10px_rgba(1,63,49,0.15)] hover:border-brand-dark/10 transition-all duration-500 h-full flex flex-col"
            >
                <div className="h-32 w-full relative overflow-hidden bg-gray-50 shrink-0">
                    <img
                        src={product.imageUrl || "https://images.unsplash.com/photo-1595855709915-0b043928a491?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-white text-[10px] font-black px-2 py-1 border border-white/50 rounded-md transform -rotate-12 uppercase">
                                Out of Stock
                            </span>
                        </div>
                    )}
                    {product.categoryName && (
                        <div className="absolute top-2 left-2">
                            <span className="bg-white/80 backdrop-blur text-brand-dark text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-widest border border-white/50">
                                {product.categoryName}
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-3 flex flex-col flex-1">
                    <div className="mb-2 flex-1">
                        <div className="flex items-center justify-between mb-1">
                            {product.farmer?.id ? (
                                <Link
                                    to={`/farmer/${product.farmer.id}`}
                                    className="text-[9px] text-brand-dark/30 font-black uppercase tracking-widest hover:text-brand-dark transition-colors truncate max-w-[80%]"
                                >
                                    {product.farmer.name || 'Local Farm'}
                                </Link>
                            ) : (
                                <p className="text-[9px] text-brand-dark/30 font-black uppercase tracking-widest truncate max-w-[100%]">
                                    {product.farmer?.name || 'Local Farm'}
                                </p>
                            )}
                        </div>
                        <div className="flex items-start justify-between gap-1">
                            <h3 className="text-sm font-black text-brand-dark group-hover:text-brand-mars transition-colors line-clamp-1 tracking-tight leading-tight">
                                {product.name}
                            </h3>
                            {product.traceabilityId && (
                                <Link
                                    to={`/trace/${product.traceabilityId}`}
                                    className="flex-shrink-0 text-brand-dark/10 hover:text-brand-mars transition-colors"
                                    title="Trace Origin"
                                >
                                    <ExternalLink size={12} />
                                </Link>
                            )}
                        </div>
                        <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className="block text-left hover:opacity-70 transition-opacity"
                        >
                            <StarRating rating={product.avgRating ?? 0} count={product.reviewCount ?? 0} />
                        </button>
                    </div>

                    <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-50/50">
                        <div>
                            <p className="text-base font-black text-brand-dark leading-none">
                                ₦{parseFloat(String(product.price)).toLocaleString()}
                            </p>
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 mt-1">/{product.unit}</p>
                        </div>

                        <button
                            onClick={() => onAddToCart(product.id)}
                            disabled={product.stock === 0}
                            className={`h-8 w-8 flex items-center justify-center rounded-xl shadow-lg transition-all transform active:scale-90 ${product.stock > 0
                                ? 'bg-brand-dark text-white hover:bg-brand-mars'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            {product.stock > 0 ? <Plus size={16} /> : <ShoppingBasket size={16} />}
                        </button>
                    </div>
                </div>
            </motion.div>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productId={product.id}
                productName={product.name}
            />
        </>
    )
}
