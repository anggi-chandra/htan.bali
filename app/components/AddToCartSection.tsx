'use client';

import { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

interface AddToCartSectionProps {
    product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
    const { cart, addToCart } = useCart();
    const existingCartItem = cart.find((item) => item.id === product.id);
    const maxSelectable = Math.max(0, product.stock - (existingCartItem ? existingCartItem.quantity : 0));
    
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    // Sync selected quantity with maxSelectable bounds
    const currentQty = maxSelectable > 0 ? Math.min(quantity, maxSelectable) : 0;

    useEffect(() => {
        if (maxSelectable <= 0) {
            setQuantity(0);
        } else if (quantity > maxSelectable) {
            setQuantity(maxSelectable);
        } else if (quantity === 0 && maxSelectable > 0) {
            setQuantity(1);
        }
    }, [maxSelectable, quantity]);

    const handleAddToCart = () => {
        if (maxSelectable <= 0) return;
        addToCart(product, currentQty);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        if (quantity < maxSelectable) {
            setQuantity(quantity + 1);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <span className="text-gray-300 font-medium">Jumlah:</span>
                    <div className="flex items-center border border-white/20 rounded-xl bg-white/5">
                        <button
                            onClick={decreaseQuantity}
                            disabled={currentQty <= 1}
                            className={`px-4 py-3 rounded-l-xl transition-colors ${
                                currentQty <= 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            -
                        </button>
                        <span className="px-4 py-3 text-white font-bold min-w-[3rem] text-center border-x border-white/10">
                            {currentQty}
                        </span>
                        <button
                            onClick={increaseQuantity}
                            disabled={currentQty >= maxSelectable}
                            className={`px-4 py-3 rounded-r-xl transition-colors ${
                                currentQty >= maxSelectable ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            +
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-400">
                    Stok tersedia: <span className="text-gray-200 font-medium">{product.stock}</span>
                    {existingCartItem && (
                        <span className="text-gray-400"> (di keranjang: {existingCartItem.quantity})</span>
                    )}
                </p>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleAddToCart}
                    disabled={maxSelectable <= 0}
                    className={`flex-1 font-bold py-4 px-8 rounded-xl transition-all shadow-lg transform active:scale-95 ${
                        maxSelectable <= 0
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : isAdded
                            ? 'bg-green-600 text-white shadow-green-600/20'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
                    }`}
                >
                    {product.stock <= 0
                        ? 'Stok Habis'
                        : maxSelectable <= 0
                        ? 'Keranjang Penuh (Batas Stok)'
                        : isAdded
                        ? 'Ditambahkan!'
                        : 'Tambah ke Keranjang'}
                </button>
                <Link
                    href="/catalog"
                    className="flex-none px-6 py-4 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-colors flex items-center justify-center"
                >
                    Kembali
                </Link>
            </div>
        </div>
    );
}
