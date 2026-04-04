'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = () => {
            const stored = localStorage.getItem('htan_last_order');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.orderId === resolvedParams.id && parsed.status === 'validated') {
                    setOrder(parsed);
                }
            }
            setIsLoading(false);
        };
        
        // Small delay for aesthetic loading
        setTimeout(fetchOrder, 500);
    }, [resolvedParams.id]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                    <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Invoice Not Found</h1>
                    <p className="text-gray-500 mb-8">This order may be invalid, pending validation, or does not exist.</p>
                    <button 
                        onClick={() => router.push('/')}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-800">
            <div className="max-w-4xl mx-auto">
                {/* Action Bar (Hidden when printing) */}
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                    <div className="flex gap-4">
                        <button 
                            onClick={handlePrint}
                            className="flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-md active:scale-95"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Cetak / Simpan PDF
                        </button>
                    </div>
                </div>

                {/* Digital Invoice Wrapper */}
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
                    
                    {/* Header Strip */}
                    <div className="h-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 print:bg-blue-600"></div>

                    <div className="p-8 sm:p-12">
                        {/* Header Content */}
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12 border-b border-gray-100 pb-12">
                            <div>
                                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight mb-2 print:text-blue-600">
                                    HTAN BALI
                                </h2>
                                <p className="text-gray-500 max-w-xs">
                                    Premium Equipment Rental Services
                                    <br />Bali, Indonesia
                                </p>
                            </div>
                            <div className="text-left sm:text-right">
                                <span className="inline-block px-4 py-1.5 bg-green-50 text-green-600 font-bold rounded-full text-sm tracking-wide mb-4 border border-green-100">
                                    VALIDATED INVOICE
                                </span>
                                <h1 className="text-gray-400 font-medium">Invoice No.</h1>
                                <p className="text-xl font-bold text-gray-800">{order.orderId}</p>
                                <p className="text-gray-500 mt-1">Date: {new Date(order.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* Customer & Order Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Billed To</h3>
                                <p className="text-xl font-bold text-gray-800 mb-1">{order.customer.name}</p>
                                <p className="text-gray-600 mb-1"><span className="font-medium">Wa:</span> {order.customer.whatsapp}</p>
                                <p className="text-gray-600 leading-relaxed max-w-xs">{order.customer.address}</p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Rental Period</h3>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-500">Start Date</span>
                                        <span className="font-bold text-gray-800">{new Date(order.customer.startDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                        <span className="text-gray-500">End Date</span>
                                        <span className="font-bold text-gray-800">{new Date(order.customer.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-gray-500">Duration</span>
                                        <span className="font-bold text-blue-600">
                                            {Math.max(1, Math.ceil((new Date(order.customer.endDate).getTime() - new Date(order.customer.startDate).getTime()) / (1000 * 60 * 60 * 24)))} Days
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mb-12">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-gray-100">
                                            <th className="py-4 text-gray-500 font-medium w-1/2">Item Description</th>
                                            <th className="py-4 text-gray-500 font-medium text-center">Qty</th>
                                            <th className="py-4 text-gray-500 font-medium text-right">Unit Price</th>
                                            <th className="py-4 text-gray-500 font-medium text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {order.items.map((item: any) => (
                                            <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                                <td className="py-5">
                                                    <p className="font-bold text-gray-800">{item.name}</p>
                                                </td>
                                                <td className="py-5 text-center font-medium text-gray-600">{item.quantity}</td>
                                                <td className="py-5 text-right font-medium text-gray-600">Rp {item.price.toLocaleString('id-ID')}</td>
                                                <td className="py-5 text-right font-bold text-gray-800">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="flex justify-end mb-16">
                            <div className="w-full sm:w-1/2 bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-gray-600 mb-4 pb-4 border-b border-gray-200">
                                        <span>Subtotal</span>
                                        <span className="font-medium">Rp {order.total.toLocaleString('id-ID')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xl sm:text-2xl">
                                        <span className="font-bold text-gray-800">Total</span>
                                        <span className="font-extrabold text-blue-600">Rp {order.total.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-100 pt-8 text-center sm:text-left text-gray-400 text-sm">
                            <p className="mb-1 htan-print-footer-text">Thank you for choosing HTan Bali. We appreciate your business.</p>
                            <p>For support, please contact via WhatsApp at +62 878-6063-7476.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
