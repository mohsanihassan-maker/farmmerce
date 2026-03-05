import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Timer, ArrowRight, CheckCircle2, X, ShoppingBag, ChevronUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * GroupBuyingSection — Seasonal floating panel.
 * Visibility is controlled from the backend (/api/group-deals/panel-enabled).
 * Admins toggle it on/off from the Dashboard > Group Deals tab.
 */
export default function GroupBuyingSection() {
    const [panelEnabled, setPanelEnabled] = useState(false);
    const [deals, setDeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if admin has enabled the floating panel
        fetch('http://localhost:3000/api/group-deals/panel-enabled')
            .then(res => res.json())
            .then(data => {
                setPanelEnabled(data.enabled);
                if (data.enabled) {
                    // Fetch active deals
                    fetch('http://localhost:3000/api/group-deals')
                        .then(res => res.json())
                        .then(d => setDeals(d));
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    // Don't render if: panel disabled by admin, still loading, no deals, or user dismissed
    if (loading || !panelEnabled || deals.length === 0 || dismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 120 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 120 }}
                transition={{ type: 'spring', damping: 22, stiffness: 200, delay: 1.2 }}
                className="fixed bottom-6 right-6 z-50 w-[340px] max-h-[80vh] flex flex-col"
            >
                {/* Panel Header — always visible */}
                <div
                    onClick={() => setIsOpen(prev => !prev)}
                    className="flex items-center justify-between bg-brand-dark border border-brand-light/30 rounded-t-3xl px-5 py-4 cursor-pointer select-none shadow-2xl"
                    style={{
                        borderBottomLeftRadius: isOpen ? 0 : '1.5rem',
                        borderBottomRightRadius: isOpen ? 0 : '1.5rem',
                        borderBottomWidth: isOpen ? 0 : 1
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        <div>
                            <p className="text-[10px] font-black text-brand-light uppercase tracking-[0.2em]">Seasonal Offer</p>
                            <p className="text-white font-black text-sm leading-tight">Group Buy Deals 🔥</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-brand-mars/20 border border-brand-mars/40 text-brand-mars text-[10px] font-black rounded-lg uppercase">
                            {deals.length} Live
                        </span>
                        <X
                            size={16}
                            className="text-gray-500 hover:text-white transition-colors"
                            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
                        />
                        {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                    </div>
                </div>

                {/* Expandable Body */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="panel-body"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="bg-brand-dark border border-brand-light/30 border-t-0 rounded-b-3xl overflow-y-auto shadow-2xl"
                            style={{ maxHeight: '60vh' }}
                        >
                            <div className="p-4 space-y-3">
                                {deals.map((deal, idx) => (
                                    <FloatingDealCard key={deal.id} deal={deal} index={idx} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}

function useCountdown(expiresAt: string) {
    const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number } | null>(null);

    useEffect(() => {
        const calculate = () => {
            const diff = new Date(expiresAt).getTime() - new Date().getTime();
            if (diff <= 0) return null;
            return {
                h: Math.floor(diff / (1000 * 60 * 60)),
                m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((diff % (1000 * 60)) / 1000)
            };
        };

        setTimeLeft(calculate());
        const timer = setInterval(() => {
            const next = calculate();
            setTimeLeft(next);
            if (!next) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    return timeLeft;
}

function FloatingDealCard({ deal, index }: { deal: any, index: number }) {
    const activeGroup = deal.groups?.[0];
    const memberCount = activeGroup?.members?.length || 0;
    const progress = Math.min((memberCount / deal.minParticipants) * 100, 100);
    const isSuccess = activeGroup?.status === 'SUCCESS';
    const countdown = useCountdown(activeGroup?.expiresAt || new Date(Date.now() + deal.durationHours * 3600000).toISOString());

    const [loadingAction, setLoadingAction] = useState(false);
    const { user } = useAuth();

    const handleAction = async () => {
        if (!user) { alert('Please login to participate in group deals!'); return; }
        setLoadingAction(true);
        try {
            const endpoint = activeGroup
                ? `http://localhost:3000/api/group-deals/groups/${activeGroup.id}/join`
                : `http://localhost:3000/api/group-deals/${deal.id}/start`;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id })
            });

            if (res.ok) {
                alert(activeGroup ? 'Successfully joined the group!' : 'Group started! Invite your friends.');
                window.location.reload();
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to complete action');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleWhatsAppShare = () => {
        const text = `Hey! Join my group buy for "${deal.title}" on Fammerce for just ₦${deal.discountPrice.toLocaleString()}! We need ${deal.minParticipants - memberCount} more people. Join here: ${window.location.origin}/market`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/5 border ${activeGroup ? 'border-brand-mars/50' : 'border-white/10'} rounded-2xl overflow-hidden`}
        >
            {/* Product image strip */}
            <div className="relative h-28 overflow-hidden">
                <img
                    src={deal.imageUrl || deal.product.imageUrl}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                    <p className="text-white font-black text-sm leading-tight line-clamp-1">{deal.title}</p>
                    <span className="bg-brand-mars text-white px-2 py-0.5 rounded-lg font-black text-[10px] shrink-0 ml-2">
                        SAVE ₦{(deal.originalPrice - deal.discountPrice).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="p-3 space-y-3">
                {/* Price row */}
                <div className="flex items-center gap-2">
                    <span className="text-brand-light font-black text-lg">₦{Number(deal.discountPrice).toLocaleString()}</span>
                    <span className="text-gray-500 text-xs line-through">₦{Number(deal.originalPrice).toLocaleString()}</span>
                </div>

                {/* Progress */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 text-brand-yellow text-[10px] font-black uppercase">
                            <Users className="w-3 h-3" />
                            {memberCount}/{deal.minParticipants} Joined
                        </div>
                        <div className="flex items-center gap-1 text-gray-500 text-[10px] font-bold">
                            <Timer className="w-3 h-3" />
                            {countdown ? `${String(countdown.h).padStart(2, '0')}:${String(countdown.m).padStart(2, '0')}:${String(countdown.s).padStart(2, '0')}` : 'Expired'}
                        </div>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${isSuccess ? 'bg-green-400' : 'bg-brand-yellow'}`}
                        />
                    </div>
                </div>

                {/* Actions */}
                {isSuccess ? (
                    <div className="flex items-center justify-center gap-2 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" />
                        Deal Unlocked!
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleAction}
                            disabled={loadingAction || !countdown}
                            className={`flex-1 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-1 ${!countdown ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-brand-light text-brand-dark hover:bg-white'}`}
                        >
                            <ShoppingBag className="w-3 h-3" />
                            {loadingAction ? 'Wait...' : !countdown ? 'Expired' : memberCount > 0 ? 'Join Group' : 'Start Group'}
                        </button>
                        <button
                            onClick={handleWhatsAppShare}
                            className="px-3 py-2.5 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] rounded-xl font-black text-[10px] hover:bg-[#25D366] hover:text-white transition-all"
                        >
                            WA
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
