import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart, removeFromCart, updateQuantity } from '../features/cart/cartSlice';
import { X, Trash2, Plus, Minus } from 'lucide-react';

const CartSidebar = () => {
    const dispatch = useDispatch();
    const { items, totalAmount, isOpen } = useSelector((state) => state.cart);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 overflow-hidden z-50 pointer-events-none">
            <div className="absolute inset-0 overflow-hidden">
                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex pointer-events-auto">
                    <div className="w-screen max-w-md">
                        <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                            <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Shopping cart</h2>
                                    <div className="ml-3 h-7 flex items-center">
                                        <button
                                            type="button"
                                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                            onClick={() => dispatch(toggleCart())}
                                        >
                                            <span className="sr-only">Close panel</span>
                                            <X className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <div className="flow-root">
                                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                                            {items.length === 0 ? (
                                                <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
                                            ) : (
                                                items.map((item) => (
                                                    <li key={item.id} className="py-6 flex">
                                                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-full object-center object-cover"
                                                            />
                                                        </div>

                                                        <div className="ml-4 flex-1 flex flex-col">
                                                            <div>
                                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                                    <h3>
                                                                        <a href="#">{item.name}</a>
                                                                    </h3>
                                                                    <p className="ml-4">${item.totalPrice.toFixed(2)}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                                <div className="flex items-center border rounded-md">
                                                                    <button
                                                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                                        className="p-1 hover:bg-gray-100"
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <Minus className="h-4 w-4" />
                                                                    </button>
                                                                    <span className="px-2">{item.quantity}</span>
                                                                    <button
                                                                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                                        className="p-1 hover:bg-gray-100"
                                                                    >
                                                                        <Plus className="h-4 w-4" />
                                                                    </button>
                                                                </div>

                                                                <div className="flex">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => dispatch(removeFromCart(item.id))}
                                                                        className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center gap-1"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Subtotal</p>
                                    <p>${totalAmount.toFixed(2)}</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                <div className="mt-6">
                                    <Link
                                        to="/checkout"
                                        className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                        onClick={() => dispatch(toggleCart())}
                                    >
                                        Checkout
                                    </Link>
                                </div>
                                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                    <p>
                                        or{' '}
                                        <button
                                            type="button"
                                            className="text-indigo-600 font-medium hover:text-indigo-500"
                                            onClick={() => dispatch(toggleCart())}
                                        >
                                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSidebar;
