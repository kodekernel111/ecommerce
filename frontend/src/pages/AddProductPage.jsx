import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Upload, X, Image as ImageIcon, Plus, PlusCircle, FolderPlus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Modal from '../components/Modal';

const AddProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [categories, setCategories] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: '',
        mrp: '',
        discount: 0,
        price: '',
        description: '',
        category: '',
        subCategory: '',
        stock: '',
        tags: [],
        images: [],
        brand: '',
        sku: '',
        returnPolicy: '',
        warranty: '',
        warranty: '',
        specifications: {},
        active: true,
    });

    const [tagInput, setTagInput] = useState('');

    const [showAddCategory, setShowAddCategory] = useState(false);
    const [categoryCreationType, setCategoryCreationType] = useState('MAIN');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [parentCategoryForNew, setParentCategoryForNew] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            if (isEditMode) {
                try {
                    const response = await api.get(`/seller/product/${id}`);
                    const product = response.data;
                    setNewProduct({
                        name: product.name,
                        mrp: product.mrp || '',
                        discount: product.discount || 0,
                        price: product.price,
                        description: product.description,
                        category: product.category || '',
                        subCategory: product.subCategory || '',
                        stock: product.quantity,
                        tags: product.tags || [],
                        images: product.images || [],
                        brand: product.brand || '',
                        sku: product.sku || '',
                        returnPolicy: product.returnPolicy || '',
                        warranty: product.warranty || '',
                        warranty: product.warranty || '',
                        specifications: product.specifications || {},
                        active: product.active !== undefined ? product.active : true,
                    });
                    setPreviewUrl(product.images && product.images.length > 0 ? product.images[0] : product.image);
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

    const handleFile = (files) => {
        const fileList = Array.from(files);
        if (newProduct.images.length + fileList.length > 5) {
            alert("You can only upload up to 5 images.");
            return;
        }

        const newImages = fileList.map(file => ({
            file: file,
            preview: URL.createObjectURL(file)
        }));

        setNewProduct(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
        }));

        // Set main preview if not set
        if (!previewUrl && newImages.length > 0) {
            setPreviewUrl(newImages[0].preview);
        }
    };

    const removeImage = (index) => {
        setNewProduct(prev => {
            const updatedImages = [...prev.images];
            updatedImages.splice(index, 1);
            return { ...prev, images: updatedImages };
        });
        if (index === 0) {
            setPreviewUrl(null); // Or set to next image
        }
    };

    const setPrimaryImage = (index) => {
        if (index === 0) return; // Already primary
        setNewProduct(prev => {
            const updatedImages = [...prev.images];
            const [selectedImage] = updatedImages.splice(index, 1);
            updatedImages.unshift(selectedImage);
            return { ...prev, images: updatedImages };
        });
        // Update preview URL to the new primary image
        if (newProduct.images[index]) {
            setPreviewUrl(newProduct.images[index].preview || newProduct.images[index]);
        }
    };

    // Auto-calculate price when MRP or Discount changes
    useEffect(() => {
        if (newProduct.mrp) {
            const mrpVal = parseFloat(newProduct.mrp);
            const discountVal = parseInt(newProduct.discount) || 0;
            if (!isNaN(mrpVal)) {
                const calculatedPrice = mrpVal - (mrpVal * discountVal / 100);
                setNewProduct(prev => ({ ...prev, price: calculatedPrice.toFixed(2) }));
            }
        }
    }, [newProduct.mrp, newProduct.discount]);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            const payload = {
                name: newCategoryName,
                parentId: parentCategoryForNew || null
            };
            await api.post('/categories', payload);
            await fetchCategories();
            setShowAddCategory(false);
            setNewCategoryName('');
            setParentCategoryForNew('');
        } catch (error) {
            console.error("Failed to add category", error);
            alert("Failed to add category: " + (error.response?.data?.message || error.message));
        }
    };

    const handleTagInputKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim();
            if (tag && !newProduct.tags.includes(tag)) {
                setNewProduct(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                setTagInput('');
            }
        }
    };

    const removeTag = (indexToRemove) => {
        setNewProduct({ ...newProduct, tags: newProduct.tags.filter((_, index) => index !== indexToRemove) });
    };

    // Specifications Logic
    const [specList, setSpecList] = useState([{ key: '', value: '' }]);

    useEffect(() => {
        if (newProduct.specifications && Object.keys(newProduct.specifications).length > 0) {
            const list = Object.entries(newProduct.specifications).map(([key, value]) => ({ key, value }));
            setSpecList(list);
        }
    }, [newProduct.specifications]);

    const handleSpecChange = (index, field, value) => {
        const newList = [...specList];
        newList[index][field] = value;
        setSpecList(newList);

        // Update newProduct state
        const specMap = {};
        newList.forEach(item => {
            if (item.key) specMap[item.key] = item.value;
        });
        setNewProduct(prev => ({ ...prev, specifications: specMap }));
    };

    const addSpecRow = () => {
        setSpecList([...specList, { key: '', value: '' }]);
    };

    const removeSpecRow = (index) => {
        const newList = specList.filter((_, i) => i !== index);
        setSpecList(newList);

        // Update newProduct state
        const specMap = {};
        newList.forEach(item => {
            if (item.key) specMap[item.key] = item.value;
        });
        setNewProduct(prev => ({ ...prev, specifications: specMap }));
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

            const imageFiles = [];
            const imagesListForDto = newProduct.images.map(img => {
                if (img.file) {
                    imageFiles.push(img.file);
                    return `__NEW_IMAGE_${imageFiles.length - 1}__`;
                }
                return img.url || img; // Existing URL (could be string or object with url property)
            });

            const productData = {
                name: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                mrp: parseFloat(newProduct.mrp),
                discount: parseInt(newProduct.discount),
                quantity: parseInt(newProduct.stock),
                category: newProduct.category,
                subCategory: newProduct.subCategory,
                tags: newProduct.tags,
                images: imagesListForDto,
                brand: newProduct.brand,
                sku: newProduct.sku,
                returnPolicy: newProduct.returnPolicy,
                warranty: newProduct.warranty,
                returnPolicy: newProduct.returnPolicy,
                warranty: newProduct.warranty,
                specifications: newProduct.specifications,
                active: newProduct.active
            };

            formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));

            imageFiles.forEach(file => {
                formData.append('images', file);
            });

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

    const selectedCategory = categories.find(c => c.name === newProduct.category);

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
                                        <label htmlFor="mrp" className="block text-sm font-medium text-gray-700 mb-2">MRP ($)</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                id="mrp"
                                                step="0.01"
                                                required
                                                value={newProduct.mrp}
                                                onChange={(e) => setNewProduct({ ...newProduct, mrp: e.target.value })}
                                                className="block w-full pl-7 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Selling Price ($)</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                id="price"
                                                step="0.01"
                                                required
                                                readOnly
                                                value={newProduct.price}
                                                className="block w-full pl-7 rounded-lg border-gray-300 bg-gray-50 text-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow cursor-not-allowed"
                                                placeholder="Calculated automatically"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-2">Discount (%)</label>
                                        <div className="relative rounded-md shadow-sm">
                                            <select
                                                id="discount"
                                                value={newProduct.discount}
                                                onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow bg-white appearance-none"
                                            >
                                                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90].map((d) => (
                                                    <option key={d} value={d}>{d}%</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                            </div>
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

                                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Main Category</label>
                                        <select
                                            id="category"
                                            required
                                            value={newProduct.category}
                                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value, subCategory: '' })}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow bg-white"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
                                        <select
                                            id="subCategory"
                                            required
                                            disabled={!newProduct.category}
                                            value={newProduct.subCategory}
                                            onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                                            className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow bg-white disabled:bg-gray-100 disabled:text-gray-400"
                                        >
                                            <option value="">Select Sub Category</option>
                                            {selectedCategory?.subCategories?.map((sub) => (
                                                <option key={sub.id} value={sub.name}>{sub.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-sm font-medium text-gray-700">Category Management</span>
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCategoryCreationType('MAIN');
                                                setShowAddCategory(true);
                                                setParentCategoryForNew('');
                                            }}
                                            className="inline-flex items-center px-3 py-1.5 border border-indigo-600 rounded-lg text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                                        >
                                            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                                            New Main Category
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCategoryCreationType('SUB');
                                                setShowAddCategory(true);
                                                const currentMain = categories.find(c => c.name === newProduct.category);
                                                if (currentMain) {
                                                    setParentCategoryForNew(currentMain.id);
                                                }
                                            }}
                                            className="inline-flex items-center px-3 py-1.5 border border-indigo-600 rounded-lg text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                                        >
                                            <FolderPlus className="h-3.5 w-3.5 mr-1.5" />
                                            New Sub Category
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {newProduct.tags.map((tag, index) => (
                                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                                                >
                                                    <span className="sr-only">Remove tag</span>
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        id="tags"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagInputKeyDown}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                        placeholder="Type a tag and press Enter..."
                                    />
                                    <p className="mt-1 text-xs text-gray-500">Press Enter or comma to add a tag</p>
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
                                {newProduct.images.length > 0 ? (
                                    <div className="relative w-full">
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                            {newProduct.images.map((img, index) => (
                                                <div key={index} className={`relative h-24 w-full group ${index === 0 ? 'ring-2 ring-indigo-500 rounded-lg' : ''}`}>
                                                    <img
                                                        src={img.preview || img}
                                                        alt={`Preview ${index + 1}`}
                                                        className="object-cover rounded-lg w-full h-full"
                                                    />
                                                    <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors rounded-lg" />

                                                    {/* Remove Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                        title="Remove Image"
                                                    >
                                                        <X className="h-3 w-3 text-red-500" />
                                                    </button>

                                                    {/* Set Primary Button */}
                                                    {index !== 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setPrimaryImage(index)}
                                                            className="absolute top-1 left-1 bg-white rounded-full p-1 shadow-md hover:bg-yellow-50 transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Set as Primary"
                                                        >
                                                            <Star className="h-3 w-3 text-gray-400 hover:text-yellow-500" />
                                                        </button>
                                                    )}

                                                    {/* Primary Badge */}
                                                    {index === 0 && (
                                                        <div className="absolute top-1 left-1 bg-indigo-600 rounded-full p-1 shadow-md">
                                                            <Star className="h-3 w-3 text-white fill-current" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {newProduct.images.length < 5 && (
                                                <div className="relative aspect-w-4 aspect-h-3 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 h-24">
                                                    <label
                                                        htmlFor="file-upload-grid"
                                                        className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
                                                    >
                                                        <Plus className="h-6 w-6 text-gray-400" />
                                                        <span className="text-xs text-gray-500 mt-1">Add</span>
                                                        <input id="file-upload-grid" type="file" className="sr-only" onChange={(e) => handleFile(e.target.files)} accept="image/*" multiple />
                                                    </label>
                                                </div>
                                            )}
                                        </div>
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
                                                <span>Upload files</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => handleFile(e.target.files)} accept="image/*" multiple />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB (Max 5)</p>
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

                        {/* Product Details Section */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 sm:p-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Product Details</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                    <input
                                        type="text"
                                        id="brand"
                                        value={newProduct.brand}
                                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                        placeholder="e.g. Nike"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                                    <input
                                        type="text"
                                        id="sku"
                                        value={newProduct.sku}
                                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                        placeholder="e.g. TSHIRT-RED-M"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="returnPolicy" className="block text-sm font-medium text-gray-700 mb-2">Return Policy</label>
                                    <input
                                        type="text"
                                        id="returnPolicy"
                                        value={newProduct.returnPolicy}
                                        onChange={(e) => setNewProduct({ ...newProduct, returnPolicy: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                        placeholder="e.g. 7 Days Return"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="warranty" className="block text-sm font-medium text-gray-700 mb-2">Warranty</label>
                                    <input
                                        type="text"
                                        id="warranty"
                                        value={newProduct.warranty}
                                        onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                        placeholder="e.g. 1 Year Warranty"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Specifications Section */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 sm:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-gray-900">Specifications</h3>
                                <button
                                    type="button"
                                    onClick={addSpecRow}
                                    className="inline-flex items-center px-3 py-1.5 border border-indigo-600 rounded-lg text-xs font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                                >
                                    <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                                    Add Specification
                                </button>
                            </div>
                            <div className="space-y-4">
                                {specList.map((spec, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={spec.key}
                                                onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                                placeholder="Key (e.g. Color)"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={spec.value}
                                                onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3 border transition-shadow"
                                                placeholder="Value (e.g. Red)"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeSpecRow(index)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Remove"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                                {specList.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center py-4">No specifications added yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Active Status Toggle */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6 sm:p-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Product Status</h3>
                                <p className="text-sm text-gray-500">Active products are visible to customers.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setNewProduct(prev => ({ ...prev, active: !prev.active }))}
                                className={`${newProduct.active ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                role="switch"
                                aria-checked={newProduct.active}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`${newProduct.active ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                />
                            </button>
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

                <Modal
                    isOpen={showAddCategory}
                    onClose={() => setShowAddCategory(false)}
                    title={categoryCreationType === 'MAIN' ? 'Create Main Category' : 'Create Sub Category'}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                placeholder={categoryCreationType === 'MAIN' ? "e.g. Footwear" : "e.g. Sneakers"}
                            />
                        </div>

                        {categoryCreationType === 'SUB' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category <span className="text-red-500">*</span></label>
                                <select
                                    value={parentCategoryForNew}
                                    onChange={(e) => setParentCategoryForNew(e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border"
                                >
                                    <option value="">Select Parent Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddCategory(false);
                                    setNewCategoryName('');
                                    setParentCategoryForNew('');
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleAddCategory}
                                disabled={categoryCreationType === 'SUB' && !parentCategoryForNew}
                                className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Create Category
                            </button>
                        </div>
                    </div>
                </Modal>
            </main>
            <div className="mt-32">
                <Footer />
            </div>
        </div >
    );
};

export default AddProductPage;
