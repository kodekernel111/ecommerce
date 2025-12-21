import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import api from '../api/axios';

const CategoryBar = () => {
    const [categories, setCategories] = React.useState([]);

    React.useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                // The backend /categories endpoint now returns only root categories, so no need to filter.
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="bg-white border-b border-gray-200 text-sm relative z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-10 space-x-6 overflow-x-auto md:overflow-visible no-scrollbar">
                    <Link to="/" className="flex items-center gap-1 font-medium text-gray-700 hover:text-indigo-600 px-2 py-1 rounded-md whitespace-nowrap transition-colors duration-200">
                        <Menu className="h-5 w-5" />
                        All
                    </Link>
                    {categories.map((category) => (
                        <div key={category.id} className="relative group">
                            <Link
                                to={`/category/${category.id}`}
                                className="font-medium text-gray-600 hover:text-indigo-600 px-2 py-1 rounded-md whitespace-nowrap transition-colors duration-200 block"
                            >
                                {category.name}
                            </Link>

                            {/* Dropdown for subcategories */}
                            {category.subCategories && category.subCategories.length > 0 && (
                                <div className="absolute left-0 top-full pt-2 w-64 hidden group-hover:block z-50 animate-fade-in-up">
                                    <div className="bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 overflow-visible py-2">
                                        {category.subCategories.map((sub) => (
                                            <div key={sub.id} className="relative group/sub">
                                                <Link
                                                    to={`/category/${sub.id}`}
                                                    className="flex justify-between items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150"
                                                >
                                                    <span className="font-medium">{sub.name}</span>
                                                    {sub.subCategories && sub.subCategories.length > 0 && (
                                                        <span className="text-gray-400 group-hover/sub:text-indigo-500 transition-colors duration-150">
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </Link>
                                                {/* Tertiary Dropdown */}
                                                {sub.subCategories && sub.subCategories.length > 0 && (
                                                    <div className="absolute left-full top-0 w-64 hidden group-hover/sub:block z-50 pl-2 -ml-1">
                                                        <div className="bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden py-2">
                                                            {sub.subCategories.map((tertiary) => (
                                                                <Link
                                                                    key={tertiary.id}
                                                                    to={`/category/${tertiary.id}`}
                                                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors duration-150"
                                                                >
                                                                    {tertiary.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;
