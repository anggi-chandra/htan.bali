import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import { products } from './data/products';
import Link from 'next/link';
import AutoScrollImages from './components/AutoScrollImages';

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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Peralatan Unggulan</h2>
            <p className="text-gray-400 max-w-xl">
              Perlengkapan terbaik pilihan profesional untuk komunikasi yang lancar.
            </p>
          </div>
          <Link
            href="/catalog"
            className="hidden md:inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Lihat Semua Peralatan &rarr;
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
            Lihat Semua Peralatan
          </Link>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Karya Kami</h2>
          <p className="text-gray-400 text-center mt-2">Dipercaya oleh acara dan organisasi terkemuka</p>
        </div>
        <AutoScrollImages />
      </section>

      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Mengapa Memilih HTan.bali?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-400 text-2xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pengiriman Cepat</h3>
              <p className="text-gray-400">
                Kami mengirim langsung ke lokasi acara Anda di mana saja di Bali, tepat waktu, setiap saat.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-400 text-2xl">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Terawat dengan Baik</h3>
              <p className="text-gray-400">
                Semua unit disanitasi, diisi daya, dan diuji sebelum pengiriman untuk memastikan keandalan.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-400 text-2xl">
                🎧
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Dukungan 24/7</h3>
              <p className="text-gray-400">
                Masalah teknis? Tim kami siap membantu Anda kapan saja selama masa sewa Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
