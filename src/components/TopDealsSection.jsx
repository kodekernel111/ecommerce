import React from 'react';
import { Link } from 'react-router-dom';

const TopDealsSection = () => {
    const deals = [
        { title: "Apple iPads", offer: "Shop Now!", image: "/images/top-deals/ipad.png" },
        { title: "Perfume & more", offer: "Min 50% Off", image: "/images/top-deals/perfume.png" },
        { title: "Instruments", offer: "Up to 70% Off", image: "/images/top-deals/guitar.png" },
        { title: "Instax Cameras", offer: "From ₹3,999", image: "/images/top-deals/camera.png" },
        { title: "Apple Pencil", offer: "Shop Now", image: "/images/top-deals/pencil.png" },
        { title: "Dry Fruits & Nuts", offer: "Up to 65% Off", image: "/images/top-deals/dry-fruits.png" },
        { title: "Health Supplements", offer: "Up to 70% Off", image: "/images/top-deals/supplements.png" },
        { title: "Smart Watches", offer: "Min 40% Off", image: "/images/top-deals/smart-watch.png" },
        { title: "Headphones", offer: "Up to 60% Off", image: "/images/top-deals/headphones.png" },
    ];

    return (
        <div className="bg-white p-4 shadow-sm rounded-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Top Deals</h2>
                <Link to="/" className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
                    View All
                </Link>
            </div>
            <div className="flex space-x-6 overflow-x-auto no-scrollbar pb-2">
                {deals.map((deal, index) => (
                    <Link key={index} to="/" className="flex-shrink-0 w-40 group block">
                        <div className="w-40 h-40 bg-gray-100 rounded-md overflow-hidden mb-3 border border-gray-200">
                            <img
                                src={deal.image}
                                alt={deal.title}
                                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 text-center mb-1 group-hover:text-indigo-600">{deal.title}</h3>
                        <p className="text-sm font-bold text-green-700 text-center">{deal.offer}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default TopDealsSection;
