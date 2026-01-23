export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-bold text-white">HTan.bali</h2>
                        <p className="text-gray-400 text-sm mt-1">Premium Rental Equipment in Bali</p>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            Instagram
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            WhatsApp
                        </a>
                    </div>
                </div>
                <div className="mt-8 text-center text-gray-500 text-xs">
                    &copy; {new Date().getFullYear()} HTan.bali. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
