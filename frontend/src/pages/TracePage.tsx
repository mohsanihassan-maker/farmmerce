import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, User, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';

export default function TracePage() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/trace/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Product not found');
                return res.json();
            })
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-light mb-4"></div>
                <p className="text-white font-bold text-xl tracking-wide">Tracing Product Origin...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-red-500/10 p-6 rounded-[2.5rem] border border-red-500/20">
                    <h2 className="text-2xl font-bold text-red-500 mb-2">Trace Failed</h2>
                    <p className="text-gray-400">{error}</p>
                    <a href="/market" className="mt-6 inline-block bg-white text-brand-dark px-8 py-3 rounded-2xl font-bold">Back to Marketplace</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-dark/5 font-sans py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-brand-dark/5 overflow-hidden border border-brand-dark/5">
                {/* Header */}
                <div className="bg-brand-dark px-8 py-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.08]">
                        <img src="/pattern.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="relative z-10">
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">Fammerce Trace</h1>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-light/20 rounded-full border border-brand-light/30">
                            <CheckCircle className="text-brand-light" size={16} />
                            <span className="text-brand-light font-bold text-sm tracking-wide">Verified Farm-to-Table Journey</span>
                        </div>
                    </div>
                </div>

                {/* Product Info */}
                <div className="px-10 py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12 border-b border-gray-100 pb-12">
                        <div className="relative">
                            <div className="absolute -inset-2 bg-brand-light/30 rounded-full blur-lg animate-pulse"></div>
                            <img
                                src={data.imageUrl || "https://placehold.co/200"}
                                alt={data.productName}
                                className="w-40 h-40 rounded-full object-cover shadow-2xl relative border-4 border-white"
                            />
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <div className="mb-4">
                                <span className="text-xs font-black text-brand-dark/40 uppercase tracking-[0.2em]">{data.category}</span>
                                <h2 className="text-4xl font-extrabold text-brand-dark mt-1">{data.productName}</h2>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="px-4 py-2 bg-brand-dark/5 rounded-2xl border border-brand-dark/10 flex items-center gap-2">
                                    <MapPin size={18} className="text-brand-dark/60" />
                                    <span className="font-bold text-brand-dark">{data.farm.location}</span>
                                </div>
                                <div className="px-4 py-2 bg-brand-light/20 rounded-2xl border border-brand-light/30 flex items-center gap-2">
                                    <CheckCircle size={18} className="text-brand-dark" />
                                    <span className="font-bold text-brand-dark">Blockchain Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sustainability Impact */}
                    <div className="mb-12 p-8 bg-brand-dark rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-brand-light/20 transition-all duration-700"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-3">
                                    <div className="p-2 bg-brand-light rounded-xl text-brand-dark">
                                        <CheckCircle size={22} />
                                    </div>
                                    Green Impact
                                </h3>
                                <p className="text-gray-400 mt-2 max-w-xs text-lg">Your support for local farms reduced CO2 emissions significantly.</p>
                            </div>
                            <div className="text-right">
                                <span className="text-6xl font-black text-brand-light tracking-tighter">{data.co2Saved || '1.2'}</span>
                                <span className="text-xs block text-gray-400 font-bold uppercase tracking-widest mt-1">kg CO2 Saved</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Farm Details */}
                        <div>
                            <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                                <User className="text-brand-dark/40" size={24} />
                                The Grower
                            </h3>
                            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                <p className="font-black text-2xl text-brand-dark mb-1">{data.farm.name}</p>
                                <p className="text-brand-dark/60 font-medium">{data.farm.location}</p>
                                <div className="mt-6 p-4 bg-white rounded-2xl border border-gray-100 italic text-gray-600 relative">
                                    <span className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-black uppercase text-gray-400">Bio</span>
                                    "{data.farm.bio}"
                                </div>
                            </div>
                        </div>

                        {/* Journey Timeline */}
                        <div>
                            <h3 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                                <Calendar className="text-brand-dark/40" size={24} />
                                Journey Timeline
                            </h3>
                            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex-1">
                                <div className="space-y-10 relative before:absolute before:inset-0 before:left-3 before:border-l-2 before:border-dashed before:border-brand-dark/10">
                                    {(data.journey || []).map((step: any, idx: number) => (
                                        <div key={idx} className="relative pl-10 group/step">
                                            <div className="absolute left-0 top-1 w-6 h-6 bg-white border-4 border-brand-dark rounded-full z-10 group-hover/step:bg-brand-light transition-colors duration-300"></div>
                                            <p className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest mb-1">
                                                {new Date(step.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            <h4 className="text-lg font-bold text-brand-dark">{step.stage}</h4>
                                            <p className="text-sm text-brand-dark/60 font-medium">{step.location}</p>
                                            {step.description && (
                                                <p className="mt-2 text-xs text-gray-500 italic bg-gray-100 p-2 rounded-lg border border-gray-200">
                                                    {step.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-6 flex items-center justify-center gap-3">
                    <img src="/mark.png" alt="Farmmerce" className="h-5 w-5 object-contain opacity-40" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Powered by Farmmerce Blockchain Transparency Protocol
                    </p>
                </div>
            </div>
        </div>
    );
}
