import React from 'react';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';

const SellerPayments = () => {
    const transactions = [
        { id: 'TRX-9901', date: 'Oct 24, 2023', type: 'Sale', amount: '+$299.99', fee: '-$8.70', net: '+$291.29', status: 'Pending' },
        { id: 'TRX-9902', date: 'Oct 23, 2023', type: 'Sale', amount: '+$199.50', fee: '-$5.79', net: '+$193.71', status: 'Completed' },
        { id: 'TRX-9903', date: 'Oct 21, 2023', type: 'Payout', amount: '-$1,250.00', fee: '$0.00', net: '-$1,250.00', status: 'Completed' },
        { id: 'TRX-9904', date: 'Oct 20, 2023', type: 'Sale', amount: '+$59.98', fee: '-$1.74', net: '+$58.24', status: 'Completed' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                                <DollarSign className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Earnings</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">$12,450.00</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Available for Payout</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">$845.20</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Next Payout Date</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">Nov 01, 2023</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Transaction History</h3>
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                        <Download className="h-4 w-4 mr-1" />
                        Export CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trx.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trx.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trx.type === 'Sale' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {trx.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trx.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{trx.fee}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{trx.net}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trx.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerPayments;
