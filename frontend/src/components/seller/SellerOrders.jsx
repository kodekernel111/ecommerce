import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Truck, XCircle, CheckCircle } from 'lucide-react';
import api from '../../api/axios';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const sellerId = localStorage.getItem('userId');
                if (!sellerId) return;

                const response = await api.get(`/seller/orders?sellerId=${sellerId}`);
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Loading orders...</div>;
    }

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
                <span className="text-sm text-gray-500">Manage your incoming orders</span>
            </div>
            <div className="space-y-4 p-4">
                {orders.map((order) => (
                    <div key={order.orderId} className="bg-white shadow rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            {/* Left Side */}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order ID</span>
                                        <div className="text-sm font-medium text-indigo-600">#{order.orderId || 'N/A'}</div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date</span>
                                        <div className="text-sm text-gray-900">{order.date || 'N/A'}</div>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Customer</span>
                                    <div className="text-sm font-medium text-gray-900">{order.customer || 'Unknown Customer'}</div>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Items</span>
                                    <div className="text-sm text-gray-500">{order.itemsSummary || 'No items'}</div>
                                </div>
                            </div>

                            {/* Right Side */}
                            <div className="flex flex-col sm:items-end justify-between gap-4">
                                <div className="text-right">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Amount</span>
                                    <div className="text-lg font-bold text-gray-900">${Number(order.total || 0).toFixed(2)}</div>
                                </div>

                                <div className="flex flex-col sm:items-end gap-2">
                                    <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status || 'UNKNOWN'}
                                    </span>

                                    <div className="flex items-center gap-2 mt-2">
                                        <Link to={`/seller/order/${order.orderId}`} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="View Details">
                                            <Eye className="h-5 w-5" />
                                        </Link>
                                        {order.status === 'PENDING' && (
                                            <>
                                                <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors" title="Mark as Shipped">
                                                    <Truck className="h-5 w-5" />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Cancel Order">
                                                    <XCircle className="h-5 w-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SellerOrders;
