import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, ShoppingCart } from 'lucide-react';

const WishlistPage = () => {
    // Mock wishlist data since we don't have a slice for it yet
    const wishlistItems = [
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            price: 299.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
            inStock: true
        },
        {
            id: 2,
            name: 'Ergonomic Office Chair',
            price: 199.50,
            image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80',
            inStock: false
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Wishlist</h1>

                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="group relative bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 sm:aspect-none sm:h-64">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-center object-cover sm:w-full sm:h-full"
                                    />
                                </div>
                                <div className="flex-1 p-4 space-y-2 flex flex-col">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        <Link to={`/product/${item.id}`}>
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {item.name}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-gray-500">{item.inStock ? 'In Stock' : 'Out of Stock'}</p>
                                    <div className="flex-1 flex flex-col justify-end">
                                        <p className="text-base font-medium text-gray-900">${item.price.toFixed(2)}</p>
                                    </div>
                                    <button className="mt-4 w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 flex items-center justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-10 relative">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Move to Cart
                                    </button>
                                </div>
                                <button className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 z-10 text-red-500">
                                    <Heart className="h-5 w-5 fill-current" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Heart className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No items in wishlist</h3>
                        <p className="mt-1 text-sm text-gray-500">Start adding items you love!</p>
                        <div className="mt-6">
                            <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default WishlistPage;
