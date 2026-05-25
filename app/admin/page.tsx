'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabase';

import AdminSidebar from '../components/AdminSidebar';

interface OrderDetail {
    orderId: string;
    total: number;
    date: string;
    customer: {
        name: string;
    };
    status: 'Pending' | 'Active' | 'Completed';
}

export default function AdminDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [recentOrder, setRecentOrder] = useState<OrderDetail | null>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, activeCustomers: 0 });

    useEffect(() => {
        // Auth Guard
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin/login');
        } else {
            const fetchDashboardData = async () => {
                // Fetch Recent Orders for Stats Calculation
                const { data: recOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
                
                if (recOrders && recOrders.length > 0) {
                    let totalRev = 0;
                    let uniqueCustomers = new Set();
                    
                    recOrders.forEach(o => {
                        totalRev += Number(o.total_price);
                        uniqueCustomers.add(o.customer_whatsapp);
                    });
                    
                    setStats({
                        totalRevenue: totalRev,
                        totalOrders: recOrders.length,
                        activeCustomers: uniqueCustomers.size
                    });

                    setRecentOrder({
                        orderId: recOrders[0].id,
                        total: Number(recOrders[0].total_price),
                        date: recOrders[0].created_at,
                        customer: { name: recOrders[0].customer_name },
                        status: recOrders[0].status as 'Pending' | 'Active' | 'Completed'
                    });
                }
                
                // Fetch Top Products
                const { data: prods } = await supabase.from('products').select('*').limit(4);
                if (prods) setProducts(prods);

                setIsLoading(false);
            };
            fetchDashboardData();
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
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 h-screen">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Overview</h2>
                        <p className="text-gray-400 mt-1">Welcome back, Admin</p>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
                                <h3 className="text-2xl font-bold">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h3>
                            </div>
                            <div className="p-3 bg-green-500/20 text-green-400 rounded-xl">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                        </div>
                        <p className="text-green-400 text-sm mt-4 flex items-center gap-1 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            Updated Sync
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Total Orders</p>
                                <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                            </div>
                            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            </div>
                        </div>
                        <p className="text-blue-400 text-sm mt-4 flex items-center gap-1 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            Updated Sync
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-medium mb-1">Active Customers</p>
                                <h3 className="text-2xl font-bold">{stats.activeCustomers}</h3>
                            </div>
                            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                        </div>
                        <p className="text-purple-400 text-sm mt-4 flex items-center gap-1 font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            Updated Sync
                        </p>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Orders Table */}
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Recent Orders</h3>
                            <button className="text-blue-400 text-sm hover:text-blue-300">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400 text-sm">
                                        <th className="pb-3 font-medium">Order ID</th>
                                        <th className="pb-3 font-medium">Customer</th>
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium text-right">Amount</th>
                                        <th className="pb-3 font-medium text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrder && (
                                        <tr className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                                            <td className="py-4 font-medium">{recentOrder.orderId}</td>
                                            <td className="py-4 text-gray-300">{recentOrder.customer.name}</td>
                                            <td className="py-4 text-gray-400 text-sm">
                                                {new Date(recentOrder.date).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="py-4 text-right font-medium">Rp {recentOrder.total.toLocaleString('id-ID')}</td>
                                            <td className="py-4 text-center">
                                                {recentOrder.status === 'Pending' && (
                                                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/20">
                                                        Pending
                                                    </span>
                                                )}
                                                {recentOrder.status === 'Active' && (
                                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                                                        Active/Rented
                                                    </span>
                                                )}
                                                {recentOrder.status === 'Completed' && (
                                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
                                                        Returned
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {!recentOrder && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                No recent orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-6">Top Products</h3>
                        <div className="space-y-6">
                            {products.slice(0, 4).map((product, index) => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 relative shrink-0">
                                        <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <span className="text-white font-bold text-xs bg-black/50 px-2 py-0.5 rounded-full">#{index + 1}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate text-gray-200">{product.name}</h4>
                                        <p className="text-sm text-blue-400 font-medium">Rp {product.price.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
