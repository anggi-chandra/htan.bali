'use client';

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';

export default function CheckoutPage() {
    const { cart, cartTotal } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        startDate: '',
        endDate: '',
        address: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cart.length === 0) return;
        setIsSubmitting(true);
        
        try {
            // 1. Insert Order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                     customer_name: formData.name,
                     customer_whatsapp: formData.whatsapp,
                     customer_address: formData.address,
                     start_date: formData.startDate,
                     end_date: formData.endDate,
                     total_price: cartTotal,
                     status: 'Pending'
                }])
                .select()
                .single();

            if (orderError) {
                console.error('Order Insert Error:', orderError);
                throw new Error('Failed to create order');
            }

            // 2. Insert Order Items mapping
            const orderItemsPayload = cart.map((item) => ({
                order_id: orderData.id,
                product_id: item.id,
                quantity: item.quantity,
                price_at_booking: item.price
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItemsPayload);

            if (itemsError) {
                console.error('Order Items Insert Error:', itemsError);
                throw new Error('Failed to link items to order');
            }

            // 3. Keep local bridging active to seamlessly power /order-confirmation UI without heavy fetches
            const localReceiptCopy = {
                items: cart,
                total: cartTotal,
                customer: formData,
                orderId: orderData.id, // mapped from real DB UUID
                date: orderData.created_at,
                status: 'Pending',
            };
            
            localStorage.setItem('htan_last_order', JSON.stringify(localReceiptCopy));
            router.push('/order-confirmation');

        } catch (err: any) {
            alert(err.message || 'An unexpected error occurred. Please manually contact support.');
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <main className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center pt-20">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h1>
                        <p className="text-gray-400 mb-8">Please add items to your cart before checking out.</p>
                        <a href="/catalog" className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
                            Browse Catalog
                        </a>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Order Summary */}
                    <div className="bg-gray-900/50 p-6 rounded-2xl border border-white/10 h-fit">
                        <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="text-white font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                            <span className="text-lg font-bold text-white">Total</span>
                            <span className="text-2xl font-bold text-blue-400">Rp {cartTotal.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    {/* Checkout Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter your full name"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-2">WhatsApp Number</label>
                                <input
                                    type="tel"
                                    id="whatsapp"
                                    name="whatsapp"
                                    required
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="e.g. 08123456789"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        required
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        required
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">Delivery Address</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    required
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Enter complete delivery address"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full text-white font-bold py-4 rounded-xl transition-colors shadow-lg mt-4 flex justify-center items-center gap-2 ${
                                    isSubmitting ? 'bg-blue-800 opacity-70 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        Processing Order...
                                    </>
                                ) : (
                                    'Generate Receipt & Confirm'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
