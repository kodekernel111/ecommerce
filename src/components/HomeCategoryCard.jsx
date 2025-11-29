import React from 'react';
import { Link } from 'react-router-dom';

const HomeCategoryCard = ({ title, items, linkText, linkTo = "/" }) => {
    return (
        <div className="bg-white p-4 shadow-sm rounded-sm flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4 flex-grow">
                {items.map((item, index) => (
                    <Link key={index} to={item.link || "/"} className="block group">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 rounded-sm mb-1">
                            <img
                                src={item.image}
                                alt={item.label}
                                className="w-full h-full object-center object-cover group-hover:opacity-75"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                        {item.offer && (
                            <p className="text-xs font-bold text-green-700">{item.offer}</p>
                        )}
                    </Link>
                ))}
            </div>
            <Link to={linkTo} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline mt-auto">
                {linkText}
            </Link>
        </div>
    );
};

export default HomeCategoryCard;
