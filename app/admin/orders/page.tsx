'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';
import { Product } from '../../data/products';

export interface OrderDetail {
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
    status: 'Pending' | 'Active' | 'Completed';
}

const DUMMY_ORDER: OrderDetail = {
    orderId: 'ORD-' + Date.now(),
    total: 350000,
    date: new Date().toISOString(),
    customer: {
        name: 'Budi Santoso',
        whatsapp: '081234567890',
        address: 'Jl. Denpasar Raya No. 12',
        startDate: '2026-03-25',
        endDate: '2026-03-28'
    },
    items: [
        {
            id: 'ht-baofeng-uv82',
            name: 'Baofeng UV-82',
            price: 25000,
            quantity: 5
        }
    ],
    status: 'Pending'
};

export default function AdminOrders() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<OrderDetail[]>([]);
    
    // Invoice State
    const [invoiceOrder, setInvoiceOrder] = useState<OrderDetail | null>(null);

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin/login');
        } else {
            loadOrders();
            setTimeout(() => setIsLoading(false), 0);
        }
    }, [router]);

    const loadOrders = () => {
        const storedOrdersStr = localStorage.getItem('htan_orders');
        if (storedOrdersStr) {
            setOrders(JSON.parse(storedOrdersStr));
        } else {
            // Seed with dummy order if none exists for testing purposes
            const seeded = [DUMMY_ORDER];
            setOrders(seeded);
            localStorage.setItem('htan_orders', JSON.stringify(seeded));
        }
    };

    const updateProductsStock = (items: OrderDetail['items'], mode: 'deduct' | 'restore') => {
        const storedProducts = localStorage.getItem('adminProducts');
        if(!storedProducts) return;
        
        let products: Product[] = JSON.parse(storedProducts);
        
        items.forEach(orderItem => {
            const productIndex = products.findIndex(p => p.id === orderItem.id);
            if(productIndex !== -1) {
                if (mode === 'deduct') {
                    products[productIndex].stock = Math.max(0, products[productIndex].stock - orderItem.quantity);
                } else if (mode === 'restore') {
                    products[productIndex].stock += orderItem.quantity;
                }
            }
        });

        localStorage.setItem('adminProducts', JSON.stringify(products));
    };

    const handleValidateOrder = (orderId: string) => {
        if (!confirm('Validating this order will deduct the stock from inventory. Continue?')) return;
        
        const updatedOrders = orders.map(o => {
            if (o.orderId === orderId && o.status === 'Pending') {
                updateProductsStock(o.items, 'deduct');
                return { ...o, status: 'Active' as const };
            }
            return o;
        });

        setOrders(updatedOrders);
        localStorage.setItem('htan_orders', JSON.stringify(updatedOrders));
    };

    const handleCompleteOrder = (orderId: string) => {
        if (!confirm('Marking this as returned will restore the items to inventory. Continue?')) return;

        const updatedOrders = orders.map(o => {
            if (o.orderId === orderId && o.status === 'Active') {
                updateProductsStock(o.items, 'restore');
                return { ...o, status: 'Completed' as const };
            }
            return o;
        });

        setOrders(updatedOrders);
        localStorage.setItem('htan_orders', JSON.stringify(updatedOrders));
    };

    const printInvoice = () => {
        const printContent = document.getElementById('invoice-content');
        if(printContent) {
           const originalContents = document.body.innerHTML;
           document.body.innerHTML = printContent.innerHTML;
           window.print();
           document.body.innerHTML = originalContents;
           window.location.reload(); // Quick restore of SPA state
        }
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

            <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 h-screen relative">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Orders Management</h2>
                        <p className="text-gray-400 mt-1">View incoming orders, validate and print invoices.</p>
                    </div>
                </header>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="pb-3 font-medium px-4">Order ID</th>
                                    <th className="pb-3 font-medium px-4">Customer</th>
                                    <th className="pb-3 font-medium px-4">Period</th>
                                    <th className="pb-3 font-medium px-4">Items</th>
                                    <th className="pb-3 font-medium px-4 text-right">Total</th>
                                    <th className="pb-3 font-medium px-4 text-center">Status</th>
                                    <th className="pb-3 font-medium px-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.orderId} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 font-medium text-sm">{order.orderId}</td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-200 font-medium">{order.customer.name}</p>
                                            <p className="text-gray-400 text-xs">{order.customer.whatsapp}</p>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-300">
                                            {order.customer.startDate} <br/>to<br/> {order.customer.endDate}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-300">
                                            {order.items.length} item(s)
                                        </td>
                                        <td className="py-4 px-4 text-right font-medium text-blue-400">
                                            Rp {order.total.toLocaleString('id-ID')}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {order.status === 'Pending' && (
                                                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/20">
                                                    Pending
                                                </span>
                                            )}
                                            {order.status === 'Active' && (
                                                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/20">
                                                    Active/Rented
                                                </span>
                                            )}
                                            {order.status === 'Completed' && (
                                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/20">
                                                    Returned
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2 flex-wrap max-w-[200px] mx-auto">
                                                {order.status === 'Pending' && (
                                                    <button 
                                                        onClick={() => handleValidateOrder(order.orderId)}
                                                        className="text-white text-sm font-medium px-4 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors shadow-lg shadow-blue-500/20 w-full"
                                                    >
                                                        Validate & Deduct
                                                    </button>
                                                )}
                                                {order.status === 'Active' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleCompleteOrder(order.orderId)}
                                                            className="text-white text-sm font-medium px-4 py-1.5 bg-green-500 hover:bg-green-600 rounded-xl transition-colors shadow-lg shadow-green-500/20 w-full"
                                                        >
                                                            Mark Returned
                                                        </button>
                                                        <button 
                                                            onClick={() => setInvoiceOrder(order)}
                                                            className="text-gray-300 hover:text-white text-sm font-medium px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10 w-full"
                                                        >
                                                            View Invoice
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'Completed' && (
                                                   <button 
                                                       onClick={() => setInvoiceOrder(order)}
                                                       className="text-gray-300 hover:text-white text-sm font-medium px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10 w-full"
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
                                        <td colSpan={7} className="py-12 text-center text-gray-400">
                                            No orders found. Customers need to place orders first!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Digital Invoice Modal */}
                {invoiceOrder && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#1a1a1a]">
                                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Digital Invoice</h3>
                                <button onClick={() => setInvoiceOrder(null)} className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            
                            <div className="p-8 overflow-y-auto" id="invoice-content" style={{ color: 'black', backgroundColor: 'white' }}>
                                <div className="flex justify-between items-start mb-8 border-b-2 border-gray-100 pb-8">
                                    <div>
                                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">HTan Bali</h1>
                                        <p className="text-gray-500 mt-2">Rental Alat Komunikasi & Event Setup</p>
                                        <p className="text-sm text-gray-500 mt-1">Denpasar, Bali - +62 812-3456-7890</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-2xl font-bold text-blue-600 mb-1">INVOICE</h2>
                                        <p className="text-sm text-gray-600 font-medium">#{invoiceOrder.orderId}</p>
                                        <p className="text-sm text-gray-500 mt-2">Date: {new Date(invoiceOrder.date).toLocaleDateString('id-ID')}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-10">
                                    <div className="p-4 bg-gray-50 rounded-xl">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
                                        <p className="font-bold text-gray-900 text-lg mb-1">{invoiceOrder.customer.name}</p>
                                        <p className="text-gray-600 text-sm mb-1">{invoiceOrder.customer.whatsapp}</p>
                                        <p className="text-gray-600 text-sm">{invoiceOrder.customer.address}</p>
                                    </div>
                                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Rental Period</h3>
                                        <div className="flex items-center gap-4 text-gray-900 font-medium">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Start Date</p>
                                                <p>{invoiceOrder.customer.startDate}</p>
                                            </div>
                                            <div className="text-blue-300">➜</div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">End Date</p>
                                                <p>{invoiceOrder.customer.endDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <table className="w-full text-left mb-8">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="py-3 text-sm font-bold text-gray-700">Item Description</th>
                                            <th className="py-3 text-sm font-bold text-gray-700 text-center">Qty</th>
                                            <th className="py-3 text-sm font-bold text-gray-700 text-right">Rate</th>
                                            <th className="py-3 text-sm font-bold text-gray-700 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {invoiceOrder.items.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className="py-4">
                                                    <p className="font-bold text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-500">{item.id}</p>
                                                </td>
                                                <td className="py-4 text-center font-medium text-gray-700">{item.quantity}</td>
                                                <td className="py-4 text-right text-gray-600">Rp {item.price.toLocaleString('id-ID')}</td>
                                                <td className="py-4 text-right font-bold text-gray-900">
                                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="border-t-2 border-gray-200 pt-6 flex justify-end">
                                    <div className="w-1/2">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium text-gray-900">Rp {invoiceOrder.total.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-gray-600">Tax/Fees</span>
                                            <span className="font-medium text-gray-900">-</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                            <span className="text-xl font-bold text-gray-900">Total</span>
                                            <span className="text-2xl font-extrabold text-blue-600">Rp {invoiceOrder.total.toLocaleString('id-ID')}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-16 text-center text-sm text-gray-500">
                                    <p className="font-medium text-gray-900 mb-1">Thank you for your business!</p>
                                    <p>Please ensure all items are returned by {invoiceOrder.customer.endDate} in working condition.</p>
                                </div>
                            </div>

                            <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-end gap-3">
                                <button 
                                    onClick={() => setInvoiceOrder(null)}
                                    className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors border border-white/10"
                                >
                                    Close
                                </button>
                                <button 
                                    onClick={printInvoice}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                                    Save as PDF / Print
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
