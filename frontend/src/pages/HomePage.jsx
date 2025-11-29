import React from 'react';
import Navbar from '../components/Navbar';
import ProductList from '../components/ProductList';
import CartSidebar from '../components/CartSidebar';
import HeroCarousel from '../components/HeroCarousel';
import Footer from '../components/Footer';
import HomeCategorySection from '../components/HomeCategorySection';
import TopDealsSection from '../components/TopDealsSection';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <CartSidebar />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 space-y-6">
                    <HeroCarousel />
                    <TopDealsSection />
                    <HomeCategorySection />
                </div>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <ProductList />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
