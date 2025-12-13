import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addProduct, updateProduct } from '../features/products/productsSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const AddProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const existingProduct = useSelector(state =>
        id ? state.products.items.find(p => p.id === parseInt(id) || p.id === id) : null
    );

    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Electronics',
        image: '',
        stock: 10,
    });

    useEffect(() => {
        const fetchProduct = async () => {
            if (isEditMode) {
                try {
                    const response = await api.get(`/seller/product/${id}`);
                    const product = response.data;
                    setNewProduct({
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        category: product.category,
                        image: product.image,
                        stock: product.quantity || 0, // Backend uses quantity
                    });
                    setPreviewUrl(product.image);
                } catch (error) {
                    console.error("Failed to fetch product", error);
                    alert("Failed to load product details");
                    navigate('/seller');
                }
            }
        };

        fetchProduct();
    }, [isEditMode, id, navigate]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Create a fake local URL for preview and usage
        // In a real app, you'd upload this to a server/S3 here
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setNewProduct(prev => ({ ...prev, image: objectUrl, file: file }));
    };

    const removeImage = () => {
        setPreviewUrl(null);
        setNewProduct(prev => ({ ...prev, image: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You must be logged in!");
                navigate('/login');
                return;
            }

            const sellerId = localStorage.getItem('userId');

            if (!sellerId) {
                alert("User ID not found. Please login again.");
                return;
            }

            const formData = new FormData();

            const productData = {
                name: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                quantity: parseInt(newProduct.stock),
                category: newProduct.category
            };

            formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

            if (newProduct.file) {
                formData.append('image', newProduct.file);
            }

            if (isEditMode) {
                await api.put(`/seller/update-listed-product/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(`/seller/list-new-product/${sellerId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            navigate('/seller');
        } catch (err) {
            console.error("Failed to save product", err);
            alert("Failed to save product: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar showCategories={false} />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-8">
                    <Link to="/seller" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p className="mt-2 text-lg text-gray-500">
                        {isEditMode ? 'Update the details of your existing product.' : 'Fill in the details to list a new item in your store.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Left Column: Product Details */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 sm:p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Product Information</h3>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                        placeholder="e.g. Wireless Noise Cancelling Headphones"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                id="price"
                                                step="0.01"
                                                required
                                                value={newProduct.price}
                                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                                className="block w-full pl-7 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                                        <input
                                            type="number"
                                            id="stock"
                                            required
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        id="category"
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow bg-white"
                                    >
                                        <option>Electronics</option>
                                        <option>Furniture</option>
                                        <option>Accessories</option>
                                        <option>Clothing</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        id="description"
                                        rows={5}
                                        required
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                        placeholder="Describe your product in detail..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Image Upload & Actions */}
                    <div className="lg:col-span-5 space-y-8 mt-8 lg:mt-0">
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 sm:p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Product Image</h3>

                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 flex justify-center items-center transition-colors duration-200 ease-in-out ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {previewUrl ? (
                                    <div className="relative w-full aspect-w-4 aspect-h-3">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="object-contain rounded-lg w-full h-64"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors"
                                        >
                                            <X className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="mx-auto h-12 w-12 text-gray-400">
                                            <ImageIcon className="h-12 w-12" />
                                        </div>
                                        <div className="mt-4 flex text-sm text-gray-600 justify-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Or enter Image URL</label>
                                <input
                                    type="text"
                                    value={newProduct.image}
                                    onChange={(e) => {
                                        setNewProduct({ ...newProduct, image: e.target.value });
                                        setPreviewUrl(e.target.value);
                                    }}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                {isEditMode ? 'Update Product' : 'Publish Product'}
                            </button>
                            <Link
                                to="/seller"
                                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </main>
            <div className="mt-32">
                <Footer />
            </div>
        </div>
    );
};

export default AddProductPage;
