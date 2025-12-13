import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, User, MapPin, Phone, Mail, Calendar, CreditCard } from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SellerOrderDetailsPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.get(`/seller/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error("Failed to fetch order details", error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar showCategories={false} />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-lg text-gray-600">Loading order details...</div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar showCategories={false} />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="text-lg text-red-600 mb-4">Order not found</div>
                    <Link to="/seller" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
            <Navbar showCategories={false} />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/seller')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Orders
                    </button>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId || 'N/A'}</h1>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-2" />
                                {order.orderDate || 'N/A'}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={order.status}
                                onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    try {
                                        await api.patch(`/seller/${orderId}/status`, newStatus, {
                                            headers: { 'Content-Type': 'text/plain' }
                                        });
                                        setOrder({ ...order, status: newStatus });
                                        // toast.success(`Order status updated to ${newStatus}`);
                                    } catch (error) {
                                        console.error("Failed to update status", error);
                                        alert("Failed to update status: " + (error.response?.data?.message || error.message));
                                    }
                                }}
                                className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${getStatusColor(order.status)} bg-opacity-20 border-0`}
                                disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                            >
                                <option value="PENDING" disabled={order.status !== 'PENDING'}>PENDING</option>
                                <option value="PROCESSING" disabled={order.status !== 'PENDING'}>PROCESSING</option>
                                <option value="SHIPPED" disabled={order.status !== 'PROCESSING'}>SHIPPED</option>
                                <option value="DELIVERED" disabled={order.status !== 'SHIPPED'}>DELIVERED</option>
                                <option value="CANCELLED" disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}>CANCELLED</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Package className="h-5 w-5 mr-2 text-gray-500" />
                                    Order Items
                                </h2>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item) => (
                                        <li key={item.productId} className="p-6 flex items-center gap-4">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={item.image || 'https://via.placeholder.com/150'}
                                                    alt={item.productName}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-base font-medium text-gray-900">{item.productName || 'Unknown Product'}</h3>
                                                <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity || 0}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-medium text-gray-900">${Number(item.totalPrice || 0).toFixed(2)}</p>
                                                <p className="mt-1 text-sm text-gray-500">${Number(item.unitPrice || 0).toFixed(2)} each</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-6 text-center text-gray-500">No items found for this order</li>
                                )}
                            </ul>
                        </div>

                        {/* Order Timeline */}
                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                                    Order Timeline
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="relative">
                                    {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, index, array) => {
                                        const isCompleted = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status) >= index;
                                        const isCurrent = order.status === step;

                                        return (
                                            <div key={step} className="flex items-start mb-8 last:mb-0 relative">
                                                {/* Line */}
                                                {index !== array.length - 1 && (
                                                    <div className={`absolute left-3.5 top-8 bottom-0 w-0.5 -ml-px ${isCompleted ? 'bg-indigo-600' : 'bg-gray-200'}`} style={{ height: 'calc(100% + 1rem)' }}></div>
                                                )}

                                                {/* Dot */}
                                                <div className={`relative flex items-center justify-center flex-shrink-0 w-7 h-7 rounded-full border-2 mr-4 ${isCompleted ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'
                                                    }`}>
                                                    {isCompleted && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {step.charAt(0) + step.slice(1).toLowerCase()}
                                                    </p>
                                                    {isCurrent && (
                                                        <p className="text-xs text-gray-500 mt-0.5">Current Status</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Breakdown */}
                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                                    Order Summary
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>${Number(order.totalAmount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax (0%)</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <span className="text-xl font-bold text-indigo-600">${Number(order.totalAmount || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Customer & Shipping Info */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <User className="h-5 w-5 mr-2 text-gray-500" />
                                    Customer Details
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Name</p>
                                    <p className="mt-1 text-base text-gray-900">{order.customerName || 'N/A'}</p>
                                </div>
                                <div className="flex items-start">
                                    <Mail className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="mt-1 text-sm text-gray-900">{order.customerEmail || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Phone className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Phone</p>
                                        <p className="mt-1 text-sm text-gray-900">{order.customerPhone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                                    Shipping Address
                                </h2>
                            </div>
                            <div className="p-6">
                                <p className="text-base font-medium text-gray-900 mb-2">{order.fullName || 'N/A'}</p>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>{order.line1 || ''}</p>
                                    {order.line2 && <p>{order.line2}</p>}
                                    <p>{order.city || ''}, {order.state || ''} {order.pincode || ''}</p>
                                    <p className="mt-2 flex items-center text-gray-500">
                                        <Phone className="h-4 w-4 mr-2" />
                                        {order.phone || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment & Shipping Info */}
                        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                                    Payment & Shipping
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Payment Method</p>
                                    <p className="mt-1 text-sm text-gray-900">{order.paymentMethod || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Shipping Method</p>
                                    <p className="mt-1 text-sm text-gray-900">{order.shippingMethod || 'Standard'}</p>
                                </div>
                                {order.notes && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Order Notes</p>
                                        <p className="mt-1 text-sm text-gray-900 italic">"{order.notes}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SellerOrderDetailsPage;
