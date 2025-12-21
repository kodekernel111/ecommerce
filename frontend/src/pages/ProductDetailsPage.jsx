import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import api from '../api/axios';
import {
    ArrowLeft,
    Plus,
    Minus,
    Star,
    ShieldCheck,
    Truck,
    RotateCcw,
    MapPin,
    Share2,
    Heart
} from 'lucide-react';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';
import Footer from '../components/Footer';
import { useToast } from '../context/ToastContext';
import LazyImage from '../components/LazyImage';

const TrustBadge = ({ icon: Icon, title, description }) => (
    <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg">
        <Icon className="h-8 w-8 text-indigo-600 mb-2" />
        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
);

const DeliveryChecker = () => {
    const [pincode, setPincode] = useState('');
    const [status, setStatus] = useState(null); // null, 'checking', 'available', 'unavailable'

    const checkDelivery = () => {
        if (pincode.length === 6) {
            setStatus('checking');
            setTimeout(() => {
                setStatus('available');
            }, 1000);
        }
    };

    return (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                Delivery Options
            </h4>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter Pincode"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                />
                <button
                    onClick={checkDelivery}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 px-3"
                >
                    Check
                </button>
            </div>
            {status === 'checking' && <p className="text-xs text-gray-500 mt-2">Checking availability...</p>}
            {status === 'available' && <p className="text-xs text-green-600 mt-2">Delivery available by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString()}</p>}
        </div>
    );
};

const ProductDetailsPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                console.error("Failed to fetch product", err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Review State
    const { user } = useSelector((state) => state.auth);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [reviewImages, setReviewImages] = useState([]);

    useEffect(() => {
        if (user) {
            setNewReview(prev => ({ ...prev, name: user.name || user.email || 'User' }));
        }
    }, [user]);

    useEffect(() => {
        if (id) {
            api.get(`/products/${id}/reviews`)
                .then(response => {
                    if (Array.isArray(response.data)) {
                        setReviews(response.data);
                    } else {
                        setReviews([]);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch reviews", err);
                    setReviews([]);
                });
        }
    }, [id]);

    const { addToast } = useToast();

    useEffect(() => {
        if (product) {
            setSelectedImage(product.images ? product.images[0] : product.image);
            setQuantity(1);
        }
    }, [product]);

    const handleAddToCart = () => {
        dispatch(addToCart({ ...product, quantity }));
        addToast(`Added ${quantity} ${product.name} to cart`, 'success');
    };

    // Check if user has already reviewed
    const existingReview = user && Array.isArray(reviews) && reviews.find(r => r.userId === user.userId || r.userId === localStorage.getItem('userId'));

    useEffect(() => {
        if (existingReview) {
            setNewReview({ rating: existingReview.rating, comment: existingReview.comment });
        }
    }, [existingReview]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting review. User:", user, "UserId:", user?.userId || localStorage.getItem('userId'), "Existing:", existingReview);
        if (newReview.comment && user) {
            const formData = new FormData();
            formData.append('userName', user.name || user.email || 'User');
            formData.append('userId', user.userId || localStorage.getItem('userId'));
            formData.append('rating', newReview.rating);
            formData.append('comment', newReview.comment);

            if (reviewImages) {
                Array.from(reviewImages).forEach(file => {
                    formData.append('images', file);
                });
            }

            try {
                const response = await api.post(`/products/${id}/reviews`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (existingReview) {
                    setReviews(reviews.map(r => r.id === response.data.id ? response.data : r));
                    addToast('Review updated successfully!', 'success');
                } else {
                    setReviews([response.data, ...reviews]);
                    addToast('Review submitted successfully!', 'success');
                }

                if (!existingReview) {
                    setNewReview({ rating: 5, comment: '' });
                    setReviewImages([]);
                }
            } catch (error) {
                console.error("Failed to submit review", error);
                addToast('Failed to submit review', 'error');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <p className="text-gray-500 text-xl">Loading product...</p>
                </main>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <CartSidebar />
                <main className="flex-grow flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
                    <Link to="/" className="text-indigo-600 hover:text-indigo-500 flex items-center gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        Back to Home
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }



    // Calculate Rating Stats
    const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;
    const ratingCounts = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900">
            <Navbar />
            <CartSidebar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Breadcrumbs */}
                <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
                        <li>/</li>
                        <li><Link to={`/category/${product.category}`} className="hover:text-indigo-600">{product.category}</Link></li>
                        {product.subCategory && (
                            <>
                                <li>/</li>
                                <li className="text-gray-500">{product.subCategory}</li>
                            </>
                        )}
                        {product.tertiaryCategory && (
                            <>
                                <li>/</li>
                                <li className="text-gray-500">{product.tertiaryCategory}</li>
                            </>
                        )}
                        <li>/</li>
                        <li className="text-gray-900 font-medium truncate max-w-xs">{product.name}</li>
                    </ol>
                </nav>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
                    {/* Left Column: Images */}
                    <div className="flex flex-col gap-4">
                        <div className="w-full h-[500px] bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative group flex items-center justify-center">
                            <LazyImage
                                src={selectedImage || product.image}
                                alt={product.name}
                                className="max-w-full max-h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                            />
                            <button className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                <Heart className="h-5 w-5" />
                            </button>
                            <button className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>

                        {product.images && product.images.length > 0 && (
                            <div className="grid grid-cols-5 gap-4">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img)}
                                        className={`h-24 w-full rounded-lg border overflow-hidden bg-gray-50 flex items-center justify-center ${selectedImage === img ? 'ring-2 ring-indigo-600 border-transparent' : 'border-gray-200 hover:border-indigo-300'}`}
                                    >
                                        <LazyImage src={img} alt="" className="max-w-full max-h-full object-contain p-2" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">{product.name}</h1>

                        {/* Rating */}
                        <div className="flex items-center mb-6">
                            <div className="flex items-center text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-500">({reviews.length} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <div className="flex items-baseline gap-4">
                                <p className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                                {product.mrp && product.mrp > product.price && (
                                    <>
                                        <p className="text-lg text-gray-500 line-through">${product.mrp.toFixed(2)}</p>
                                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                            {product.discount || Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
                        </div>

                        {/* Action Buttons */}
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mb-8">
                            {product.quantity > 0 && product.quantity < 10 && (
                                <p className="text-red-600 text-sm font-medium">Hurry! Only {product.quantity} left in stock</p>
                            )}
                            {product.quantity === 0 && (
                                <p className="text-red-600 text-lg font-bold">Out of Stock</p>
                            )}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className={`flex items-center border border-gray-300 rounded-lg ${product.quantity === 0 ? 'opacity-50' : ''}`}>
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-gray-50 text-gray-600"
                                        disabled={product.quantity === 0}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-4 font-medium text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                                        className="p-3 hover:bg-gray-50 text-gray-600"
                                        disabled={product.quantity === 0 || quantity >= product.quantity}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={product.quantity === 0}
                                    className={`flex-1 px-8 py-3 rounded-lg font-semibold transition-colors shadow-sm ${product.quantity === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    disabled={product.quantity === 0}
                                    className={`flex-1 px-8 py-3 rounded-lg font-semibold transition-colors shadow-sm ${product.quantity === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>

                        {/* Delivery Checker */}
                        <DeliveryChecker />

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
                            <TrustBadge icon={ShieldCheck} title="Secure" description="100% Payment Protection" />
                            <TrustBadge icon={Truck} title="Free Shipping" description="On orders over $50" />
                            <TrustBadge icon={RotateCcw} title="Easy Returns" description="7 Day Replacement" />
                        </div>

                        {/* Payment Methods */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-3 text-center">Guaranteed Safe Checkout</p>
                            <div className="flex items-center justify-center space-x-3">
                                {/* Visa */}
                                <div className="h-8 w-12 bg-white border border-gray-200 rounded flex items-center justify-center">
                                    <LazyImage src="/Visa.svg.png" alt="Visa" className="h-full w-full object-contain p-1" />
                                </div>
                                {/* Mastercard */}
                                <div className="h-8 w-12 bg-white border border-gray-200 rounded flex items-center justify-center">
                                    <svg className="h-6 w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="7" cy="12" r="7" fill="#EB001B" fillOpacity="0.8" />
                                        <circle cx="17" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8" />
                                    </svg>
                                </div>
                                {/* Stripe */}
                                <div className="h-8 w-12 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-500">
                                    <span className="text-[10px] font-bold tracking-tighter">STRIPE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-16 lg:mt-24">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {['Description', 'Specifications', 'Reviews'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`${activeTab === tab.toLowerCase()
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="py-8">
                        {activeTab === 'description' && (
                            <div className="prose prose-indigo max-w-none text-gray-600 text-sm">
                                <p className="leading-relaxed mb-4">{product.description}</p>

                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="max-w-2xl">
                                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                                    <dl className="divide-y divide-gray-200">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <div key={key} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                                                <dt className="text-sm font-medium text-gray-500 capitalize">{key.replace(/_/g, ' ')}</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                ) : (
                                    <p className="text-gray-500 italic">No specifications available for this product.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="grid md:grid-cols-12 gap-8">
                                {/* Rating Summary */}
                                <div className="md:col-span-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                                        <div>
                                            <div className="flex text-yellow-400 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <p className="text-sm text-gray-500">Based on {reviews.length} reviews</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {[5, 4, 3, 2, 1].map((star) => {
                                            const count = ratingCounts[star] || 0;
                                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                            return (
                                                <div key={star} className="flex items-center text-sm">
                                                    <span className="w-12 text-gray-600">{star} Star</span>
                                                    <div className="flex-1 h-2 mx-4 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-yellow-400 rounded-full"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="w-8 text-right text-gray-500">{Math.round(percentage)}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Review List & Form */}
                                <div className="md:col-span-8">
                                    <div className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4">{existingReview ? 'Update your Review' : 'Write a Review'}</h3>
                                        {user ? (
                                            <form onSubmit={handleReviewSubmit} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                                className="focus:outline-none"
                                                            >
                                                                <Star
                                                                    className={`h-6 w-6 ${star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Name is automatically displayed from logged in user */}
                                                <div className='flex items-center gap-2 text-sm text-gray-600 mb-2'>
                                                    <span className="font-medium">Reviewing as:</span> {user.name || user.email || 'User'}
                                                </div>

                                                <div>
                                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                                                    <textarea
                                                        id="comment"
                                                        rows={3}
                                                        required
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                                        value={newReview.comment}
                                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Add Images (Optional)</label>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => setReviewImages(e.target.files)}
                                                        className="w-full text-sm text-gray-500
                                                            file:mr-4 file:py-2 file:px-4
                                                            file:rounded-full file:border-0
                                                            file:text-sm file:font-semibold
                                                            file:bg-indigo-50 file:text-indigo-700
                                                            hover:file:bg-indigo-100"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    {existingReview ? 'Update Review' : 'Submit Review'}
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="text-center py-6">
                                                <p className="text-gray-600 mb-3">Please log in to write a review.</p>
                                                <Link to="/login" className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                                    Log In
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        {reviews.map((review) => (
                                            <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-600">
                                                            {review.userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{review.userName}</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">{review.createdAt}</span>
                                                </div>
                                                <div className="flex text-yellow-400 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                                <p className="text-gray-600">{review.comment}</p>
                                                {review.images && review.images.length > 0 && (
                                                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                                        {review.images.map((img, idx) => (
                                                            <LazyImage key={idx} src={img} alt="review" className="h-20 w-20 object-cover rounded-md border border-gray-200" />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductDetailsPage;
