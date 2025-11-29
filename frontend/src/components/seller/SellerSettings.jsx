import React from 'react';
import { Save, Upload } from 'lucide-react';

const SellerSettings = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Shop Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">Manage your store profile and preferences.</p>
                </div>

                <div className="p-6 space-y-8">
                    {/* Store Profile */}
                    <div>
                        <h4 className="text-base font-medium text-gray-900 mb-4">Store Profile</h4>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="store-name" className="block text-sm font-medium text-gray-700">Store Name</label>
                                <div className="mt-1">
                                    <input type="text" name="store-name" id="store-name" defaultValue="Tech Haven" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="about" className="block text-sm font-medium text-gray-700">About</label>
                                <div className="mt-1">
                                    <textarea id="about" name="about" rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2" defaultValue="We provide the best tech gadgets and accessories for your daily needs." />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">Brief description for your shop profile.</p>
                            </div>

                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700">Store Logo</label>
                                <div className="mt-1 flex items-center">
                                    <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </span>
                                    <button type="button" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Change
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                        <h4 className="text-base font-medium text-gray-900 mb-4">Shipping & Returns</h4>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="shipping-fee" className="block text-sm font-medium text-gray-700">Default Shipping Fee ($)</label>
                                <div className="mt-1">
                                    <input type="number" name="shipping-fee" id="shipping-fee" defaultValue="5.00" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="return-policy" className="block text-sm font-medium text-gray-700">Return Policy</label>
                                <div className="mt-1">
                                    <textarea id="return-policy" name="return-policy" rows={3} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2" defaultValue="Returns accepted within 30 days of purchase. Buyer pays return shipping." />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellerSettings;
