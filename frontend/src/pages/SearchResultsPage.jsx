import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';
import { Filter } from 'lucide-react';

const SearchResultsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortBy, setSortBy] = useState('relevance');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(0);

    // Filter State
    const [filters, setFilters] = useState({
        category: [],
        maxPrice: 50000,
        minRating: 0,
        inStock: false
    });

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true);
            try {
                // Construct Query Params
                let url = `/products?search=${encodeURIComponent(query)}&sort=${sortBy}&size=9&page=${currentPage - 1}`;

                if (filters.category.length > 0) {
                    // Backend currently supports single category via this param, 
                    // or we might need to update backend to support list.
                    // For now, let's take the first one or if multiple, maybe iterate?
                    // "hasCategory" spec uses EQUAL or LIKE.
                    // If we want multiple, backend needs "in".
                    // Let's just pass the first one for now if simple, or we can try passing same param multiple times if Spring supports it
                    // But productController takes String category.
                    // Let's stick to simple: if distinct categories, it might conflict.
                    // Let's pass array join?
                    // Actually, let's just pass the last selected one or refactor backend.
                    // Implementation Plan didn't specifying backend 'IN' support.
                    // Let's assume single category selection is safest for now or just pass it.
                    // Re-reading ProductSpecification: uses "hasCategory". 
                    // If we pass, it filters.
                    if (filters.category.length === 1) {
                        url += `&category=${encodeURIComponent(filters.category[0])}`;
                    }
                }

                if (filters.maxPrice < 50000) {
                    url += `&maxPrice=${filters.maxPrice}`;
                }

                if (filters.minRating > 0) {
                    url += `&minRating=${filters.minRating}`;
                }

                if (filters.inStock) {
                    url += `&inStock=true`;
                }

                const response = await api.get(url);
                if (response.data && response.data.content) {
                    setFilteredProducts(response.data.content);
                    setTotalPages(response.data.totalPages);
                } else {
                    setFilteredProducts([]);
                    setTotalPages(0);
                }
            } catch (error) {
                console.error("Failed to fetch search results", error);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        } else {
            // If no query, we might still want to show products (browse mode)
            fetchSearchResults();
        }
    }, [query, sortBy, currentPage, filters]);

    // Update URL when page changes
    useEffect(() => {
        setSearchParams({ q: query, page: currentPage.toString() });
        window.scrollTo(0, 0);
    }, [currentPage, setSearchParams, query]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setCurrentPage(1); // Reset to page 1 on sort change
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        {query ? `Results for "${query}"` : 'All Products'}
                    </h1>
                    <div className="flex items-center">
                        <div className="relative inline-block text-left">
                            <select
                                value={sortBy}
                                onChange={handleSortChange}
                                className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900 bg-transparent border-none focus:ring-0 cursor-pointer"
                            >
                                <option value="relevance">Sort by: Relevance</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                                <option value="newest">Newest Arrivals</option>
                                <option value="rating">Avg. Customer Review</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            className="p-2 -m-2 ml-4 sm:ml-6 text-gray-400 hover:text-gray-500 lg:hidden"
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                        >
                            <span className="sr-only">Filters</span>
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-start">
                    {/* Sidebar */}
                    <FilterSidebar filters={filters} setFilters={setFilters} />

                    {/* Mobile Filter Dialog (Simplified for now) */}
                    {showMobileFilters && (
                        <div className="fixed inset-0 z-40 flex lg:hidden">
                            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowMobileFilters(false)}></div>
                            <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                <div className="flex items-center justify-between px-4">
                                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                    <button
                                        type="button"
                                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                        onClick={() => setShowMobileFilters(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <span className="text-2xl">×</span>
                                    </button>
                                </div>
                                <div className="mt-4 px-4">
                                    <FilterSidebar filters={filters} setFilters={setFilters} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Loading results...</p>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 min-h-[1200px] content-start">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                <div className="mt-10 flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-700">
                                        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages > 0 ? totalPages : 1}</span>
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= totalPages || totalPages === 0}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No products found matching "{query}".</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SearchResultsPage;
