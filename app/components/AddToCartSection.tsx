'use client';

import { useState } from 'react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

interface AddToCartSectionProps {
    product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <span className="text-gray-300 font-medium">Jumlah:</span>
                <div className="flex items-center border border-white/20 rounded-xl bg-white/5">
                    <button
                        onClick={decreaseQuantity}
                        className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-l-xl transition-colors"
                    >
                        -
                    </button>
                    <span className="px-4 py-3 text-white font-bold min-w-[3rem] text-center border-x border-white/10">
                        {quantity}
                    </span>
                    <button
                        onClick={increaseQuantity}
                        className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-r-xl transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleAddToCart}
                    className={`flex-1 font-bold py-4 px-8 rounded-xl transition-all shadow-lg transform active:scale-95 ${isAdded
                        ? 'bg-green-600 text-white shadow-green-600/20'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
                        }`}
                >
                    {isAdded ? 'Ditambahkan!' : 'Tambah ke Keranjang'}
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
