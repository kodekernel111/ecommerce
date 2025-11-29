import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Store, Menu, User, Search, Heart, LogOut, Package, LayoutDashboard, LogIn } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart } from '../features/cart/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

import CategoryBar from './CategoryBar';

const Navbar = ({ showCategories = true }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const totalQuantity = useSelector((state) => state.cart.totalQuantity);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // Implement logout logic here (e.g., clear auth state)
        console.log('Logging out...');
        setIsUserMenuOpen(false);
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Store className="h-8 w-8 text-indigo-600" />
                            <span className="font-bold text-xl text-gray-900">ChorBazaar</span>
                        </Link>
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            <Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium">
                                Home
                            </Link>
                            <Link to="/orders" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                                Orders
                            </Link>
                            <Link to="/seller" className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
                                Seller Dashboard
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-center">
                        <div className="max-w-lg w-full lg:max-w-xs">
                            <label htmlFor="search" className="sr-only">Search</label>
                            <form onSubmit={handleSearch} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="search"
                                    name="search"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Search products..."
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/wishlist" className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">View wishlist</span>
                            <Heart className="h-6 w-6" />
                        </Link>

                        {/* User Dropdown */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="sr-only">Open user menu</span>
                                <User className="h-6 w-6" />
                            </button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">My Account</p>
                                    </div>
                                    <div
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            navigate('/profile');
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                                    >
                                        <User className="h-4 w-4" />
                                        Profile
                                    </div>
                                    <Link
                                        to="/orders"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <Package className="h-4 w-4" />
                                        My Orders
                                    </Link>
                                    <Link
                                        to="/seller"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        Seller Dashboard
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                        onClick={() => setIsUserMenuOpen(false)}
                                    >
                                        <LogIn className="h-4 w-4" />
                                        Login
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => dispatch(toggleCart())}
                            className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                        >
                            <span className="sr-only">View notifications</span>
                            <ShoppingCart className="h-6 w-6" />
                            {totalQuantity > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {totalQuantity}
                                </span>
                            )}
                        </button>
                        <div className="-mr-2 flex items-center md:hidden ml-4">
                            <button className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showCategories && <CategoryBar />}
        </nav>
    );
};

export default Navbar;
