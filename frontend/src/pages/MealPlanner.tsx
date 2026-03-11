import { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
    ChefHat, Calendar, ShoppingCart, Check, Loader,
    Sun, Sunset, Moon, Wallet, Utensils, ArrowRight
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../components/Navbar';
import { API_URL } from '../config';

const MealTypeIcon = ({ type }: { type: string }) => {
    switch (type.toUpperCase()) {
        case 'BREAKFAST':
            return <Sun size={14} className="text-amber-400" />;
        case 'LUNCH':
            return <Sun size={14} className="text-orange-400" />;
        case 'DINNER':
            return <Sunset size={14} className="text-brand-yellow" />;
        default:
            return <Utensils size={14} className="text-gray-400" />;
    }
};

export default function MealPlanner() {
    const [searchParams] = useSearchParams();
    const [budget, setBudget] = useState(Number(searchParams.get('budget')) || 5000);
    const [days, setDays] = useState(7);
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();

    const handleGenerate = async () => {
        setLoading(true);
        setPlan(null);
        try {
            const res = await fetch(`${API_URL}/recipes/generate-plan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ budget, days })
            });
            const data = await res.json();
            // Optional: simulate network delay to show off skeletons
            setTimeout(() => {
                setPlan(data);
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error(error);
            alert('Failed to generate plan');
            setLoading(false);
        }
    };

    const addAllToCart = () => {
        if (!plan) return;
        plan.days.forEach((day: any) => {
            Object.values(day.meals).forEach((meal: any) => {
                meal.products.forEach((prod: any) => {
                    for (let i = 0; i < prod.requiredQty; i++) {
                        addToCart(prod);
                    }
                });
            });
        });
        alert('All ingredients added to cart!');
    };

    return (
        <div className="min-h-screen bg-brand-dark font-sans text-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Control Panel */}
                    <div className="col-span-1">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-brand-yellow/20 rounded-xl">
                                    <ChefHat className="text-brand-yellow" size={24} />
                                </div>
                                <h2 className="text-xl font-bold">Plan Your Meals</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Total Budget (₦)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light font-bold">₦</span>
                                        <input
                                            type="number"
                                            value={budget}
                                            onChange={(e) => setBudget(Number(e.target.value))}
                                            className="w-full bg-brand-dark/50 border border-brand-light/20 rounded-xl py-3 pl-10 pr-4 text-brand-light font-bold focus:bg-white/10 focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Duration</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" size={18} />
                                        <select
                                            value={days}
                                            onChange={(e) => setDays(Number(e.target.value))}
                                            className="w-full bg-brand-dark/50 border border-brand-light/20 rounded-xl py-3 pl-10 pr-4 text-brand-light font-bold focus:bg-white/10 focus:ring-2 focus:ring-brand-light focus:border-transparent outline-none transition-all appearance-none"
                                        >
                                            <option value={1} className="text-white bg-brand-dark">1 Day</option>
                                            <option value={3} className="text-white bg-brand-dark">3 Days</option>
                                            <option value={7} className="text-white bg-brand-dark">1 Week</option>
                                            <option value={14} className="text-white bg-brand-dark">2 Weeks</option>
                                            <option value={21} className="text-white bg-brand-dark">3 Weeks</option>
                                            <option value={28} className="text-white bg-brand-dark">4 Weeks (Month)</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="w-full bg-brand-light text-brand-dark py-4 rounded-xl font-bold text-lg hover:bg-white transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="animate-spin" size={20} />
                                            <span>Building your plan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Generate Smart Plan</span>
                                            <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-500">
                                    AI-powered suggestions broken down into Breakfast, Lunch & Dinner.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="col-span-1 lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="skeleton"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-8"
                                >
                                    {/* Stats Skeleton */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl animate-pulse h-24" />
                                        ))}
                                    </div>
                                    <div className="h-px bg-white/10 w-full" />
                                    {/* Plan Skeleton */}
                                    {[1, 2].map(d => (
                                        <div key={d} className="space-y-4">
                                            <div className="h-4 w-24 bg-white/10 rounded animate-pulse mx-auto" />
                                            <div className="space-y-4">
                                                {[1, 2, 3].map(m => (
                                                    <div key={m} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex h-32 animate-pulse">
                                                        <div className="w-40 bg-white/10" />
                                                        <div className="p-4 flex-1 flex flex-col gap-2 justify-center">
                                                            <div className="h-5 w-1/2 bg-white/10 rounded" />
                                                            <div className="h-4 w-1/4 bg-white/10 rounded" />
                                                            <div className="h-3 w-3/4 bg-white/10 rounded mt-2" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            ) : plan ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-8"
                                >
                                    {/* Summary Stats */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-colors">
                                            <div className="text-gray-400 mb-2 group-hover:scale-110 transition-transform"><Calendar size={20} /></div>
                                            <div className="font-bold text-white text-xl">{plan.days.length} Days</div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Duration</div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-colors">
                                            <div className="text-brand-yellow mb-2 group-hover:scale-110 transition-transform"><Utensils size={20} /></div>
                                            <div className="font-bold text-white text-xl">
                                                {plan.days.reduce((acc: number, day: any) => acc + Object.keys(day.meals).length, 0)} Meals
                                            </div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Total Planned</div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-colors">
                                            <div className="text-brand-light mb-2 group-hover:scale-110 transition-transform"><Wallet size={20} /></div>
                                            <div className="font-bold text-white text-xl">
                                                ₦{plan.days.length > 0 ? (parseFloat(plan.totalCost) / plan.days.length).toFixed(0) : 0}
                                            </div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Avg. Cost/Day</div>
                                        </div>
                                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-colors">
                                            <div className="text-green-400 mb-2 group-hover:scale-110 transition-transform"><Check size={20} /></div>
                                            <div className="font-bold text-white text-xl">
                                                ₦{Math.max(0, budget - parseFloat(plan.totalCost)).toFixed(0)}
                                            </div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Budget Rem.</div>
                                        </div>
                                    </div>

                                    {/* Header Message */}
                                    <div className="bg-gradient-to-r from-brand-light/10 to-transparent border border-brand-light/20 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-brand-light mb-1">
                                                {plan.daysPlanned % 7 === 0
                                                    ? `${plan.daysPlanned / 7} Week Plan Ready!`
                                                    : `${plan.daysPlanned} Day Plan Ready!`}
                                            </h3>
                                            <p className="text-gray-400 text-sm">{plan.message}</p>
                                        </div>
                                        <div className="text-right bg-black/20 px-6 py-3 rounded-xl border border-white/5 flex flex-col justify-center">
                                            <div className="text-3xl font-bold text-white">₦{plan.totalCost}</div>
                                            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total Est. Cost</div>
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        {plan.days.map((day: any, dIdx: number) => (
                                            <div key={dIdx} className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-px bg-white/10 flex-1"></div>
                                                    <h4 className="text-brand-yellow font-bold tracking-widest text-sm bg-brand-yellow/10 px-4 py-1.5 rounded-full border border-brand-yellow/20">DAY {day.day}</h4>
                                                    <div className="h-px bg-white/10 flex-1"></div>
                                                </div>

                                                <div className="grid gap-4">
                                                    {Object.entries(day.meals).map(([mealType, item]: [string, any], mIdx: number) => (
                                                        <motion.div
                                                            key={mIdx}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: mIdx * 0.1 }}
                                                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col sm:flex-row hover:bg-white/10 hover:border-white/20 transition-all group relative duration-300"
                                                        >
                                                            <div className="absolute top-4 left-4 z-10 shadow-lg">
                                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-dark/90 backdrop-blur-md rounded-lg text-xs font-bold text-white uppercase tracking-tighter border border-white/10 shadow-2xl">
                                                                    <MealTypeIcon type={mealType} />
                                                                    {mealType}
                                                                </div>
                                                            </div>
                                                            <div className="sm:w-48 h-40 sm:h-auto overflow-hidden relative">
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0"></div>
                                                                <img
                                                                    src={item.recipe.imageUrl}
                                                                    alt={item.recipe.title}
                                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                                />
                                                            </div>
                                                            <div className="p-5 flex-1 flex flex-col justify-center">
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h5 className="font-bold text-lg text-white group-hover:text-brand-yellow transition-colors leading-tight">{item.recipe.title}</h5>
                                                                    <span className="text-brand-light text-base font-bold bg-brand-light/10 px-2 py-1 rounded-md">₦{item.cost.toFixed(0)}</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1.5 mt-3">
                                                                    {item.products.slice(0, 4).map((prod: any, pIdx: number) => (
                                                                        <span key={pIdx} className="text-xs text-gray-300 bg-black/40 px-2 py-1 rounded-md border border-white/5 flex items-center gap-1">
                                                                            <span className="w-1 h-1 rounded-full bg-brand-light"></span>
                                                                            {prod.name}
                                                                        </span>
                                                                    ))}
                                                                    {item.products.length > 4 && (
                                                                        <span className="text-xs text-brand-yellow font-medium mt-1 ml-1 px-1">
                                                                            +{item.products.length - 4} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={addAllToCart}
                                        className="w-full bg-brand-yellow text-brand-dark py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20 mt-8"
                                    >
                                        <ShoppingCart size={20} />
                                        Add All Ingredients for {plan.days.length} Days to Cart
                                    </motion.button>

                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full min-h-[500px] flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-3xl p-10 bg-gradient-to-b from-white/5 to-transparent relative overflow-hidden group"
                                >
                                    {/* Decorative background elements */}
                                    <div className="absolute w-64 h-64 bg-brand-light/5 rounded-full blur-3xl -top-20 -right-20 pointer-events-none group-hover:bg-brand-light/10 transition-colors duration-1000"></div>
                                    <div className="absolute w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl -bottom-20 -left-20 pointer-events-none group-hover:bg-brand-yellow/10 transition-colors duration-1000"></div>

                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                        className="w-24 h-24 bg-gradient-to-br from-brand-yellow/20 to-brand-yellow/5 rounded-full flex items-center justify-center mb-8 border border-brand-yellow/20 shadow-xl shadow-brand-yellow/5 relative z-10"
                                    >
                                        <ChefHat className="text-brand-yellow h-12 w-12" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-white mb-3 text-center relative z-10">Ready to plan your meals?</h3>
                                    <p className="text-center max-w-md text-gray-400 leading-relaxed relative z-10">
                                        Enter your budget and duration to generate a personalized Breakfast, Lunch, and Dinner schedule using seasonal local produce.
                                    </p>
                                    <div className="mt-8 flex gap-4 text-sm text-gray-500 relative z-10">
                                        <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full"><Sun size={14} /> Breakfast</div>
                                        <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full"><Sun size={14} /> Lunch</div>
                                        <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full"><Sunset size={14} /> Dinner</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
