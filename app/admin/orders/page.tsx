'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';

interface OrderDetail {
    orderId: string;
    total: number;
    date: string;
    customer: {
        name: string;
        whatsapp: string;
        address: string;
        startDate: string;
        endDate: string;
    };
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }>;
    status?: string;
}

export default function AdminOrders() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<OrderDetail[]>([]);

    const handleValidateOrder = (orderId: string) => {
        const storedOrderStr = localStorage.getItem('htan_last_order');
        if (storedOrderStr) {
            const parsed = JSON.parse(storedOrderStr);
            if (parsed.orderId === orderId) {
                parsed.status = 'validated';
                localStorage.setItem('htan_last_order', JSON.stringify(parsed));
                setOrders(prevOrders => 
                    prevOrders.map(o => o.orderId === orderId ? { ...o, status: 'validated' } : o)
                );
            }
        }
    };

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin/login');
        } else {
            setTimeout(() => setIsLoading(false), 0);
            const storedOrder = localStorage.getItem('htan_last_order');
            if (storedOrder) {
                // In a real app this would be an array of all orders
                setOrders([JSON.parse(storedOrder)]);
            }
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex text-white relative overflow-hidden">
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <AdminSidebar />

            <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 h-screen">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Orders Management</h2>
                        <p className="text-gray-400 mt-1">View and manage customer orders</p>
                    </div>
                </header>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="pb-3 font-medium">Order ID</th>
                                    <th className="pb-3 font-medium">Customer Details</th>
                                    <th className="pb-3 font-medium">Rental Period</th>
                                    <th className="pb-3 font-medium">Items</th>
                                    <th className="pb-3 font-medium text-right">Total Amount</th>
                                    <th className="pb-3 font-medium text-center">Status</th>
                                    <th className="pb-3 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.orderId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 font-medium">{order.orderId}</td>
                                        <td className="py-4">
                                            <p className="text-gray-200">{order.customer.name}</p>
                                            <p className="text-gray-400 text-xs">{order.customer.whatsapp}</p>
                                        </td>
                                        <td className="py-4 text-sm text-gray-300">
                                            {order.customer.startDate} - {order.customer.endDate}
                                        </td>
                                        <td className="py-4 text-sm text-gray-300">
                                            {order.items.length} item(s)
                                        </td>
                                        <td className="py-4 text-right font-medium text-blue-400">
                                            Rp {order.total.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-4 text-center">
                                            {order.status === 'validated' ? (
                                                <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium border border-green-500/20">
                                                    Validated
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-medium border border-yellow-500/20">
                                                    Pending processing
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {order.status !== 'validated' ? (
                                                    <button 
                                                        onClick={() => handleValidateOrder(order.orderId)}
                                                        className="text-green-400 hover:text-green-300 text-sm font-medium px-3 py-1 bg-green-500/10 rounded-lg transition-colors border border-green-500/20"
                                                    >
                                                        Validasi
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => router.push(`/invoice/${order.orderId}`)}
                                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-1 bg-blue-500/10 rounded-lg transition-colors border border-blue-500/20"
                                                    >
                                                        View Invoice
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-400">
                                            No orders found. Customers need to place orders first!
                                        </td>
                                    </tr>
                                )}

                                {/* Dummy Data */}
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors opacity-75">
                                    <td className="py-4 font-medium">ORD-1703421250000</td>
                                    <td className="py-4">
                                        <p className="text-gray-200">Budi Santoso</p>
                                        <p className="text-gray-400 text-xs">08123456789</p>
                                    </td>
                                    <td className="py-4 text-sm text-gray-300">
                                        2026-03-20 - 2026-03-25
                                    </td>
                                    <td className="py-4 text-sm text-gray-300">
                                        2 item(s)
                                    </td>
                                    <td className="py-4 text-right font-medium text-blue-400">
                                        Rp 4.500.000
                                    </td>
                                    <td className="py-4 text-center">
                                        <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-medium border border-green-500/20">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="py-4 text-center">
                                        <button className="text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-1 bg-blue-500/10 rounded-lg transition-colors border border-blue-500/20">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
