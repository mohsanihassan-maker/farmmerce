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
                whileHover={{ y: -8 }}
                className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(1,63,49,0.2)] hover:border-brand-light/50 transition-all duration-500 h-full flex flex-col"
            >
                <div className="h-44 w-full relative overflow-hidden bg-gray-100 shrink-0">
                    <img
                        src={product.imageUrl || "https://images.unsplash.com/photo-1595855709915-0b043928a491?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-bold px-4 py-2 border-2 border-white rounded-lg transform -rotate-12">
                                SOLD OUT
                            </span>
                        </div>
                    )}
                    {product.categoryName && (
                        <div className="absolute top-2 left-2">
                            <span className="bg-white/90 backdrop-blur text-brand-dark text-[9px] font-black px-2 py-1 rounded-md shadow-sm uppercase tracking-widest">
                                {product.categoryName}
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                    <div className="mb-2 flex-1">
                        <div className="flex items-center justify-between mb-1">
                            {product.farmer?.id ? (
                                <Link
                                    to={`/farmer/${product.farmer.id}`}
                                    className="text-[10px] text-brand-dark/40 font-black uppercase tracking-widest hover:text-brand-dark transition-colors"
                                >
                                    {product.farmer.name || 'Local Farmer'}
                                </Link>
                            ) : (
                                <p className="text-[10px] text-brand-dark/40 font-black uppercase tracking-widest">
                                    {product.farmer?.name || 'Local Farmer'}
                                </p>
                            )}
                        </div>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="text-base font-black text-gray-900 group-hover:text-brand-dark transition-colors line-clamp-1 tracking-tight">
                                {product.name}
                            </h3>
                            {product.traceabilityId && (
                                <Link
                                    to={`/trace/${product.traceabilityId}`}
                                    className="flex-shrink-0 text-brand-dark/20 hover:text-brand-mars transition-colors"
                                    title="View Product Journey"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
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

                    <div className="flex items-end justify-between mt-auto pt-2">
                        <div>
                            <p className="text-xl font-black text-brand-dark leading-none">
                                ₦{parseFloat(String(product.price)).toLocaleString()}
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">per {product.unit}</p>
                        </div>

                        <button
                            onClick={() => onAddToCart(product.id)}
                            disabled={product.stock === 0}
                            className={`h-10 w-10 flex items-center justify-center rounded-full shadow-lg transition-all transform active:scale-95 ${product.stock > 0
                                ? 'bg-brand-light text-brand-dark hover:bg-brand-dark hover:text-brand-light'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            title="Add to Cart"
                        >
                            {product.stock > 0 ? <Plus className="h-5 w-5" /> : <ShoppingBasket className="h-5 w-5" />}
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
