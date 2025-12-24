import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle, MapPin, CreditCard } from 'lucide-react';

const OrderDetailsBuyerPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await api.get(`/api/orders/${orderId}`);
                setOrder(response.data);
            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("Failed to load order details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex flex-col items-center justify-center px-4">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                    <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/orders')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Orders
                    </button>
                </div>
            </div>
        </div>
    );

    if (!order) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'PROCESSING': return <Package className="w-5 h-5 text-blue-500" />;
            case 'SHIPPED': return <Truck className="w-5 h-5 text-indigo-500" />;
            case 'DELIVERED': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'CANCELLED': return <XCircle className="w-5 h-5 text-red-500" />;
            default: return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to My Orders
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                Order #{order.orderId}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Placed on {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                            </p>
                        </div>
                        <div className={`mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-2">{order.status}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Status Timeline */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Status</h2>
                            <div className="relative">
                                <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2 hidden md:block"></div>
                                <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                                    {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((step, index) => {
                                        const steps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
                                        const currentStepIndex = steps.indexOf(order.status);
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;

                                        return (
                                            <div key={step} className="flex flex-row md:flex-col items-center gap-4 md:gap-2 bg-white md:bg-transparent p-2 md:p-0 rounded-lg">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-300'
                                                    }`}>
                                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full bg-gray-300" />}
                                                </div>
                                                <span className={`text-sm font-medium ${isCurrent ? 'text-indigo-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {step.charAt(0) + step.slice(1).toLowerCase()}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
                                <span className="text-sm text-gray-500">{order.items.length} Items</span>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {order.items.map((item) => (
                                    <li key={item.productId} className="p-6 flex items-start">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <img
                                                src={item.image || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&w=200&q=80"}
                                                alt={item.productName}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="ml-6 flex-1 flex flex-col">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="text-base font-medium text-gray-900">
                                                        {item.productName}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-base font-medium text-gray-900">
                                                    ₹{item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="mt-4 flex items-end justify-between">
                                                <p className="text-sm font-medium text-indigo-600">
                                                    Total: ₹{item.totalPrice ? item.totalPrice.toFixed(2) : '0.00'}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Delivery & Tracking Info */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Truck className="w-5 h-5 mr-2 text-gray-400" />
                                    Delivery Information
                                </h2>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Carrier</p>
                                    <p className="font-medium text-gray-900">FedEx Express</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                                    <p className="font-medium text-indigo-600 font-mono">{order.orderId ? order.orderId.substring(0, 12).toUpperCase() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
                                    <p className="font-medium text-green-600">
                                        {order.orderDate ? new Date(new Date(order.orderDate).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Calculating...'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Shipping Weight</p>
                                    <p className="font-medium text-gray-900">1.2 kg</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Activity Log */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Order Updates</h2>
                            </div>
                            <div className="p-6">
                                <ol className="relative border-l border-gray-200">
                                    <li className="mb-6 ml-4">
                                        <div className="absolute w-3 h-3 bg-indigo-600 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                        <time className="mb-1 text-sm font-normal leading-none text-gray-400">{new Date(order.orderDate).toLocaleTimeString()}</time>
                                        <h3 className="text-base font-semibold text-gray-900">Order Processed</h3>
                                        <p className="mb-4 text-sm font-normal text-gray-500">Your order has been confirmed and is being prepared for shipping.</p>
                                    </li>
                                    <li className="ml-4">
                                        <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                        <time className="mb-1 text-sm font-normal leading-none text-gray-400">{new Date(order.orderDate).toLocaleDateString()}</time>
                                        <h3 className="text-base font-semibold text-gray-900">Order Placed</h3>
                                        <p className="text-sm font-normal text-gray-500">Order #{order.orderId} has been successfully placed.</p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Summary & Details */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                            </div>
                            <div className="px-6 py-4 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Tax</span>
                                    <span>₹0.00</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-medium text-gray-900">
                                    <span>Total Amount</span>
                                    <span>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="px-6 pb-6 pt-2">
                                <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                    <Clock className="mr-2 h-4 w-4 text-gray-500" /> Download Invoice
                                </button>
                            </div>
                        </div>

                        {/* Shipping Details */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                                    Shipping Details
                                </h2>
                            </div>
                            <div className="px-6 py-4 text-sm text-gray-600 space-y-1">
                                <p className="font-semibold text-gray-900">{order.fullName || order.customerName}</p>
                                <p>{order.line1}</p>
                                {order.line2 && <p>{order.line2}</p>}
                                <p>{order.city}, {order.state} - {order.pincode}</p>
                                <p className="mt-3 flex items-center text-gray-500">
                                    <span className="font-medium mr-2">Phone:</span> {order.phone}
                                </p>
                            </div>
                        </div>

                        {/* Payment Details */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                                    Payment Information
                                </h2>
                            </div>
                            <div className="px-6 py-4 text-sm text-gray-600">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Method</span>
                                    <span className="uppercase">{order.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Status</span>
                                    <span className="text-green-600 font-medium flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-1" /> Paid
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Help Section */}
                        <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-100">
                            <h3 className="text-sm font-medium text-indigo-900 mb-2">Need Help with this order?</h3>
                            <p className="text-xs text-indigo-700 mb-4">
                                If you have issues with your order, items, or delivery, please contact our support team.
                            </p>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
                                Contact Support &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderDetailsBuyerPage;
