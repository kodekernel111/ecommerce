import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartSidebar from '../components/CartSidebar';
import SellerAnalytics from '../components/SellerAnalytics';
import SellerOrders from '../components/seller/SellerOrders';
import SellerPayments from '../components/seller/SellerPayments';
import SellerMessages from '../components/seller/SellerMessages';
import SellerPromotions from '../components/seller/SellerPromotions';
import SellerSettings from '../components/seller/SellerSettings';

import {
    LayoutDashboard,
    Package,
    Plus,
    Pencil,
    DollarSign,
    AlertTriangle,
    ShoppingBag,
    MessageSquare,
    Tag,
    Settings,
    Menu,
    X,
    Trash2
} from 'lucide-react';

const SellerDashboard = () => {
    const [inventoryData, setInventoryData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inventory');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const sellerId = localStorage.getItem('userId');
                if (!sellerId) return;

                const response = await api.get(`/seller/inventory?sellerId=${sellerId}`);
                setInventoryData(response.data);
            } catch (error) {
                console.error("Failed to fetch inventory", error);
            } finally {
                setLoading(false);
            }
        };

        if (activeTab === 'inventory') {
            fetchInventory();
        }
    }, [activeTab]);

    const handleDelete = (productId) => {
        setProductToDelete(productId);
        setIsDeleteModalOpen(true);
        setDeleteConfirmationInput('');
    };

    const confirmDelete = async () => {
        if (deleteConfirmationInput.toLowerCase() === 'delete' && productToDelete) {
            try {
                await api.delete(`/seller/delete-listed-product/${productToDelete}`);
                // Refresh inventory
                const sellerId = localStorage.getItem('userId');
                const response = await api.get(`/seller/inventory?sellerId=${sellerId}`);
                setInventoryData(response.data);
                setIsDeleteModalOpen(false);
                setProductToDelete(null);
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Failed to delete product");
            }
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
        setDeleteConfirmationInput('');
    };

    // Calculate Stats
    const totalProducts = inventoryData?.listedProducts?.length || 0;
    const totalValue = inventoryData?.listingValue || 0;
    const lowStockCount = inventoryData?.lowCountProducts?.length || 0;
    const products = inventoryData?.listedProducts || [];

    const navItems = [
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
        { id: 'payments', label: 'Payments', icon: DollarSign },
        { id: 'messages', label: 'Messages', icon: MessageSquare },
        { id: 'promotions', label: 'Promotions', icon: Tag },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const renderContent = () => {
        if (loading && activeTab === 'inventory') {
            return <div className="p-10 text-center">Loading inventory...</div>;
        }

        switch (activeTab) {
            case 'inventory':
                return (
                    <div className="relative min-h-[500px]">
                        <div className="space-y-6">
                            {/* Stats Overview */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <Package className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">{totalProducts}</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <DollarSign className="h-6 w-6 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Inventory Value</dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <AlertTriangle className="h-6 w-6 text-amber-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-5 w-0 flex-1">
                                                <dl>
                                                    <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Alerts</dt>
                                                    <dd>
                                                        <div className="text-lg font-medium text-gray-900">{lowStockCount}</div>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory Table */}
                            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Current Inventory</h3>
                                    <Link
                                        to="/seller/add-product"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Add Product
                                    </Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {products.map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <img className="h-10 w-10 rounded-lg object-cover" src={product.image} alt="" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                                <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{product.category}</div></td>
                                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">${product.price.toFixed(2)}</div></td>
                                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{product.quantity}</div></td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {product.quantity === 0 ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>
                                                        ) : product.quantity < 10 ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Low Stock</span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-3">
                                                            <Link to={`/seller/edit-product/${product.id}`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-full inline-flex hover:bg-indigo-100 transition-colors">
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-full inline-flex hover:bg-red-100 transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Delete Confirmation Modal */}
                        {isDeleteModalOpen && (
                            <div className="absolute inset-0 z-50 flex justify-center items-start pt-20">
                                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" onClick={cancelDelete}></div>

                                <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-2xl border border-gray-200 transform transition-all sm:max-w-lg sm:w-full w-full">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                                    Delete Product
                                                </h3>
                                                <div className="mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Are you sure you want to delete this product? This action cannot be undone.
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-2">
                                                        Please type <strong>delete</strong> to confirm.
                                                    </p>
                                                    <input
                                                        type="text"
                                                        className="mt-3 shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                                        placeholder="Type delete"
                                                        value={deleteConfirmationInput}
                                                        onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="button"
                                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${deleteConfirmationInput.toLowerCase() !== 'delete' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={confirmDelete}
                                            disabled={deleteConfirmationInput.toLowerCase() !== 'delete'}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                            onClick={cancelDelete}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 'orders': return <SellerOrders />;
            case 'analytics': return <SellerAnalytics />;
            case 'payments': return <SellerPayments />;
            case 'messages': return <SellerMessages />;
            case 'promotions': return <SellerPromotions />;
            case 'settings': return <SellerSettings />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar showCategories={false} />
            <CartSidebar />

            <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Mobile Sidebar Toggle */}
                <div className="lg:hidden mb-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <aside className={`
                    lg:w-64 lg:flex-shrink-0 lg:block lg:sticky lg:top-32 lg:self-start
                    ${isSidebarOpen ? 'fixed inset-0 z-40 flex' : 'hidden'}
                `}>
                    {/* Mobile Sidebar Overlay */}
                    <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>

                    <div className={`
                        relative flex-1 flex flex-col max-w-xs w-full bg-white lg:bg-transparent transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:max-w-none
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}>
                        {/* Close button for mobile */}
                        <div className="absolute top-0 right-0 -mr-12 pt-2 lg:hidden">
                            <button onClick={() => setIsSidebarOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                <span className="sr-only">Close sidebar</span>
                                <X className="h-6 w-6 text-white" aria-hidden="true" />
                            </button>
                        </div>

                        <nav className="space-y-1 lg:pr-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`
                                            group flex items-center px-3 py-2.5 text-sm font-medium rounded-md w-full transition-colors
                                            ${activeTab === item.id
                                                ? 'bg-indigo-50 text-indigo-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        <Icon
                                            className={`
                                                flex-shrink-0 -ml-1 mr-3 h-5 w-5 transition-colors
                                                ${activeTab === item.id ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                                            `}
                                            aria-hidden="true"
                                        />
                                        <span className="truncate">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 lg:pl-8">
                    <div className="max-w-4xl mx-auto lg:max-w-none">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{activeTab}</h1>
                        {renderContent()}
                    </div>
                </main>
            </div>

            <div className="mt-32">
                <Footer />
            </div>
        </div>
    );
};

export default SellerDashboard;
