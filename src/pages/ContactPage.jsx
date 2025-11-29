import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
                    <p className="mt-4 text-lg text-gray-500">We'd love to hear from you! Here's how you can reach us.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="mx-auto h-12 w-12 text-indigo-600 mb-4">
                            <Mail className="h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Email</h3>
                        <p className="mt-2 text-gray-500">support@chorbazaar.com</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="mx-auto h-12 w-12 text-indigo-600 mb-4">
                            <Phone className="h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                        <p className="mt-2 text-gray-500">+1 (555) 123-4567</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <div className="mx-auto h-12 w-12 text-indigo-600 mb-4">
                            <MapPin className="h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Office</h3>
                        <p className="mt-2 text-gray-500">123 Commerce St, Cityville</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
