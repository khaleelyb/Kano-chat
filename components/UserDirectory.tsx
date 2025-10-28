
import React, { useContext, useState, useMemo } from 'react';
import { AuthContext, DataContext, ViewContext } from '../contexts';
import Icon from './Icon';

const UserDirectory: React.FC = () => {
    const auth = useContext(AuthContext);
    const data = useContext(DataContext);
    const view = useContext(ViewContext);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = useMemo(() => {
        if (!data || !auth?.currentUser) return [];
        return data.users
            .filter(user => user.id !== auth.currentUser?.id)
            .filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [data, auth?.currentUser, searchTerm]);

    if (!data || !view) return null;
    const { startChat } = view;

    return (
        <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold mb-6 text-white">User Directory</h1>
            <div className="relative mb-6">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon name="search" className="w-5 h-5 text-gray-400" />
                 </div>
                <input
                    type="text"
                    placeholder="Search for users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredUsers.map(user => (
                    <div key={user.id} className="bg-gray-800 rounded-lg p-4 flex flex-col items-center text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <img src={user.profilePicture} alt={user.username} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-700" />
                        <h3 className="text-lg font-semibold text-white">{user.username}</h3>
                        <button
                            onClick={() => startChat(user.id)}
                            className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                            <Icon name="chat" className="w-5 h-5" />
                            <span>Chat</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserDirectory;
