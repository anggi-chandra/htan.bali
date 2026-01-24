import Link from 'next/link';
import { Product } from '../data/products';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/catalog/${product.id}`} className="group block">
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]">
                <div className="aspect-square w-full overflow-hidden bg-gray-800 relative">
                    {/* Placeholder for actual image if needed, or use the url */}
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.category}
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-white font-bold">
                            Rp {product.price.toLocaleString('id-ID')} <span className="text-xs text-gray-500 font-normal">/ hari</span>
                        </span>
                        <span className="text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                            Lihat Detail &rarr;
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
