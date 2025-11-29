import React from 'react';
import { Search, MoreVertical, Send } from 'lucide-react';

const SellerMessages = () => {
    const conversations = [
        { id: 1, user: 'Alice Freeman', lastMessage: 'Hi, when will my order ship?', time: '10:30 AM', unread: true, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' },
        { id: 2, user: 'Bob Smith', lastMessage: 'Is the black color back in stock?', time: 'Yesterday', unread: false, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80' },
        { id: 3, user: 'Charlie Davis', lastMessage: 'Thanks for the quick delivery!', time: 'Oct 20', unread: false, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' },
    ];

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden h-[600px] flex">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="Search messages..."
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <ul className="divide-y divide-gray-200">
                        {conversations.map((conv) => (
                            <li key={conv.id} className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${conv.unread ? 'bg-indigo-50' : ''}`}>
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full object-cover" src={conv.avatar} alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <p className={`text-sm font-medium truncate ${conv.unread ? 'text-indigo-900' : 'text-gray-900'}`}>{conv.user}</p>
                                            <p className="text-xs text-gray-500">{conv.time}</p>
                                        </div>
                                        <p className={`text-sm truncate ${conv.unread ? 'text-indigo-700 font-medium' : 'text-gray-500'}`}>{conv.lastMessage}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                    <div className="flex items-center space-x-3">
                        <img className="h-8 w-8 rounded-full object-cover" src={conversations[0].avatar} alt="" />
                        <h3 className="text-lg font-medium text-gray-900">{conversations[0].user}</h3>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                    <div className="flex justify-end">
                        <div className="bg-indigo-600 text-white rounded-lg rounded-tr-none px-4 py-2 max-w-xs shadow-sm">
                            <p className="text-sm">Hello! Thanks for your order. It will be shipped tomorrow.</p>
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-900 border border-gray-200 rounded-lg rounded-tl-none px-4 py-2 max-w-xs shadow-sm">
                            <p className="text-sm">Hi, when will my order ship?</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-3">
                        <input
                            type="text"
                            className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            placeholder="Type a message..."
                        />
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerMessages;
