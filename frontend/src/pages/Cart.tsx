import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Cart() {
    const { items, removeFromCart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            if (items.length === 0) return;

            if (!user) {
                // Redirect to login if not authenticated
                navigate('/login');
                return;
            }

            const orderData = {
                buyerId: user.id || 1, // Fallback to 1 only if user.id is missing (shouldn't happen if logged in)
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            };

            const response = await fetch('http://localhost:3000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                alert('Order Placed Successfully! Fresh food is on the way.');
                clearCart();
                navigate('/dashboard');
            } else {
                const error = await response.json();
                alert(`Checkout Failed: ${error.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('Checkout failed due to network error.');
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-medium text-gray-900">Your cart is empty</h2>
                <Link to="/market" className="mt-4 text-primary hover:text-green-700 font-medium">
                    Return to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-brand-dark/5 min-h-screen font-sans py-16">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold text-brand-dark">Your Cart</h1>
                    <span className="bg-brand-light text-brand-dark px-4 py-1.5 rounded-full font-bold text-sm border border-brand-dark/10">
                        {items.length} {items.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                <div className="bg-white shadow-xl shadow-brand-dark/5 rounded-3xl overflow-hidden border border-brand-dark/5">
                    <ul className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <li key={item.productId} className="px-8 py-6 flex items-center hover:bg-gray-50 transition-colors">
                                <div className="flex-shrink-0 h-24 w-24 bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 p-1">
                                    <img src={item.product?.imageUrl || "https://placehold.co/200"} alt="" className="h-full w-full object-cover rounded-xl" />
                                </div>
                                <div className="ml-6 flex-1">
                                    <h3 className="text-xl font-bold text-brand-dark">{item.product?.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        <span className="font-medium text-brand-dark/60">₦{Number(item.product?.price).toLocaleString()}</span>
                                        <span className="mx-2">/</span>
                                        <span>{item.product?.unit}</span>
                                    </p>
                                </div>
                                <div className="ml-4 px-3 py-1 bg-brand-light/30 text-brand-dark rounded-lg font-bold text-sm">
                                    Qty: {item.quantity}
                                </div>
                                <div className="ml-8 text-xl font-bold text-brand-dark">
                                    ₦{(Number(item.product?.price) * item.quantity).toLocaleString()}
                                </div>
                                <div className="ml-6">
                                    <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className="p-2 text-gray-300 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="p-8 bg-brand-dark text-white">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400 font-medium">Order Total</span>
                            <span className="text-3xl font-bold text-brand-light">₦{cartTotal.toLocaleString()}</span>
                        </div>
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full bg-brand-light text-brand-dark py-4 rounded-2xl font-bold text-xl hover:bg-white transition-all transform hover:scale-[1.02] shadow-lg shadow-brand-light/20 flex items-center justify-center gap-3"
                        >
                            <span>Proceed to Checkout</span>
                            <ShoppingBag className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
