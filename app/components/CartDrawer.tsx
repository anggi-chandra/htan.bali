'use client';

import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CartDrawer() {
    const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
    const drawerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isCartOpen) {
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'block' });
            gsap.to(drawerRef.current, { x: 0, duration: 0.3, ease: 'power3.out' });
        } else {
            gsap.to(overlayRef.current, {
                opacity: 0, duration: 0.3, onComplete: () => {
                    if (overlayRef.current) overlayRef.current.style.display = 'none';
                }
            });
            gsap.to(drawerRef.current, { x: '100%', duration: 0.3, ease: 'power3.in' });
        }
    }, [isCartOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/50 z-50 hidden opacity-0"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-900 border-l border-white/10 z-50 transform translate-x-full shadow-2xl flex flex-col"
            >
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Keranjang ({cart.length})</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-10">
                            <p>Keranjang Anda kosong.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 text-blue-400 hover:text-blue-300"
                            >
                                Lanjut Belanja
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">{item.name}</h3>
                                    <p className="text-blue-400 text-sm">Rp {item.price.toLocaleString('id-ID')}</p>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border border-white/20 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="px-2 py-1 text-gray-400 hover:text-white"
                                            >
                                                -
                                            </button>
                                            <span className="px-2 text-white text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                                className={`px-2 py-1 transition-colors ${
                                                    item.quantity >= item.stock ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 hover:text-white'
                                                }`}
                                                title={item.quantity >= item.stock ? 'Mencapai batas stok' : 'Tambah jumlah'}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-gray-900">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-400">Total</span>
                            <span className="text-2xl font-bold text-white">Rp {cartTotal.toLocaleString('id-ID')}</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="block w-full bg-blue-600 text-white text-center font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
