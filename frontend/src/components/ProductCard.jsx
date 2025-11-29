import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();

    return (
        <Link to={`/product/${product.id}`} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-64">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-center object-cover sm:w-full sm:h-full transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
            </div>
            <div className="flex-1 p-4 space-y-2 flex flex-col">
                <h3 className="text-sm font-medium text-gray-900">
                    <span>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                    </span>
                </h3>
                <div className="flex-1 flex flex-col justify-end">
                    <p className="text-sm italic text-gray-500">{product.category}</p>
                    <div className="mt-4 flex justify-between items-center">
                        <p className="text-base font-medium text-gray-900">${product.price.toFixed(2)}</p>
                        <button
                            onClick={(e) => {
                                e.preventDefault(); // Prevent navigation from the parent anchor
                                dispatch(addToCart(product));
                            }}
                            className="relative z-10 p-2 border border-transparent rounded-full text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                            aria-label="Add to cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
