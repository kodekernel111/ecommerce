import React from 'react';
import { Eye, Truck, XCircle, CheckCircle } from 'lucide-react';

const SellerOrders = () => {
    const orders = [
        { id: '#ORD-7782', customer: 'Alice Freeman', date: 'Oct 24, 2023', total: '$299.99', status: 'Pending', items: 'Premium Wireless Headphones' },
        { id: '#ORD-7783', customer: 'Bob Smith', date: 'Oct 23, 2023', total: '$199.50', status: 'Shipped', items: 'Ergonomic Office Chair' },
        { id: '#ORD-7784', customer: 'Charlie Davis', date: 'Oct 22, 2023', total: '$79.99', status: 'Delivered', items: 'Minimalist Backpack' },
        { id: '#ORD-7785', customer: 'Dana Lee', date: 'Oct 21, 2023', total: '$349.00', status: 'Pending', items: 'Smart Watch Series 5' },
        { id: '#ORD-7786', customer: 'Evan Wright', date: 'Oct 20, 2023', total: '$59.98', status: 'Delivered', items: '2x USB-C Cables' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
                <span className="text-sm text-gray-500">Manage your incoming orders</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{order.items}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="View Details">
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        {order.status === 'Pending' && (
                                            <>
                                                <button className="text-gray-400 hover:text-green-600 transition-colors" title="Mark as Shipped">
                                                    <Truck className="h-5 w-5" />
                                                </button>
                                                <button className="text-gray-400 hover:text-red-600 transition-colors" title="Cancel Order">
                                                    <XCircle className="h-5 w-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerOrders;
