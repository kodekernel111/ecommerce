import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { items: products } = useSelector((state) => state.products);

    const [priceRange, setPriceRange] = React.useState([0, 1000]);
    const [sortBy, setSortBy] = React.useState('newest');

    // Filter products by category (case-insensitive)
    const categoryProducts = products.filter(
        (product) => product.category.toLowerCase() === categoryName.toLowerCase()
    );

    // Apply filters and sorting
    const filteredProducts = categoryProducts
        .filter(product => product.price >= priceRange[0] && product.price <= priceRange[1])
        .sort((a, b) => {
            if (sortBy === 'price-low-high') return a.price - b.price;
            if (sortBy === 'price-high-low') return b.price - a.price;
            return b.id - a.id; // Newest (mock using ID)
        });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="border-b border-gray-200 pb-5 mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 capitalize">{categoryName}</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Showing {categoryProducts.length} results for "{categoryName}"
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
                                        max="1000"
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
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
                                {filteredProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
                                <p className="text-xl text-gray-500">No products found matching your criteria.</p>
                                <button
                                    onClick={() => {
                                        setPriceRange([0, 1000]);
                                        setSortBy('newest');
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
