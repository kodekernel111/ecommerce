import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [displayTitle, setDisplayTitle] = useState(categoryName);

    const [priceRange, setPriceRange] = useState([0, 10000]);
    // Default to 'top-deals' if user clicks a deal, or 'newest' otherwise?
    // We'll default to 'top-deals' as requested by user context.
    const [sortBy, setSortBy] = useState('top-deals');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                let actualCategoryName = categoryName;

                // Check if categoryName is a UUID
                const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryName);

                if (isUuid) {
                    try {
                        const catRes = await api.get(`/categories/${categoryName}`);
                        if (catRes.data && catRes.data.name) {
                            actualCategoryName = catRes.data.name;
                            setDisplayTitle(catRes.data.name);
                        }
                    } catch (e) {
                        console.error("Failed to resolve category ID", e);
                    }
                } else {
                    setDisplayTitle(categoryName);
                }

                // Build query params
                const params = new URLSearchParams();
                if (actualCategoryName) params.append('category', actualCategoryName);
                if (sortBy) params.append('sort', sortBy);
                if (priceRange[0] !== undefined) params.append('minPrice', priceRange[0]);
                if (priceRange[1] !== undefined) params.append('maxPrice', priceRange[1]);
                params.append('size', 9); // Consistent page size
                params.append('page', currentPage - 1);

                const productRes = await api.get(`/products?${params.toString()}`);

                if (productRes.data && productRes.data.content) {
                    setProducts(productRes.data.content);
                    setTotalPages(productRes.data.totalPages);
                } else if (Array.isArray(productRes.data)) {
                    // Fallback
                    setProducts(productRes.data);
                    setTotalPages(1);
                } else {
                    setProducts([]);
                    setTotalPages(0);
                }

            } catch (error) {
                console.error("Failed to fetch products", error);
                setProducts([]);
                setTotalPages(0);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce price range or just fetch? 
        // For simplicity, we fetch immediately. 
        // In production, debouncing slider would be better.
        const timeoutId = setTimeout(() => fetchData(), 300);
        return () => clearTimeout(timeoutId);

    }, [categoryName, sortBy, priceRange, currentPage]);

    // Reset to page 1 when filters change (except page change itself)
    useEffect(() => {
        setCurrentPage(1);
    }, [categoryName, sortBy, priceRange]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="border-b border-gray-200 pb-5 mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 capitalize">
                        {isLoading ? 'Loading...' : displayTitle}
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        {isLoading ? '...' : `Showing ${products.length} results`}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Price Range</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>${priceRange[0]}</span>
                                        <span>${priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Sort By</h4>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                >
                                    <option value="top-deals">Top Deals (Recommended)</option>
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="flex flex-col h-full">
                                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8 min-h-[1200px] content-start">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-10 flex justify-center items-center space-x-2 pb-10">
                                        <button
                                            onClick={() => {
                                                setCurrentPage(prev => Math.max(prev - 1, 1));
                                                window.scrollTo(0, 0);
                                            }}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-700">
                                            Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                                        </span>
                                        <button
                                            onClick={() => {
                                                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                                window.scrollTo(0, 0);
                                            }}
                                            disabled={currentPage >= totalPages}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                                <p className="text-xl text-gray-500">No products found for "{displayTitle}".</p>
                                <button
                                    onClick={() => {
                                        setPriceRange([0, 10000]);
                                        setSortBy('top-deals');
                                    }}
                                    className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CategoryPage;
