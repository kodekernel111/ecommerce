import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
    // Mock Data for Orders
    const orders = [
        {
            id: 'ORD-123456789',
            date: 'November 25, 2023',
            total: 89999,
            status: 'Delivered',
            items: [
                {
                    id: 1,
                    name: 'Apple iPhone 15 (128 GB) - Black',
                    image: 'https://placehold.co/100x100?text=iPhone',
                    price: 79900,
                    quantity: 1
                },
                {
                    id: 2,
                    name: 'Apple 20W USB-C Power Adapter',
                    image: 'https://placehold.co/100x100?text=Adapter',
                    price: 1900,
                    quantity: 1
                }
            ]
        },
        {
            id: 'ORD-987654321',
            date: 'October 10, 2023',
            total: 2499,
            status: 'Processing',
            items: [
                {
                    id: 3,
                    name: 'Men\'s Running Shoes',
                    image: 'https://placehold.co/100x100?text=Shoes',
                    price: 2499,
                    quantity: 1
                }
            ]
        },
        {
            id: 'ORD-456123789',
            date: 'September 15, 2023',
            total: 1299,
            status: 'Cancelled',
            items: [
                {
                    id: 4,
                    name: 'Wireless Mouse',
                    image: 'https://placehold.co/100x100?text=Mouse',
                    price: 1299,
                    quantity: 1
                }
            ]
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-600';
            case 'Processing': return 'text-blue-600';
            case 'Cancelled': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle className="h-5 w-5 mr-1" />;
            case 'Processing': return <Truck className="h-5 w-5 mr-1" />;
            case 'Cancelled': return <Clock className="h-5 w-5 mr-1" />; // Using Clock as a placeholder for history/cancelled
            default: return <Package className="h-5 w-5 mr-1" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Order Placed</p>
                                        <p className="text-sm text-gray-900">{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Total</p>
                                        <p className="text-sm text-gray-900">₹{order.total.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase">Order ID</p>
                                        <p className="text-sm text-gray-900">{order.id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Link to={`/order/${order.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                        View Invoice
                                    </Link>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="px-6 py-4">
                                <div className={`flex items-center mb-4 font-medium ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-start">
                                            <div className="flex-shrink-0 h-20 w-20 border border-gray-200 rounded-md overflow-hidden">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="text-sm font-medium text-gray-900">
                                                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                                                </h4>
                                                <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                                                <p className="mt-1 text-sm font-medium text-gray-900">₹{item.price.toLocaleString()}</p>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                                    Buy it again
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderHistoryPage;
