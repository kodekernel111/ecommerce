import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Truck, XCircle, CheckCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import api from '../../api/axios';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    // Filter State
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const sellerId = localStorage.getItem('userId');
                if (!sellerId) return;

                const params = new URLSearchParams();
                params.append('sellerId', sellerId);
                params.append('page', currentPage);
                params.append('size', pageSize);
                if (search) params.append('search', search);
                if (status && status !== 'ALL') params.append('status', status);
                if (startDate) params.append('startDate', startDate);
                if (endDate) params.append('endDate', endDate);

                const response = await api.get(`/seller/orders?${params.toString()}`);
                setOrders(response.data.orders || []);
                setTotalPages(response.data.totalPages || 0);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchOrders();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [currentPage, search, status, startDate, endDate]);

    const handleResetFilters = () => {
        setSearch('');
        setStatus('');
        setStartDate('');
        setEndDate('');
        setCurrentPage(0);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading && !orders.length) {
        return <div className="p-10 text-center">Loading orders...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Filter Orders</h2>
                    <button
                        onClick={handleResetFilters}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors mt-2 md:mt-0"
                    >
                        Clear all filters
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Search */}
                    <div className="md:col-span-4 relative">
                        <label htmlFor="search" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Search</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                id="search"
                                className="block w-full pl-10 pr-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-shadow shadow-sm hover:border-gray-400"
                                placeholder="Order ID, Customer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="md:col-span-3">
                        <label htmlFor="status" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                        <div className="relative">
                            <select
                                id="status"
                                className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-400 transition-all appearance-none bg-no-repeat bg-right"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundSize: `1.5em 1.5em` }}
                            >
                                <option value="">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="md:col-span-5 grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="startDate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">From</label>
                            <input
                                type="date"
                                id="startDate"
                                className="block w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-400 transition-shadow"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">To</label>
                            <input
                                type="date"
                                id="endDate"
                                className="block w-full px-3 py-2 text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-400 transition-shadow"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Orders</h3>
                    <span className="text-sm text-gray-500">Manage your incoming orders</span>
                </div>
                <div className="space-y-4 p-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No orders found matching your criteria.</div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.orderId} className="bg-white shadow rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow min-h-[165px]">
                                <div className="flex flex-col sm:flex-row justify-between gap-4 h-full">
                                    {/* Left Side */}
                                    <div className="flex-1 flex gap-4">
                                        {order.image && (
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={order.image}
                                                    alt="Product"
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                        )}
                                        <div className="space-y-3">
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
                        )))}
                    {/* Fill empty rows to maintain height with static empty cards */}
                    {(orders.length < pageSize || (orders.length === 0 && !loading)) && [...Array(Math.max(0, pageSize - orders.length))].map((_, idx) => (
                        <div key={`empty-static-${idx}`} className="bg-white shadow rounded-lg border border-gray-200 p-4 h-[165px]">
                        </div>
                    ))}
                </div>
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{currentPage + 1}</span> of <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <span className="sr-only">Previous</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                {[...Array(Math.min(5, totalPages)).keys()].map((_, idx) => {
                                    let pageNum = currentPage - 2 + idx;
                                    if (currentPage < 2) pageNum = idx;
                                    if (currentPage > totalPages - 3) pageNum = totalPages - 5 + idx;
                                    if (pageNum < 0 || pageNum >= totalPages) return null;

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum + 1}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                                >
                                    <span className="sr-only">Next</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerOrders;
