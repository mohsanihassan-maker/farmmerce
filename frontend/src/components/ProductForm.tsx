import { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { API_URL } from '../config';

interface ProductFormProps {
    onSubmit: (data: any) => void;
    onCancel?: () => void;
}

export default function ProductForm({ onSubmit, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        unit: 'kg',
        stock: '',
        category: 'Vegetables',
        imageUrl: ''
    });

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/categories`)
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                if (data.length > 0 && !formData.category) {
                    setFormData(prev => ({ ...prev, category: data[0].name }));
                }
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form or handle close if needed
        setFormData({
            name: '',
            description: '',
            price: '',
            unit: 'kg',
            stock: '',
            category: 'Vegetables',
            imageUrl: ''
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                    <div className="mt-1">
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                            {categories.length === 0 && <option>Vegetables</option>}
                        </select>
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <div className="mt-1">
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₦)</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₦</span>
                        </div>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="focus:ring-primary focus:border-primary block w-full pl-7 sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                    <div className="mt-1">
                        <input
                            type="text"
                            name="unit"
                            id="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            required
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="kg, bunch, piece"
                        />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock Qty</label>
                    <div className="mt-1">
                        <input
                            type="number"
                            name="stock"
                            id="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                    </div>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                            type="text"
                            name="imageUrl"
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            className="flex-1 focus:ring-primary focus:border-primary block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300 p-2 border"
                            placeholder="https://..."
                        />
                        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                            <ImageIcon className="h-4 w-4" />
                        </span>
                    </div>
                </div>
            </div>

            <div className="pt-5">
                <div className="flex justify-end">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Add Product
                    </button>
                </div>
            </div>
        </form>
    );
}
