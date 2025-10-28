import React, { useState, useCallback, useMemo } from 'react';
import { AuthContext, DataContext, ViewContext, AuthContextType, DataContextType, ViewContextType, View } from './contexts';
import { User, Listing, Chat, Message } from './types';
import { mockUsers, mockListings, mockChats } from './constants';
import Auth from './components/Auth';
import Navbar from './components/Navbar';
import Marketplace from './components/Marketplace';
import ChatComponent from './components/Chat';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [listings, setListings] = useState<Listing[]>(mockListings);
    const [chats, setChats] = useState<Chat[]>(mockChats);
    const [currentView, setCurrentView] = useState<View>('marketplace');
    const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);

    const login = useCallback((user: User) => {
        setCurrentUser(user);
    }, []);

    const logout = useCallback(() => {
        setCurrentUser(null);
        setActiveChatUserId(null);
        setCurrentView('marketplace');
    }, []);

    const register = useCallback((user: User) => {
        setUsers(prev => [...prev, user]);
        setCurrentUser(user);
    }, []);

    const addListing = useCallback((listing: Listing) => {
        setListings(prev => [listing, ...prev]);
    }, []);
    
    const findOrCreateChat = useCallback((participantId: string, listing?: Listing): Chat => {
        if (!currentUser) throw new Error("User not logged in");
        
        const existingChat = chats.find(c => 
            c.participantIds.length === 2 &&
            c.participantIds.includes(currentUser.id) && 
            c.participantIds.includes(participantId)
        );

        if (existingChat) {
            return existingChat;
        }

        const newChat: Chat = {
            id: `chat-${Date.now()}`,
            participantIds: [currentUser.id, participantId],
            messages: listing ? [{
                id: `msg-${Date.now()}`,
                senderId: currentUser.id,
                text: `Hi, I'm interested in your listing: "${listing.title}"`,
                timestamp: Date.now(),
                listingContext: listing,
            }] : [],
            listingId: listing?.id,
        };
        setChats(prev => [...prev, newChat]);
        return newChat;
    }, [chats, currentUser]);

    const addMessage = useCallback((chatId: string, message: Message) => {
        setChats(prevChats => prevChats.map(chat =>
            chat.id === chatId
                ? { ...chat, messages: [...chat.messages, message] }
                : chat
        ));
    }, []);

    const startChat = useCallback((userId: string, listing?: Listing) => {
        findOrCreateChat(userId, listing);
        setActiveChatUserId(userId);
        setCurrentView('chat');
    }, [findOrCreateChat]);

    const authContextValue: AuthContextType = useMemo(() => ({
        currentUser,
        login,
        logout,
        register
    }), [currentUser, login, logout, register]);

    const dataContextValue: DataContextType = useMemo(() => ({
        users,
        listings,
        chats,
        addListing,
        addMessage,
        findOrCreateChat,
    }), [users, listings, chats, addListing, addMessage, findOrCreateChat]);

    const viewContextValue: ViewContextType = useMemo(() => ({
        currentView,
        setCurrentView,
        activeChatUserId,
        setActiveChatUserId,
        startChat,
    }), [currentView, activeChatUserId, startChat]);

    if (!currentUser) {
        return (
            <AuthContext.Provider value={authContextValue}>
                <DataContext.Provider value={dataContextValue}>
                    <Auth />
                </DataContext.Provider>
            </AuthContext.Provider>
        );
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <DataContext.Provider value={dataContextValue}>
                <ViewContext.Provider value={viewContextValue}>
                    <div className="bg-gray-900 min-h-screen text-gray-200 font-sans pb-20 md:pb-0">
                        <Navbar />
                        <main className="container mx-auto p-4 md:p-6">
                            {currentView === 'marketplace' && <Marketplace />}
                            {currentView === 'chat' && <ChatComponent />}
                        </main>
                    </div>
                </ViewContext.Provider>
            </DataContext.Provider>
        </AuthContext.Provider>
    );
};

export default App;
