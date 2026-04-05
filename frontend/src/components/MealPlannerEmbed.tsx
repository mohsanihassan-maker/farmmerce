/**
 * MealPlannerEmbed — The full MealPlanner content, without its standalone Navbar wrapper,
 * so it can be rendered inside the Dashboard content area.
 */
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import {
    ChefHat, Calendar, ShoppingCart, Check, Loader,
    Sun, Sunset, Moon, Wallet, Utensils, ArrowRight
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URL } from '../config';

const MealTypeIcon = ({ type }: { type: string }) => {
    switch (type.toUpperCase()) {
        case 'BREAKFAST': return <Sun size={14} className="text-amber-400" />;
        case 'LUNCH':     return <Sun size={14} className="text-orange-400" />;
        case 'DINNER':    return <Sunset size={14} className="text-brand-yellow" />;
        default:          return <Utensils size={14} className="text-gray-400" />;
    }
};

export default function MealPlannerEmbed() {
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
            setTimeout(() => { setPlan(data); setLoading(false); }, 800);
        } catch {
            alert('Failed to generate plan');
            setLoading(false);
        }
    };

    const addAllToCart = () => {
        if (!plan) return;
        plan.days.forEach((day: any) => {
            Object.values(day.meals).forEach((meal: any) => {
                meal.products.forEach((prod: any) => {
                    for (let i = 0; i < prod.requiredQty; i++) addToCart(prod);
                });
            });
        });
        alert('All ingredients added to cart!');
    };

    return (
        <div className="font-sans text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-brand-yellow/20 rounded-2xl">
                        <ChefHat className="text-brand-yellow" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-brand-dark">Meal Planner</h2>
                        <p className="text-sm text-gray-400">AI-powered weekly plans from local farms</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* ── Control Panel ── */}
                    <div className="col-span-1">
                        <div className="bg-brand-dark border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Total Budget (₦)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light font-bold">₦</span>
                                        <input
                                            type="number"
                                            value={budget}
                                            onChange={(e) => setBudget(Number(e.target.value))}
                                            className="w-full bg-brand-dark/50 border border-brand-light/20 rounded-xl py-3 pl-10 pr-4 text-brand-light font-bold focus:ring-2 focus:ring-brand-light outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">Duration</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-light" size={18} />
                                        <select
                                            value={days}
                                            onChange={(e) => setDays(Number(e.target.value))}
                                            className="w-full bg-brand-dark/50 border border-brand-light/20 rounded-xl py-3 pl-10 pr-4 text-brand-light font-bold focus:ring-2 focus:ring-brand-light outline-none appearance-none transition-all"
                                        >
                                            {[1, 3, 7, 14, 21, 28].map(d => (
                                                <option key={d} value={d} className="text-white bg-brand-dark">
                                                    {d === 7 ? '1 Week' : d === 14 ? '2 Weeks' : d === 21 ? '3 Weeks' : d === 28 ? '1 Month' : `${d} Day${d === 1 ? '' : 's'}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="w-full bg-brand-light text-brand-dark py-4 rounded-2xl font-black text-base hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <><Loader className="animate-spin" size={18} /> Building plan...</> : <><span>Generate Smart Plan</span><ArrowRight size={18} /></>}
                                </button>
                                <p className="text-[11px] text-center text-gray-500">AI-powered Breakfast, Lunch & Dinner suggestions</p>
                            </div>
                        </div>
                    </div>

                    {/* ── Results ── */}
                    <div className="col-span-1 lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                                    {[1, 2].map(i => <div key={i} className="bg-gray-100 rounded-3xl h-40 animate-pulse" />)}
                                </motion.div>
                            ) : plan ? (
                                <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                    {/* Summary */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[
                                            { label: 'Duration', value: `${plan.days.length} Days`, icon: Calendar, color: 'text-gray-500' },
                                            { label: 'Total Meals', value: plan.days.reduce((a: number, d: any) => a + Object.keys(d.meals).length, 0), icon: Utensils, color: 'text-amber-500' },
                                            { label: 'Daily Cost', value: `₦${plan.days.length > 0 ? (parseFloat(plan.totalCost) / plan.days.length).toFixed(0) : 0}`, icon: Wallet, color: 'text-brand-dark' },
                                            { label: 'Budget Left', value: `₦${Math.max(0, budget - parseFloat(plan.totalCost)).toFixed(0)}`, icon: Check, color: 'text-green-600' },
                                        ].map(({ label, value, icon: Icon, color }) => (
                                            <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
                                                <Icon size={18} className={`mx-auto mb-1 ${color}`} />
                                                <p className="text-base font-black text-brand-dark">{value}</p>
                                                <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">{label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Days */}
                                    <div className="space-y-8">
                                        {plan.days.map((day: any, dIdx: number) => (
                                            <div key={dIdx} className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-px bg-gray-200 flex-1" />
                                                    <h4 className="text-xs font-black text-brand-dark bg-brand-light/20 px-4 py-1.5 rounded-full uppercase tracking-widest">Day {day.day}</h4>
                                                    <div className="h-px bg-gray-200 flex-1" />
                                                </div>
                                                <div className="space-y-3">
                                                    {Object.entries(day.meals).map(([mealType, item]: [string, any], mIdx: number) => (
                                                        <div key={mIdx} className="bg-white rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                                            <div className="sm:w-36 h-32 sm:h-auto bg-gray-100 relative overflow-hidden shrink-0">
                                                                {item.recipe.imageUrl ? (
                                                                    <img src={item.recipe.imageUrl} alt={item.recipe.title} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
                                                                )}
                                                                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black text-brand-dark">
                                                                    <MealTypeIcon type={mealType} /> {mealType}
                                                                </div>
                                                            </div>
                                                            <div className="p-4 flex-1">
                                                                <div className="flex justify-between items-start">
                                                                    <h5 className="font-black text-brand-dark">{item.recipe.title}</h5>
                                                                    <span className="text-sm font-black text-brand-dark bg-brand-light/20 px-2 py-0.5 rounded-lg">₦{item.cost.toFixed(0)}</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                                    {item.products.slice(0, 4).map((prod: any, pIdx: number) => (
                                                                        <span key={pIdx} className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">{prod.name}</span>
                                                                    ))}
                                                                    {item.products.length > 4 && <span className="text-[10px] text-brand-dark font-black">+{item.products.length - 4} more</span>}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={addAllToCart} className="w-full bg-brand-dark text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg">
                                        <ShoppingCart size={18} className="text-brand-light" />
                                        Add All Ingredients to Cart ({plan.days.length} days)
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[400px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl p-10">
                                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-5">
                                        <ChefHat size={36} className="text-amber-400" />
                                    </div>
                                    <h3 className="text-lg font-black text-brand-dark mb-2">Ready to plan your meals?</h3>
                                    <p className="text-sm text-gray-400 text-center max-w-xs">Set your budget and duration, then tap Generate to get a smart meal plan.</p>
                                    <div className="mt-6 flex gap-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"><Sun size={12} /> Breakfast</span>
                                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"><Sun size={12} /> Lunch</span>
                                        <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"><Sunset size={12} /> Dinner</span>
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
