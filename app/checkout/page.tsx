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

    // Helper to get local date string for HTML date input min attribute
    const getLocalDateString = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayStr = getLocalDateString();

    // Calculate rental duration in days (inclusive of end date)
    const getRentalDays = () => {
        if (!formData.startDate) return 0;
        if (!formData.endDate) return 1;

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (end < start) return 1;

        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1;
    };

    const rentalDays = getRentalDays();

    const subtotal = cartTotal * rentalDays;

    // Promo code state
    const [promoCode, setPromoCode] = useState('');
    const [appliedCode, setAppliedCode] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [isPromoApplied, setIsPromoApplied] = useState(false);

    // Dynamic discount calculation
    let discountAmount = 0;
    if (isPromoApplied) {
        if (appliedCode === 'HTAN10') {
            discountAmount = Math.round(subtotal * 0.1);
        } else if (appliedCode === 'DISKON20') {
            discountAmount = Math.round(subtotal * 0.2);
        } else if (appliedCode === 'EVENTSERU') {
            discountAmount = Math.min(subtotal, 50000);
        } else if (appliedCode === 'SITEFEST') {
            discountAmount = Math.round(subtotal * 0.75);
        }
    }

    const finalTotal = subtotal - discountAmount;

    const handleApplyPromo = () => {
        if (!formData.startDate) {
            setPromoError('Silakan pilih tanggal mulai sewa terlebih dahulu.');
            return;
        }
        setPromoError('');
        const code = promoCode.trim().toUpperCase();

        if (code === 'HTAN10') {
            setDiscountPercent(10);
            setAppliedCode(code);
            setIsPromoApplied(true);
        } else if (code === 'DISKON20') {
            setDiscountPercent(20);
            setAppliedCode(code);
            setIsPromoApplied(true);
        } else if (code === 'EVENTSERU') {
            setDiscountPercent(0);
            setAppliedCode(code);
            setIsPromoApplied(true);
        } else if (code === 'SITEFEST') {
            setDiscountPercent(75);
            setAppliedCode(code);
            setIsPromoApplied(true);
        } else {
            setPromoError('Kode promo tidak valid.');
        }
    };

    const handleRemovePromo = () => {
        setPromoCode('');
        setAppliedCode('');
        setDiscountPercent(0);
        setIsPromoApplied(false);
        setPromoError('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const nextData = { ...prev, [name]: value };
            // If start date is selected and end date is empty, default end date to start date
            if (name === 'startDate' && !nextData.endDate) {
                nextData.endDate = nextData.startDate;
            }
            // Automatically adjust end date if it is before start date
            if (name === 'startDate' && nextData.endDate && nextData.startDate > nextData.endDate) {
                nextData.endDate = nextData.startDate;
            }
            return nextData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (cart.length === 0) return;
        setIsSubmitting(true);

        try {
            // 1. Insert Order
            const orderId = `ORD-${Date.now()}`;
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{
                    id: orderId,
                    customer_name: formData.name,
                    customer_whatsapp: formData.whatsapp,
                    customer_address: formData.address,
                    start_date: formData.startDate,
                    end_date: formData.endDate,
                    total_price: finalTotal,
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
                total: finalTotal,
                subtotal: subtotal,
                customer: formData,
                orderId: orderData.id,
                date: orderData.created_at,
                status: 'Pending',
                discountCode: isPromoApplied ? appliedCode : null,
                discountAmount: discountAmount,
                discountPercent: discountPercent
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
                        {/* Promo Code Input */}
                        <div className="border-t border-white/10 pt-6 mt-6">
                            <label htmlFor="promoCodeInput" className="block text-sm font-medium text-gray-300 mb-2">Kode Diskon / Promo</label>
                            <div className="flex gap-2">
                                <input
                                    id="promoCodeInput"
                                    type="text"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    placeholder="Masukkan kode promo"
                                    className="flex-grow px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm transition-colors"
                                    disabled={isSubmitting || isPromoApplied}
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyPromo}
                                    disabled={isSubmitting || !promoCode.trim() || isPromoApplied}
                                    className={`px-5 py-2.5 font-bold rounded-xl text-sm transition-all active:scale-95 ${isPromoApplied
                                        ? 'bg-green-600 text-white cursor-default'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:pointer-events-none'
                                        }`}
                                >
                                    {isPromoApplied ? 'Applied' : 'Apply'}
                                </button>
                            </div>
                            {promoError && <p className="text-red-400 text-xs mt-1.5">{promoError}</p>}
                            {isPromoApplied && (
                                <div className="flex justify-between items-center mt-3 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl">
                                    <span>Promo "{appliedCode}" berhasil dipasang!</span>
                                    <button
                                        type="button"
                                        onClick={handleRemovePromo}
                                        className="text-red-400 hover:text-red-300 font-bold underline"
                                    >
                                        Hapus
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-white/10 pt-4 mt-6 flex flex-col gap-2.5">
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <span>Biaya Sewa / Hari</span>
                                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-400">
                                <span>Durasi Sewa</span>
                                <span className="font-semibold text-white">
                                    {rentalDays > 0 ? `${rentalDays} Hari` : 'Pilih tanggal mulai'}
                                </span>
                            </div>
                            {rentalDays > 1 && (
                                <div className="flex justify-between items-center text-sm text-gray-400">
                                    <span>Subtotal ({rentalDays} hari)</span>
                                    <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            {isPromoApplied && rentalDays > 0 && (
                                <div className="flex justify-between items-center text-sm text-green-400">
                                    <span>Potongan Promo {discountPercent > 0 ? `(${discountPercent}%)` : ''}</span>
                                    <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span className="text-2xl font-bold text-blue-400">
                                    {rentalDays > 0 ? `Rp ${finalTotal.toLocaleString('id-ID')}` : '-'}
                                </span>
                            </div>
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
                                        min={todayStr}
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
                                        min={formData.startDate || todayStr}
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
                                className={`w-full text-white font-bold py-4 rounded-xl transition-colors shadow-lg mt-4 flex justify-center items-center gap-2 ${isSubmitting ? 'bg-blue-800 opacity-70 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
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
