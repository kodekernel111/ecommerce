import React, { useState } from 'react';
import { Star } from 'lucide-react';

const FilterSidebar = () => {
    const [priceRange, setPriceRange] = useState(10000);

    return (
        <div className="w-64 flex-shrink-0 pr-8 hidden lg:block">
            <div className="space-y-8">
                {/* Categories */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900">Category</h3>
                    <div className="mt-4 space-y-2">
                        {['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Toys'].map((category) => (
                            <div key={category} className="flex items-center">
                                <input
                                    id={`category-${category}`}
                                    name="category"
                                    type="checkbox"
                                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-600">
                                    {category}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
                    <div className="mt-4">
                        <input
                            type="range"
                            min="0"
                            max="50000"
                            step="100"
                            value={priceRange}
                            onChange={(e) => setPriceRange(e.target.value)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                            <span>₹0</span>
                            <span>₹{priceRange}</span>
                        </div>
                    </div>
                </div>

                {/* Rating */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900">Rating</h3>
                    <div className="mt-4 space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center">
                                <input
                                    id={`rating-${rating}`}
                                    name="rating"
                                    type="checkbox"
                                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor={`rating-${rating}`} className="ml-3 text-sm text-gray-600 flex items-center">
                                    {rating} <Star className="h-3 w-3 text-yellow-400 fill-current ml-1" /> & up
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Availability */}
                <div>
                    <h3 className="text-sm font-medium text-gray-900">Availability</h3>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center">
                            <input
                                id="exclude-out-of-stock"
                                name="availability"
                                type="checkbox"
                                className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="exclude-out-of-stock" className="ml-3 text-sm text-gray-600">
                                Exclude Out of Stock
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
