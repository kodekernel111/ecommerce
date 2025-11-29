import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">About ChorBazaar</h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Redefining the way you shop online with quality, speed, and trust.
                    </p>
                </div>
                <div className="mt-16">
                    <div className="prose prose-indigo prose-lg text-gray-500 mx-auto">
                        <p>
                            Founded in 2024, ChorBazaar has come a long way from its beginnings. When we first started out, our passion for "eco-friendly products" drove us to start our own business.
                        </p>
                        <p>
                            We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
                        </p>
                        <p>
                            Sincerely,<br />
                            The ChorBazaar Team
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;
