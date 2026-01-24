'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useLoading } from '../context/LoadingContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products, Category } from '../data/products';

export default function Catalog() {
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
    const headerRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const { isLoading } = useLoading();

    const categories: (Category | 'All')[] = ['All', 'HT', 'Intercom', 'TOA'];

    const filteredProducts =
        activeCategory === 'All'
            ? products
            : products.filter((product) => product.category === activeCategory);

    useEffect(() => {
        if (isLoading) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from(headerRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
            })
                .from(
                    filterRef.current,
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.6,
                    },
                    '-=0.4'
                )
                .from(
                    gridRef.current?.children || [],
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.6,
                        stagger: 0.1,
                    },
                    '-=0.4'
                );
        });

        return () => ctx.revert();
    }, [isLoading, activeCategory]); // Re-run animation when category changes

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />

            <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
                <div ref={headerRef} className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Equipment Catalog</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Browse our complete inventory of professional communication equipment.
                    </p>
                </div>

                {/* Filter */}
                <div ref={filterRef} className="flex justify-center mb-12">
                    <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products found in this category.</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
