'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';
import { products } from '../../data/products';

export default function AdminProducts() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin/login');
        } else {
            setTimeout(() => setIsLoading(false), 0);
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
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Products Inventory</h2>
                        <p className="text-gray-400 mt-1">Manage your rental catalog</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Product
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-sm group hover:border-blue-500/50 transition-all flex flex-col h-full">
                            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white/10 relative mb-4">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <button className="p-2 bg-black/50 backdrop-blur-md rounded-xl text-white hover:text-blue-400 transition-colors shadow-lg shadow-black/20">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-200 mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{product.description}</p>
                                
                                <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Price per day</p>
                                        <p className="text-blue-400 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
                                        In Stock
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
