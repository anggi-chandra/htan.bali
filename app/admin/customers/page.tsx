'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../../utils/supabase';

interface CustomerDetail {
    id: string;
    name: string;
    whatsapp: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    joinDate: string;
}

export default function AdminCustomers() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [customers, setCustomers] = useState<CustomerDetail[]>([]);

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin/login');
        } else {
            loadCustomers();
        }
    }, [router]);

    const loadCustomers = async () => {
        setIsLoading(true);
        // Fetch all orders to map unique customers based on Whatsapp number
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: true }); // Oldest first to capture Join Date

        if (!error && data) {
            const customerMap = new Map<string, CustomerDetail>();
            
            data.forEach((order) => {
                const phone = order.customer_whatsapp;
                
                if (!customerMap.has(phone)) {
                    customerMap.set(phone, {
                        id: `CUST-${phone.slice(-4)}`, // Fallback generation ID
                        name: order.customer_name,
                        whatsapp: phone,
                        address: order.customer_address,
                        totalOrders: 1,
                        totalSpent: Number(order.total_price),
                        joinDate: new Date(order.created_at).toLocaleDateString('id-ID')
                    });
                } else {
                    const existing = customerMap.get(phone)!;
                    existing.totalOrders += 1;
                    existing.totalSpent += Number(order.total_price);
                    // Name and address retains the first interaction values
                }
            });
            
            // Convert to Array and reverse so newest interactions show first, or keep standard sorted
            setCustomers(Array.from(customerMap.values()).reverse());
        }
        setIsLoading(false);
    };

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
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Customers</h2>
                        <p className="text-gray-400 mt-1">Manage your customer relationships</p>
                    </div>
                </header>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="pb-3 font-medium">Customer Info</th>
                                    <th className="pb-3 font-medium">Contact</th>
                                    <th className="pb-3 font-medium">Address</th>
                                    <th className="pb-3 font-medium text-center">Total Orders</th>
                                    <th className="pb-3 font-medium text-right">Total Spent</th>
                                    <th className="pb-3 font-medium text-right">Join Date</th>
                                    <th className="pb-3 font-medium text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((cust) => (
                                    <tr key={cust.whatsapp} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30">
                                                    {cust.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-200">{cust.name}</p>
                                                    <p className="text-gray-500 text-xs">{cust.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-sm text-gray-300">
                                            {cust.whatsapp}
                                        </td>
                                        <td className="py-4 text-sm text-gray-300 max-w-[200px] truncate">
                                            {cust.address}
                                        </td>
                                        <td className="py-4 text-center text-gray-300">
                                            {cust.totalOrders}
                                        </td>
                                        <td className="py-4 text-right font-medium text-blue-400">
                                            Rp {cust.totalSpent.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-4 text-right text-sm text-gray-400">
                                            {cust.joinDate}
                                        </td>
                                        <td className="py-4 text-center">
                                            <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {customers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-400">
                                            Belum ada history pelanggan yang memesan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
