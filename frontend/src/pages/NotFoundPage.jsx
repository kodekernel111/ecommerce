import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-16 w-full text-center">
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">404 error</p>
                <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found</h1>
                <p className="mt-2 text-base text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p>
                <div className="mt-6">
                    <Link to="/" className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                        Go back home<span aria-hidden="true"> &rarr;</span>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default NotFoundPage;
