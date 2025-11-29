import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQPage = () => {
    const faqs = [
        {
            question: "What is your return policy?",
            answer: "We offer a 30-day return policy for all unused items in their original packaging."
        },
        {
            question: "How long does shipping take?",
            answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days."
        },
        {
            question: "Do you ship internationally?",
            answer: "Yes, we ship to select countries worldwide. Shipping costs vary by location."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you will receive a tracking number via email."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Frequently Asked Questions</h1>
                <div className="space-y-8">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white shadow overflow-hidden rounded-lg px-6 py-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">{faq.question}</h3>
                            <p className="mt-2 text-base text-gray-500">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FAQPage;
