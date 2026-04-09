import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, CheckCircle, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import { API_URL } from '../config';

export default function Checkout() {
    const { items, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        zip: '',
        paymentMethod: 'card'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) {
                navigate('/login');
                return;
            }

            const orderData = {
                buyerId: user.id || 1,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                })),
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
                paymentMethod: formData.paymentMethod
            };

            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const order = await response.json();

                if (formData.paymentMethod === 'card') {
                    // Initialize Payment
                    const payRes = await fetch(`${API_URL}/payments/initialize`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderId: order.id,
                            email: user.email,
                            amount: cartTotal
                        })
                    });

                    const payData = await payRes.json();

                    if (payRes.ok) {
                        // Real Paystack Integration using Inline JS
                        const handler = (window as any).PaystackPop.setup({
                            key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, 
                            email: user.email,
                            amount: cartTotal * 100, // Convert to Kobo
                            ref: payData.reference,
                            callback: async (response: any) => {
                                // Verify Payment on Backend
                                const verifyRes = await fetch(`${API_URL}/payments/verify`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        reference: response.reference,
                                        orderId: order.id
                                    })
                                });

                                if (verifyRes.ok) {
                                    clearCart();
                                    alert('Order Placed and Paid Successfully!');
                                    navigate('/orders');
                                } else {
                                    alert('Payment verification failed. Please contact support.');
                                }
                            },
                            onClose: () => {
                                alert('Transaction was not completed, window closed.');
                                setLoading(false);
                            }
                        });
                        handler.openIframe();
                        return; // Wait for callback
                    } else {
                        alert(`Payment Init Failed: ${payData.error || 'Unknown error'}`);
                        return;
                    }
                }

                clearCart();
                alert('Order Placed Successfully!');
                navigate('/orders');
            } else {
                const error = await response.json();
                alert(`Checkout Failed: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-brand-dark/5 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <Navbar />
            <div className="max-w-7xl mx-auto mt-16">
                <div className="flex items-center gap-4 mb-10">
                    <button onClick={() => navigate('/cart')} className="p-2 hover:bg-white rounded-full transition-colors text-brand-dark">
                        <ShoppingBag size={24} />
                    </button>
                    <h1 className="text-4xl font-bold text-brand-dark tracking-tight">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Forms */}
                    <div className="space-y-8">
                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
                            {/* Shipping Address */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-brand-dark/5 border border-brand-dark/5">
                                <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-brand-light/30 rounded-xl text-brand-dark">
                                        <MapPin size={24} />
                                    </div>
                                    Shipping Details
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-brand-dark/60 mb-2 ml-1 uppercase tracking-wider">Street Address</label>
                                        <input
                                            required
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-light focus:border-brand-dark/10 outline-none transition-all"
                                            placeholder="123 Farm Lane"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-brand-dark/60 mb-2 ml-1 uppercase tracking-wider">City</label>
                                            <input
                                                required
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-light focus:border-brand-dark/10 outline-none transition-all"
                                                placeholder="Lagos"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-brand-dark/60 mb-2 ml-1 uppercase tracking-wider">State</label>
                                            <input
                                                required
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-light focus:border-brand-dark/10 outline-none transition-all"
                                                placeholder="Lagos"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-brand-dark/5 border border-brand-dark/5">
                                <h2 className="text-2xl font-bold text-brand-dark mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-brand-yellow/30 rounded-xl text-brand-yellow-dark">
                                        <CreditCard size={24} />
                                    </div>
                                    Payment Method
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className={`relative flex flex-col p-6 rounded-3xl cursor-pointer transition-all border-2 ${formData.paymentMethod === 'card' ? 'border-brand-dark bg-brand-dark/5 shadow-inner' : 'border-gray-100 hover:border-brand-light hover:shadow-md'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={formData.paymentMethod === 'card'}
                                            onChange={handleChange}
                                            className="absolute top-4 right-4 w-5 h-5 accent-brand-dark"
                                        />
                                        <div className={`mb-4 transition-colors ${formData.paymentMethod === 'card' ? 'text-brand-dark' : 'text-brand-dark/40'}`}><CreditCard size={32} /></div>
                                        <span className="block font-black text-brand-dark text-lg drop-shadow-sm">Card Payment</span>
                                        <span className="block text-sm text-gray-400 mt-1 font-medium">Paystack / Flutterwave</span>
                                    </label>

                                    <label className={`relative flex flex-col p-6 rounded-3xl cursor-pointer transition-all border-2 ${formData.paymentMethod === 'cod' ? 'border-brand-dark bg-brand-dark/5 shadow-inner' : 'border-gray-100 hover:border-brand-light hover:shadow-md'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleChange}
                                            className="absolute top-4 right-4 w-5 h-5 accent-brand-dark"
                                        />
                                        <div className={`mb-4 transition-colors ${formData.paymentMethod === 'cod' ? 'text-brand-dark' : 'text-brand-dark/40'}`}><Truck size={32} /></div>
                                        <span className="block font-black text-brand-dark text-lg drop-shadow-sm">Pay on Delivery</span>
                                        <span className="block text-sm text-gray-400 mt-1 font-medium">Cash or Transfer</span>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div>
                        <div className="bg-brand-dark p-8 rounded-[2.5rem] text-white shadow-2xl sticky top-24">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <ShoppingBag className="text-brand-light" />
                                Order Summary
                            </h2>
                            <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex gap-4">
                                        <div className="flex-shrink-0 w-16 h-16 bg-white/10 rounded-2xl overflow-hidden p-1">
                                            <img
                                                src={item.product?.imageUrl || "https://placehold.co/200"}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-white truncate">{item.product?.name}</h3>
                                                <p className="font-bold text-brand-light ml-2">₦{(Number(item.product?.price) * item.quantity).toLocaleString()}</p>
                                            </div>
                                            <p className="text-gray-400 text-sm">{item.quantity} x ₦{Number(item.product?.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-4">
                                <div className="flex justify-between text-gray-400 font-medium">
                                    <p>Subtotal</p>
                                    <p>₦{cartTotal.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between text-gray-400 font-medium">
                                    <p>Shipping</p>
                                    <p className="text-brand-light">FREE</p>
                                </div>
                                <div className="flex justify-between text-3xl font-bold text-brand-light border-t border-white/10 pt-6">
                                    <p>Total</p>
                                    <p>₦{cartTotal.toLocaleString()}</p>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-light text-brand-dark py-5 rounded-2xl font-bold text-xl mt-10 hover:bg-white transition-all transform hover:scale-[1.02] shadow-xl shadow-brand-light/10 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? 'Processing...' : (
                                    <>
                                        <span>Confirm Order</span>
                                        <CheckCircle size={24} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
