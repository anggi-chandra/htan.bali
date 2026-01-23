import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import { products } from './data/products';
import Link from 'next/link';

export default function Home() {
  // Get featured products (e.g., first 3)
  const featuredProducts = products.slice(0, 3);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <Hero />

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Equipment</h2>
            <p className="text-gray-400 max-w-xl">
              Top-rated gear chosen by professionals for seamless communication.
            </p>
          </div>
          <Link
            href="/catalog"
            className="hidden md:inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            View All Equipment &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/catalog"
            className="inline-block px-6 py-3 border border-white/20 rounded-full text-white hover:bg-white/10 transition-colors"
          >
            View All Equipment
          </Link>
        </div>
      </section>

      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Why Choose HTan.bali?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400 text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fast Delivery</h3>
              <p className="text-gray-400">
                We deliver directly to your event location anywhere in Bali, on time, every time.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-400 text-2xl">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Well Maintained</h3>
              <p className="text-gray-400">
                All units are sanitized, charged, and tested before delivery to ensure reliability.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-400 text-2xl">
                🎧
              </div>
              <h3 className="text-xl font-bold text-white mb-3">24/7 Support</h3>
              <p className="text-gray-400">
                Technical issues? Our team is ready to assist you anytime during your rental period.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
