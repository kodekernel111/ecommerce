import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios'; // Adjust path if necessary

import LazyImage from './LazyImage';

const TopDealsSection = () => {
    const [deals, setDeals] = useState([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await api.get('/public/homepage-config');
                const config = res.data;
                if (config) {
                    setVisible(config.showTopDeals);
                    if (config.topDeals) {
                        setDeals(config.topDeals.filter(d => d.active));
                    }
                }
            } catch (error) {
                console.error("Failed to load top deals", error);
                setVisible(false);
            }
        };
        fetchConfig();
    }, []);

    if (!visible || deals.length === 0) return null;

    return (
        <div className="bg-white p-4 shadow-sm rounded-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Top Deals</h2>
                <Link to="/deals" className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
                    View All
                </Link>
            </div>
            <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-2">
                {deals.map((deal, index) => {
                    const linkTo = deal.mainCategoryId ? `/category/${deal.mainCategoryId}` : '/';
                    return (
                        <Link key={deal.id || index} to={linkTo} className="flex-shrink-0 w-40 group block">
                            <div className="w-40 h-40 bg-gray-100 rounded-md overflow-hidden mb-3 border border-gray-200">
                                <LazyImage
                                    src={deal.imageUrl || 'https://via.placeholder.com/150'}
                                    alt={deal.displayTitle}
                                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 text-center mb-1 group-hover:text-indigo-600">{deal.displayTitle}</h3>
                            <p className="text-sm font-bold text-green-700 text-center">{deal.offer}</p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default TopDealsSection;
