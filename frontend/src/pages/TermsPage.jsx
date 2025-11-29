import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Terms and Conditions</h1>
                <div className="prose prose-indigo text-gray-500">
                    <p>Welcome to ChorBazaar. By using our website, you agree to the following terms and conditions.</p>
                    <h3>1. Usage</h3>
                    <p>You agree to use this site only for lawful purposes and in a way that does not infringe the rights of others.</p>
                    <h3>2. Privacy</h3>
                    <p>Your use of this site is also governed by our Privacy Policy.</p>
                    <h3>3. Intellectual Property</h3>
                    <p>All content on this site is the property of ChorBazaar and protected by copyright laws.</p>
                    <h3>4. Limitation of Liability</h3>
                    <p>ChorBazaar is not liable for any damages arising from the use of this site.</p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default TermsPage;
