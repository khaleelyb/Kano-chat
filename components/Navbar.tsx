
import React, { useContext } from 'react';
import { AuthContext, ViewContext } from '../contexts';
import Icon from './Icon';

const Navbar: React.FC = () => {
    const auth = useContext(AuthContext);
    const view = useContext(ViewContext);

    const navItems = [
        { name: 'Marketplace', view: 'marketplace', icon: 'marketplace' },
        { name: 'Chat', view: 'chat', icon: 'chat' },
    ] as const;

    if (!auth || !view) return null;

    const { currentUser, logout } = auth;
    const { currentView, setCurrentView } = view;

    return (
        <header className="bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                     <Icon name="logo" className="w-8 h-8 text-indigo-400" />
                    <span className="text-xl font-bold text-white">Kano Chat</span>
                </div>
                
                <nav className="hidden md:flex items-center space-x-2 bg-gray-700 px-2 py-1 rounded-full">
                    {navItems.map(item => (
                        <button
                            key={item.view}
                            onClick={() => setCurrentView(item.view)}
                            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                                currentView === item.view
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                             <Icon name={item.icon} className="w-5 h-5" />
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <img src={currentUser?.profilePicture} alt={currentUser?.username} className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400" />
                        <span className="hidden sm:inline font-semibold text-white">{currentUser?.username}</span>
                    </div>
                    <button
                        onClick={logout}
                        title="Logout"
                        className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                        <Icon name="logout" className="w-6 h-6" />
                    </button>
                </div>
            </div>
             {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 flex justify-around">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => setCurrentView(item.view)}
                        className={`flex flex-col items-center justify-center p-2 w-full transition-colors duration-200 ${
                            currentView === item.view
                                ? 'text-indigo-400'
                                : 'text-gray-400 hover:text-indigo-400'
                        }`}
                    >
                         <Icon name={item.icon} className="w-6 h-6 mb-1" />
                        <span className="text-xs">{item.name}</span>
                    </button>
                ))}
            </div>
        </header>
    );
};

export default Navbar;
