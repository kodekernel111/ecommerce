import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const CategoryBar = () => {
    const categories = [
        'All',
        'Sell',
        'Bestsellers',
        'Mobiles',
        'Customer Service',
        'New Releases',
        'Prime',
        'Electronics',
        'Fashion',
        'Home & Kitchen',
        'Computers'
    ];

    return (
        <div className="bg-white border-b border-gray-200 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-10 space-x-6 overflow-x-auto no-scrollbar">
                    <Link to="/" className="flex items-center gap-1 font-medium text-gray-700 hover:text-indigo-600 px-2 py-1 rounded-md whitespace-nowrap transition-colors duration-200">
                        <Menu className="h-5 w-5" />
                        All
                    </Link>
                    {categories.slice(1).map((category) => (
                        <Link
                            key={category}
                            to={`/category/${category}`}
                            className="font-medium text-gray-600 hover:text-indigo-600 px-2 py-1 rounded-md whitespace-nowrap transition-colors duration-200"
                        >
                            {category}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;
