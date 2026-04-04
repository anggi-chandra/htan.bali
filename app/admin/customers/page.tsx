'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';

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
            setTimeout(() => setIsLoading(false), 0);
            
            // Generate a customer derived from the latest local storage order if it exists
            const storedOrder = localStorage.getItem('htan_last_order');
            if (storedOrder) {
                const parsedOrder = JSON.parse(storedOrder);
                setCustomers([{
                    id: 'CUST-001',
                    name: parsedOrder.customer.name,
                    whatsapp: parsedOrder.customer.whatsapp,
                    address: parsedOrder.customer.address,
                    totalOrders: 1,
                    totalSpent: parsedOrder.total,
                    joinDate: new Date(parsedOrder.date).toLocaleDateString('id-ID'),
                }]);
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
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Customers</h2>
                        <p className="text-gray-400 mt-1">Manage your customer relationships</p>
                    </div>
                    <div className="relative">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <input 
                            type="text" 
                            placeholder="Search customers..." 
                            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500 w-64 transition-colors"
                        />
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
                                    <tr key={cust.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
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

                                {/* Dummy Customer 1 */}
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors opacity-75">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg border border-purple-500/30">
                                                A
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-200">Andi Saputra</p>
                                                <p className="text-gray-500 text-xs">CUST-002</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-gray-300">08198765432</td>
                                    <td className="py-4 text-sm text-gray-300 max-w-[200px] truncate">Jl. Sudirman No 4, Denpasar</td>
                                    <td className="py-4 text-center text-gray-300">3</td>
                                    <td className="py-4 text-right font-medium text-blue-400">Rp 8.500.000</td>
                                    <td className="py-4 text-right text-sm text-gray-400">10/02/2026</td>
                                    <td className="py-4 text-center">
                                        <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                                
                                {/* Dummy Customer 2 */}
                                <tr className="border-b border-white/5 hover:bg-white/5 transition-colors opacity-75">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-lg border border-green-500/30">
                                                M
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-200">Maria Ulfa</p>
                                                <p className="text-gray-500 text-xs">CUST-003</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 text-sm text-gray-300">08567891234</td>
                                    <td className="py-4 text-sm text-gray-300 max-w-[200px] truncate">Jl. Gatot Subroto No 1A, Badung</td>
                                    <td className="py-4 text-center text-gray-300">1</td>
                                    <td className="py-4 text-right font-medium text-blue-400">Rp 3.500.000</td>
                                    <td className="py-4 text-right text-sm text-gray-400">05/03/2026</td>
                                    <td className="py-4 text-center">
                                        <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
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
