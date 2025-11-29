import React from 'react';
import { Tag, Plus, Trash2, Copy } from 'lucide-react';

const SellerPromotions = () => {
    const coupons = [
        { id: 1, code: 'WELCOME10', discount: '10% OFF', type: 'Percentage', usage: 45, status: 'Active', expires: 'Dec 31, 2023' },
        { id: 2, code: 'FREESHIP', discount: 'Free Shipping', type: 'Fixed', usage: 12, status: 'Active', expires: 'Nov 30, 2023' },
        { id: 3, code: 'SUMMER20', discount: '20% OFF', type: 'Percentage', usage: 156, status: 'Expired', expires: 'Aug 31, 2023' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Promotions & Coupons</h3>
                    <p className="mt-1 text-sm text-gray-500">Create and manage discount codes for your customers.</p>
                </div>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Coupon
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-indigo-50 rounded p-1 mr-3">
                                                <Tag className="h-4 w-4 text-indigo-600" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 font-mono">{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.discount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.usage} uses</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${coupon.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {coupon.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coupon.expires}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3">
                                            <button className="text-gray-400 hover:text-indigo-600 transition-colors" title="Copy Code">
                                                <Copy className="h-4 w-4" />
                                            </button>
                                            <button className="text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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
    );
};

export default SellerPromotions;
