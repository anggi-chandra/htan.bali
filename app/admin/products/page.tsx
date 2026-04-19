'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../components/AdminSidebar';
import { products as initialProducts, Product, Category } from '../../data/products';

export default function AdminProducts() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({});

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
            router.push('/admin/login');
        } else {
            const storedProducts = localStorage.getItem('adminProducts');
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            } else {
                setProducts(initialProducts);
                localStorage.setItem('adminProducts', JSON.stringify(initialProducts));
            }
            setTimeout(() => setIsLoading(false), 0);
        }
    }, [router]);

    const saveProducts = (updatedProducts: Product[]) => {
        setProducts(updatedProducts);
        localStorage.setItem('adminProducts', JSON.stringify(updatedProducts));
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            const updated = products.filter(p => p.id !== id);
            saveProducts(updated);
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            id: 'prod-' + Date.now().toString(),
            name: '',
            category: 'HT',
            price: 0,
            stock: 0,
            description: '',
            image: '/gambar_ht_baofeng.png',
            features: [],
            specs: {}
        });
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        let finalFeatures = formData.features || [];
        if (typeof formData.features === 'string') {
           finalFeatures = (formData.features as string).split('\n').filter(Boolean);
        }

        const productToSave: Product = {
            ...(formData as Product),
            features: finalFeatures,
        };

        if (editingProduct) {
            const updated = products.map(p => p.id === editingProduct.id ? productToSave : p);
            saveProducts(updated);
        } else {
            saveProducts([...products, productToSave]);
        }
        setIsModalOpen(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex text-white relative overflow-hidden">
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <AdminSidebar />

            <main className="flex-1 overflow-y-auto p-4 md:p-8 z-10 h-screen relative">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Products Inventory</h2>
                        <p className="text-gray-400 mt-1">Manage your rental catalog</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Add Product
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product.id} className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-sm group hover:border-blue-500/50 transition-all flex flex-col h-full">
                            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-white/10 relative mb-4">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <button 
                                        onClick={() => openEditModal(product)}
                                        className="p-2 bg-black/50 backdrop-blur-md rounded-xl text-white hover:text-blue-400 transition-colors shadow-lg shadow-black/20"
                                        title="Edit Product"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 bg-black/50 backdrop-blur-md rounded-xl text-white hover:text-red-400 transition-colors shadow-lg shadow-black/20"
                                        title="Delete Product"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-200 mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">{product.description}</p>
                                
                                <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Price per day</p>
                                        <p className="text-blue-400 font-bold">Rp {product.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                            product.stock > 0 
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                                        </span>
                                        <span className="text-[10px] text-gray-500">{product.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                            
                            <form onSubmit={handleSave} className="p-6 overflow-y-auto max-h-[80vh]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                            <input 
                                                required
                                                type="text" 
                                                value={formData.name || ''}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                            <select
                                                required
                                                value={formData.category || 'HT'}
                                                onChange={e => setFormData({...formData, category: e.target.value as Category})}
                                                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="HT">HT</option>
                                                <option value="Jasa Broadcasting">Jasa Broadcasting</option>
                                                <option value="Paket">Paket</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Price (Rp)</label>
                                                <input 
                                                    required
                                                    type="number" 
                                                    value={formData.price || 0}
                                                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 text-white"
                                                    min="0"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-400 mb-1">Stock</label>
                                                <input 
                                                    required
                                                    type="number" 
                                                    value={formData.stock || 0}
                                                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 text-white"
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Product Image</label>
                                            <input 
                                                required={!formData.image}
                                                type="file"
                                                accept="image/*"
                                                onChange={e => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setFormData({...formData, image: reader.result as string});
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30"
                                            />
                                            {formData.image && (
                                                <div className="mt-2 text-xs text-green-400 truncate px-1">
                                                    Image loaded successfully
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col flex-1">
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                            <textarea 
                                                required
                                                value={formData.description || ''}
                                                onChange={e => setFormData({...formData, description: e.target.value})}
                                                className="w-full flex-1 min-h-[110px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white resize-none"
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1">
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Features (One per line)</label>
                                            <textarea 
                                                value={Array.isArray(formData.features) ? formData.features.join('\n') : (formData.features || '')}
                                                onChange={e => setFormData({...formData, features: e.target.value as any})}
                                                className="w-full flex-1 min-h-[110px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white resize-none"
                                                placeholder="Dual PTT&#10;FM Radio"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-white/10 relative z-10 w-full bg-[#111]">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                                    >
                                        {editingProduct ? 'Save Changes' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
