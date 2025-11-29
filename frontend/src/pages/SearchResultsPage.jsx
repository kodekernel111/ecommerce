import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { useSelector } from 'react-redux';
import { selectAllProducts } from '../features/products/productsSlice';
import { Filter } from 'lucide-react';

const SearchResultsPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const allProducts = useSelector(selectAllProducts);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortBy, setSortBy] = useState('relevance');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    useEffect(() => {
        // Mock filtering logic based on query
        // In a real app, this would likely be an API call
        const results = allProducts.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(results);
    }, [query, allProducts]);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        // Implement sorting logic here if needed
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Results for "{query}"
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
                    <FilterSidebar />

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
                                    <FilterSidebar />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Grid */}
                    <div className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
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
