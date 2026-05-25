'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

interface OrderDetails {
    items: any[];
    total: number;
    customer: {
        name: string;
        whatsapp: string;
        startDate: string;
        endDate: string;
        address: string;
    };
    orderId: string;
    date: string;
    subtotal?: number;
    discountCode?: string | null;
    discountAmount?: number;
    discountPercent?: number;
}

export default function OrderConfirmationPage() {
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const { clearCart } = useCart();
    const router = useRouter();

    useEffect(() => {
        const savedOrder = localStorage.getItem('htan_last_order');
        if (savedOrder) {
            setOrder(JSON.parse(savedOrder));
        } else {
            router.push('/');
        }
    }, [router]);

    const handleConfirmWhatsApp = () => {
        if (!order) return;

        const itemsList = order.items
            .map((item) => `- ${item.name} (x${item.quantity})`)
            .join('\n');

        const promoText = order.discountCode
            ? `\n*Promo Code:* ${order.discountCode} (-Rp ${order.discountAmount?.toLocaleString('id-ID')})`
            : '';

        const message = `*New Rental Order*\nOrder ID: ${order.orderId}\n\n*Customer Details:*\nName: ${order.customer.name}\nWhatsApp: ${order.customer.whatsapp}\nDates: ${order.customer.startDate} to ${order.customer.endDate}\nAddress: ${order.customer.address}\n\n*Items:*\n${itemsList}\n${promoText}\n\n*Total Estimate: Rp ${order.total.toLocaleString('id-ID')}*\n\nPlease confirm availability.`;

        const whatsappUrl = `https://wa.me/6282145580460?text=${encodeURIComponent(message)}`;

        // Clear cart after confirming
        clearCart();

        window.open(whatsappUrl, '_blank');
    };

    if (!order) return null;

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full flex-grow">
                <div className="bg-white text-black p-8 rounded-xl shadow-2xl">
                    <div className="text-center mb-8 border-b border-gray-200 pb-8">
                        <h1 className="text-3xl font-bold mb-2">Order Receipt</h1>
                        <p className="text-gray-500">Order ID: {order.orderId}</p>
                        <p className="text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Customer Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Name</p>
                                <p className="font-medium">{order.customer.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">WhatsApp</p>
                                <p className="font-medium">{order.customer.whatsapp}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Rental Period</p>
                                <p className="font-medium">{order.customer.startDate} - {order.customer.endDate}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500">Delivery Address</p>
                                <p className="font-medium">{order.customer.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Items</h3>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-left">
                                    <th className="py-2 font-medium text-gray-500">Item</th>
                                    <th className="py-2 font-medium text-gray-500 text-center">Qty</th>
                                    <th className="py-2 font-medium text-gray-500 text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item: any) => (
                                    <tr key={item.id} className="border-b border-gray-100">
                                        <td className="py-3">{item.name}</td>
                                        <td className="py-3 text-center">{item.quantity}</td>
                                        <td className="py-3 text-right">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                {order.discountCode && (
                                    <>
                                        <tr className="border-t border-gray-200">
                                            <td colSpan={2} className="py-2 text-gray-500 font-medium">Subtotal</td>
                                            <td className="py-2 text-right font-medium text-gray-900">
                                                Rp {(order.subtotal || (order.total + (order.discountAmount || 0))).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                        <tr className="border-b border-gray-100">
                                            <td colSpan={2} className="py-2 text-green-600 font-medium">
                                                Promo: {order.discountCode} {order.discountPercent && order.discountPercent > 0 ? `(${order.discountPercent}%)` : ''}
                                            </td>
                                            <td className="py-2 text-right font-medium text-green-600">
                                                - Rp {order.discountAmount?.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    </>
                                )}
                                <tr>
                                    <td colSpan={2} className="py-4 font-bold text-lg text-gray-900">Total Estimate</td>
                                    <td className="py-4 font-bold text-lg text-right text-gray-900">Rp {order.total.toLocaleString('id-ID')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-8 text-sm text-gray-600">
                        <p><strong>Note:</strong> This is a preliminary receipt. Final availability and delivery costs will be confirmed via WhatsApp.</p>
                    </div>

                    <button
                        onClick={handleConfirmWhatsApp}
                        className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Confirm Order via WhatsApp
                    </button>
                </div>
            </div>

            <Footer />
        </main>
    );
}
