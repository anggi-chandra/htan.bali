import { notFound } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import AddToCartSection from '../../components/AddToCartSection';
import { supabase } from '../../../utils/supabase';
import { Product } from '../../data/products';

// Generate static params for all products statically fetched from Supabase
export async function generateStaticParams() {
    const { data: products } = await supabase.from('products').select('id');
    return (products || []).map((product) => ({
        id: product.id,
    }));
}

// Revalidate slightly often to capture DB changes since it serves static cache
export const revalidate = 60; 

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: PageProps) {
    const { id } = await params;
    
    // Fetch product details strictly from Supabase
    const { data: productRaw } = await supabase.from('products').select('*').eq('id', id).single();

    if (!productRaw) {
        notFound();
    }

    const product = productRaw as Product;

    return (
        <main className="min-h-screen flex flex-col">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Section */}
                    <div className="relative group">
                        <div className="aspect-square bg-gray-800 rounded-3xl overflow-hidden border border-white/10">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -z-10" />
                        <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl -z-10" />
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-2">
                            <span className="text-blue-400 font-medium tracking-wider text-sm uppercase">
                                {product.category}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{product.name}</h1>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed">{product.description}</p>

                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-3xl font-bold text-white">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </span>
                                <span className="text-gray-400 mb-1">/ day</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                *Price may vary based on rental duration and quantity.
                            </p>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {product.features?.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <svg
                                            className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-lg font-semibold text-white mb-4">Specifications</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                                    <div key={key} className="flex justify-between border-b border-white/10 pb-2">
                                        <span className="text-gray-400">{key}</span>
                                        <span className="text-white font-medium">{String(value)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <AddToCartSection product={product} />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
