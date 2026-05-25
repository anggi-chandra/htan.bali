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
                                            <div className="flex justify-center">
                                                <a 
                                                    href={(() => {
                                                        let cleanPhone = cust.whatsapp.replace(/\D/g, '');
                                                        if (cleanPhone.startsWith('0')) {
                                                            cleanPhone = '62' + cleanPhone.slice(1);
                                                        }
                                                        return `https://wa.me/${cleanPhone}`;
                                                    })()}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 rounded-xl transition-all border border-green-500/20 flex items-center gap-1.5 text-xs font-semibold"
                                                    title="Hubungi via WhatsApp"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                    </svg>
                                                    WhatsApp
                                                </a>
                                            </div>
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
