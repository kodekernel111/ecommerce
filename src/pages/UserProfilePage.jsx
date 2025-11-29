import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User, MapPin, Package, LogOut, Plus, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const UserProfilePage = () => {
    const { user } = useSelector((state) => state.auth);

    // Mock initial data
    const initialUserData = user || {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        addresses: [
            {
                id: 1,
                type: 'Home',
                line1: '123, Green Park',
                city: 'New Delhi',
                state: 'Delhi',
                zip: '110016'
            },
            {
                id: 2,
                type: 'Work',
                line1: '456, Tech Hub',
                city: 'Gurugram',
                state: 'Haryana',
                zip: '122002'
            }
        ]
    };

    const [profileData, setProfileData] = useState(initialUserData);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedProfile, setEditedProfile] = useState({ ...initialUserData });

    const [addresses, setAddresses] = useState(initialUserData.addresses);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        type: 'Home',
        line1: '',
        city: '',
        state: '',
        zip: ''
    });

    const { addToast } = useToast();

    const handleProfileSave = () => {
        setProfileData({ ...profileData, ...editedProfile });
        setIsEditingProfile(false);
        // Here you would typically dispatch an action to update the backend/redux store
        addToast('Profile updated successfully', 'success');
    };

    const handleAddAddress = (e) => {
        e.preventDefault();
        const address = {
            id: addresses.length + 1,
            ...newAddress
        };
        setAddresses([...addresses, address]);
        setIsAddingAddress(false);
        setNewAddress({ type: 'Home', line1: '', city: '', state: '', zip: '' });
        addToast('Address added successfully', 'success');
    };

    const handleDeleteAddress = (id) => {
        setAddresses(addresses.filter(addr => addr.id !== id));
        addToast('Address deleted', 'info');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Profile</h1>

                    {/* Personal Information */}
                    <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Personal Information</h3>
                            {!isEditingProfile ? (
                                <button
                                    onClick={() => setIsEditingProfile(true)}
                                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                                >
                                    Edit
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsEditingProfile(false)}
                                        className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleProfileSave}
                                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-1"
                                    >
                                        <Save className="h-4 w-4" /> Save
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-start mb-6">
                                <div className="relative h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold flex-shrink-0 overflow-hidden">
                                    {profileData.avatar ? (
                                        <img src={profileData.avatar} alt={profileData.name} className="h-full w-full object-cover" />
                                    ) : (
                                        profileData.name.charAt(0)
                                    )}

                                    {isEditingProfile && (
                                        <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white text-xs font-medium">Change</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setEditedProfile({ ...editedProfile, avatar: reader.result });
                                                            setProfileData({ ...profileData, avatar: reader.result }); // Preview immediately
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="ml-6 flex-grow">
                                    {!isEditingProfile ? (
                                        <>
                                            <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
                                            <p className="text-gray-500 mt-1">{profileData.email}</p>
                                            <p className="text-gray-500 mt-1">{profileData.phone}</p>
                                        </>
                                    ) : (
                                        <div className="space-y-4 max-w-md">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                                <input
                                                    type="text"
                                                    value={editedProfile.name}
                                                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                                <input
                                                    type="email"
                                                    value={editedProfile.email}
                                                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={editedProfile.phone}
                                                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-2"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Saved Addresses */}
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Saved Addresses</h3>
                                </div>
                                {!isAddingAddress && (
                                    <button
                                        onClick={() => setIsAddingAddress(true)}
                                        className="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-1"
                                    >
                                        <Plus className="h-4 w-4" /> Add New
                                    </button>
                                )}
                            </div>

                            {isAddingAddress && (
                                <div className="p-4 bg-gray-50 border-b border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Address</h4>
                                    <form onSubmit={handleAddAddress} className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">Type</label>
                                                <select
                                                    value={newAddress.type}
                                                    onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-1.5"
                                                >
                                                    <option>Home</option>
                                                    <option>Work</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">Zip Code</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newAddress.zip}
                                                    onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-1.5"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">Address Line</label>
                                            <input
                                                type="text"
                                                required
                                                value={newAddress.line1}
                                                onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-1.5"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">City</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-1.5"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700">State</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border p-1.5"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingAddress(false)}
                                                className="px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                                {addresses.map((addr) => (
                                    <li key={addr.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{addr.type}</p>
                                                <p className="text-sm text-gray-500">{addr.line1}</p>
                                                <p className="text-sm text-gray-500">{addr.city}, {addr.state} - {addr.zip}</p>
                                            </div>
                                            <div className="flex items-start">
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="text-xs text-gray-400 hover:text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                {addresses.length === 0 && (
                                    <li className="px-4 py-8 text-center text-sm text-gray-500">
                                        No addresses saved yet.
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white shadow rounded-lg overflow-hidden h-fit">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <Link to="/orders" className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <Package className="h-6 w-6 text-indigo-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Order History</p>
                                        <p className="text-xs text-gray-500">Track, return, or buy things again</p>
                                    </div>
                                </Link>
                                <button className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors group text-left">
                                    <LogOut className="h-6 w-6 text-gray-400 group-hover:text-red-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-red-700">Sign Out</p>
                                        <p className="text-xs text-gray-500 group-hover:text-red-500">Log out of your account</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserProfilePage;
