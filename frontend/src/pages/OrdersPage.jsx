import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LazyImage from '../components/LazyImage';
import { Package, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/api/orders/my-orders');
                console.log("Orders API Response:", response.data);
                setOrders(response.data || []);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch orders", err);
                setError(`Failed to load your orders. Error: ${err.message} ${err.response ? `(${err.response.status} ${err.response.statusText})` : ''}`);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'DELIVERED': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'CANCELLED': return <XCircle className="h-5 w-5 text-red-500" />;
            case 'PENDING': return <Clock className="h-5 w-5 text-yellow-500" />;
            default: return <Package className="h-5 w-5 text-blue-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                ) : !Array.isArray(orders) || orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                        <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
                        <div className="mt-6">
                            <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            if (!order) return null;
                            return (
                                <div key={order.orderId || Math.random()} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Order Placed</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Total</span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        ${order.total ? Number(order.total).toFixed(2) : '0.00'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider">Order ID</span>
                                                    <span className="text-sm text-gray-600">
                                                        #{order.orderId ? order.orderId.substring(0, 8) : 'Unknown'}...
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {order.image && (
                                                    <div className="flex-shrink-0 h-16 w-16 border border-gray-200 rounded-md overflow-hidden bg-gray-100">
                                                        <LazyImage src={order.image} alt="Product" className="h-full w-full object-cover object-center" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="text-base font-medium text-gray-900">{order.itemsSummary || 'No items'}</h4>
                                                    <p className="text-sm text-gray-500">Sold by {order.customer || 'Unknown'}</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(order.status || 'PENDING')}`}>
                                                {getStatusIcon(order.status || 'PENDING')}
                                                <span className="text-xs font-bold uppercase tracking-wide">{order.status || 'PENDING'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default OrdersPage;
