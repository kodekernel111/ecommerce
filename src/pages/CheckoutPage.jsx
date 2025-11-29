import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, CreditCard, Truck, Package } from 'lucide-react';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { items, totalAmount } = useSelector((state) => state.cart);
    const [step, setStep] = useState(1); // 1: Shipping, 2: Delivery, 3: Review, 4: Payment, 5: Confirmation

    const [deliveryMethod, setDeliveryMethod] = useState('standard'); // 'standard' or 'express'
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking', 'paypal', 'stripe'
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
        cardNumber: '',
        expiry: '',
        cvc: '',
        upiId: '',
        bankName: ''
    });

    const shippingCost = deliveryMethod === 'express' ? 10 : 0;
    const finalTotal = totalAmount + shippingCost - discount;

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateShipping = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
        else if (!/^\d{6}$/.test(formData.postalCode)) newErrors.postalCode = 'Invalid postal code (6 digits)';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePayment = () => {
        const newErrors = {};

        if (paymentMethod === 'card') {
            if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
            else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Invalid card number (16 digits)';

            if (!formData.expiry) newErrors.expiry = 'Expiry date is required';
            else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) newErrors.expiry = 'Invalid expiry format (MM/YY)';

            if (!formData.cvc) newErrors.cvc = 'CVC is required';
            else if (!/^\d{3}$/.test(formData.cvc)) newErrors.cvc = 'Invalid CVC (3 digits)';
        } else if (paymentMethod === 'upi') {
            if (!formData.upiId) newErrors.upiId = 'UPI ID is required';
            else if (!/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) newErrors.upiId = 'Invalid UPI ID format';
        } else if (paymentMethod === 'netbanking') {
            if (!formData.bankName) newErrors.bankName = 'Please select a bank';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleShippingSubmit = (e) => {
        e.preventDefault();
        if (validateShipping()) {
            setStep(2); // Go to Delivery
            window.scrollTo(0, 0);
        }
    };

    const handleDeliverySubmit = (e) => {
        e.preventDefault();
        setStep(3); // Go to Review
        window.scrollTo(0, 0);
    };

    const handleReviewContinue = () => {
        setStep(4); // Go to Payment
        window.scrollTo(0, 0);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        if (validatePayment()) {
            // Simulate order placement
            setTimeout(() => {
                setStep(5); // Go to Confirmation
                window.scrollTo(0, 0);
            }, 1500);
        }
    };

    const applyCoupon = () => {
        if (couponCode.toUpperCase() === 'SAVE10') {
            setDiscount(10);
            alert('Coupon applied! $10 off.');
        } else {
            alert('Invalid coupon code.');
            setDiscount(0);
        }
    };

    if (items.length === 0 && step !== 5) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center px-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
                        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
                            Go back to shopping
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">

                {step === 5 ? (
                    <div className="max-w-3xl mx-auto text-center py-16">
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-8">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Order Placed Successfully!</h1>
                        <p className="text-lg text-gray-500 mb-8">
                            Thank you for your purchase, {formData.firstName}. Your order has been confirmed and will be shipped soon.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/orders"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                View My Orders
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                        {/* Checkout Form */}
                        <div className="lg:col-span-7">
                            <div className="mb-8">
                                <nav aria-label="Progress">
                                    <ol role="list" className="flex items-center">
                                        <li className={`relative pr-8 sm:pr-20 ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                            <div className="flex items-center">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'}`}>
                                                    <Truck className="h-4 w-4" />
                                                </div>
                                                <span className="hidden sm:inline ml-2 text-sm font-medium">Shipping</span>
                                            </div>
                                        </li>
                                        <li className={`relative pr-8 sm:pr-20 ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                            <div className="flex items-center">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'}`}>
                                                    <Package className="h-4 w-4" />
                                                </div>
                                                <span className="hidden sm:inline ml-2 text-sm font-medium">Delivery</span>
                                            </div>
                                        </li>
                                        <li className={`relative pr-8 sm:pr-20 ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                            <div className="flex items-center">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'}`}>
                                                    <CheckCircle className="h-4 w-4" />
                                                </div>
                                                <span className="hidden sm:inline ml-2 text-sm font-medium">Review</span>
                                            </div>
                                        </li>
                                        <li className={`relative ${step >= 4 ? 'text-indigo-600' : 'text-gray-400'}`}>
                                            <div className="flex items-center">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${step >= 4 ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'}`}>
                                                    <CreditCard className="h-4 w-4" />
                                                </div>
                                                <span className="hidden sm:inline ml-2 text-sm font-medium">Payment</span>
                                            </div>
                                        </li>
                                    </ol>
                                </nav>
                            </div>

                            {step === 1 && (
                                <form onSubmit={handleShippingSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 sm:p-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
                                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.firstName ? 'border-red-300' : 'border-gray-300'}`}
                                            />
                                            {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.lastName ? 'border-red-300' : 'border-gray-300'}`}
                                            />
                                            {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.address ? 'border-red-300' : 'border-gray-300'}`}
                                            />
                                            {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.city ? 'border-red-300' : 'border-gray-300'}`}
                                            />
                                            {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal code</label>
                                            <input
                                                type="text"
                                                id="postalCode"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.postalCode ? 'border-red-300' : 'border-gray-300'}`}
                                            />
                                            {errors.postalCode && <p className="mt-1 text-xs text-red-600">{errors.postalCode}</p>}
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <button
                                            type="submit"
                                            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Continue to Delivery
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 2 && (
                                <form onSubmit={handleDeliverySubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 sm:p-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Method</h2>
                                    <div className="space-y-4">
                                        <div
                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${deliveryMethod === 'standard' ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                                            onClick={() => setDeliveryMethod('standard')}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="delivery-method"
                                                    value="standard"
                                                    checked={deliveryMethod === 'standard'}
                                                    onChange={() => setDeliveryMethod('standard')}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <label className="ml-3 block text-sm font-medium text-gray-700">
                                                    Standard Delivery
                                                </label>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">Free</span>
                                        </div>
                                        <div
                                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${deliveryMethod === 'express' ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                                            onClick={() => setDeliveryMethod('express')}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="delivery-method"
                                                    value="express"
                                                    checked={deliveryMethod === 'express'}
                                                    onChange={() => setDeliveryMethod('express')}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <label className="ml-3 block text-sm font-medium text-gray-700">
                                                    Express Delivery
                                                </label>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">$10.00</span>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Continue to Review
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 3 && (
                                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 sm:p-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Order</h2>
                                    <div className="space-y-6">
                                        <div className="border-b border-gray-200 pb-4">
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h3>
                                            <p className="text-sm text-gray-600">{formData.firstName} {formData.lastName}</p>
                                            <p className="text-sm text-gray-600">{formData.address}</p>
                                            <p className="text-sm text-gray-600">{formData.city}, {formData.postalCode}</p>
                                        </div>
                                        <div className="border-b border-gray-200 pb-4">
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">Delivery Method</h3>
                                            <p className="text-sm text-gray-600 capitalize">{deliveryMethod} Delivery</p>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleReviewContinue}
                                            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Proceed to Payment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <form onSubmit={handlePaymentSubmit} className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 sm:p-8">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>

                                    {/* Payment Method Selection */}
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
                                        {['card', 'upi', 'netbanking', 'paypal', 'stripe'].map((method) => (
                                            <div
                                                key={method}
                                                onClick={() => setPaymentMethod(method)}
                                                className={`cursor-pointer flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-gray-50 transition-colors ${paymentMethod === method ? 'border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                                            >
                                                {method === 'card' && <CreditCard className="h-6 w-6 text-gray-600 mb-1" />}
                                                {method === 'upi' && <span className="text-lg font-bold text-gray-600 mb-1">UPI</span>}
                                                {method === 'netbanking' && <span className="text-lg font-bold text-gray-600 mb-1">NB</span>}
                                                {method === 'paypal' && <span className="text-lg font-bold text-blue-600 mb-1">Pay</span>}
                                                {method === 'stripe' && <span className="text-lg font-bold text-indigo-600 mb-1">S</span>}
                                                <span className="text-xs font-medium text-gray-900 capitalize">{method}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-6">
                                        {paymentMethod === 'card' && (
                                            <>
                                                <div>
                                                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card number</label>
                                                    <input
                                                        type="text"
                                                        id="cardNumber"
                                                        name="cardNumber"
                                                        placeholder="0000 0000 0000 0000"
                                                        value={formData.cardNumber}
                                                        onChange={handleInputChange}
                                                        className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.cardNumber ? 'border-red-300' : 'border-gray-300'}`}
                                                    />
                                                    {errors.cardNumber && <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
                                                        <input
                                                            type="text"
                                                            id="expiry"
                                                            name="expiry"
                                                            placeholder="MM/YY"
                                                            value={formData.expiry}
                                                            onChange={handleInputChange}
                                                            className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.expiry ? 'border-red-300' : 'border-gray-300'}`}
                                                        />
                                                        {errors.expiry && <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>}
                                                    </div>
                                                    <div>
                                                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                                                        <input
                                                            type="text"
                                                            id="cvc"
                                                            name="cvc"
                                                            placeholder="123"
                                                            value={formData.cvc}
                                                            onChange={handleInputChange}
                                                            className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.cvc ? 'border-red-300' : 'border-gray-300'}`}
                                                        />
                                                        {errors.cvc && <p className="mt-1 text-xs text-red-600">{errors.cvc}</p>}
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {paymentMethod === 'upi' && (
                                            <div>
                                                <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">UPI ID</label>
                                                <input
                                                    type="text"
                                                    id="upiId"
                                                    name="upiId"
                                                    placeholder="username@upi"
                                                    value={formData.upiId || ''}
                                                    onChange={handleInputChange}
                                                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.upiId ? 'border-red-300' : 'border-gray-300'}`}
                                                />
                                                {errors.upiId && <p className="mt-1 text-xs text-red-600">{errors.upiId}</p>}
                                                <p className="mt-2 text-xs text-gray-500">Enter your Virtual Payment Address (VPA) to pay via UPI.</p>
                                            </div>
                                        )}

                                        {paymentMethod === 'netbanking' && (
                                            <div>
                                                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Select Bank</label>
                                                <select
                                                    id="bankName"
                                                    name="bankName"
                                                    value={formData.bankName || ''}
                                                    onChange={handleInputChange}
                                                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 ${errors.bankName ? 'border-red-300' : 'border-gray-300'}`}
                                                >
                                                    <option value="">Select a bank</option>
                                                    <option value="HDFC">HDFC Bank</option>
                                                    <option value="ICICI">ICICI Bank</option>
                                                    <option value="SBI">State Bank of India</option>
                                                    <option value="AXIS">Axis Bank</option>
                                                </select>
                                                {errors.bankName && <p className="mt-1 text-xs text-red-600">{errors.bankName}</p>}
                                            </div>
                                        )}

                                        {(paymentMethod === 'paypal' || paymentMethod === 'stripe') && (
                                            <div className="text-center py-4">
                                                <p className="text-sm text-gray-500 mb-4">You will be redirected to {paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'} to complete your purchase securely.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-8 flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep(3)}
                                            className="w-full bg-white border border-gray-300 rounded-md shadow-sm py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {paymentMethod === 'paypal' || paymentMethod === 'stripe' ? `Continue with ${paymentMethod === 'paypal' ? 'PayPal' : 'Stripe'}` : 'Place Order'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-5 mt-8 lg:mt-0 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                            <ul role="list" className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <li key={item.id} className="flex py-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-16 h-16 rounded-md object-center object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex-1 flex flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>{item.name}</h3>
                                                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                <p className="text-gray-500">Qty {item.quantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <dl className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Subtotal</dt>
                                    <dd className="text-sm font-medium text-gray-900">${totalAmount.toFixed(2)}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-gray-600">Shipping</dt>
                                    <dd className="text-sm font-medium text-gray-900">
                                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                                    </dd>
                                </div>
                                {discount > 0 && (
                                    <div className="flex items-center justify-between text-green-600">
                                        <dt className="text-sm">Discount</dt>
                                        <dd className="text-sm font-medium">-${discount.toFixed(2)}</dd>
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                    <dt className="text-base font-bold text-gray-900">Total</dt>
                                    <dd className="text-base font-bold text-gray-900">${finalTotal.toFixed(2)}</dd>
                                </div>
                            </dl>

                            {/* Coupon Code */}
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Promo Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="flex-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                                    />
                                    <button
                                        type="button"
                                        onClick={applyCoupon}
                                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default CheckoutPage;
