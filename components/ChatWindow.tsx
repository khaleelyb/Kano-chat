import React, { useContext, useMemo, useState, useEffect, useRef } from 'react';
import { AuthContext, DataContext, ViewContext } from '../contexts';
import { User, Message, Listing, Chat } from '../types';
import Icon from './Icon';

interface ChatWindowProps {
    partner: User;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ partner }) => {
    const auth = useContext(AuthContext);
    const data = useContext(DataContext);
    const view = useContext(ViewContext);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeChat = useMemo<Chat | undefined>(() => {
        if (!data || !auth?.currentUser) return undefined;
        return data.chats.find(c => 
            c.participantIds.length === 2 &&
            c.participantIds.includes(auth.currentUser!.id) && 
            c.participantIds.includes(partner.id)
        );
    }, [data, auth?.currentUser, partner.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [activeChat?.messages]);
    
    if (!auth?.currentUser || !data || !view) return null;

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !activeChat) return;
        
        const message: Message = {
            id: `msg-${Date.now()}`,
            senderId: auth.currentUser!.id,
            text: newMessage.trim(),
            timestamp: Date.now(),
        };

        data.addMessage(activeChat.id, message);
        setNewMessage('');
    };

    const ListingContextCard = ({ listing }: { listing: Listing }) => (
        <div className="bg-gray-700 rounded-lg p-2 mb-2 flex items-center gap-3 max-w-sm mx-auto">
            <img src={listing.images[0]} alt={listing.title} className="w-12 h-12 object-cover rounded-md" />
            <div>
                <p className="text-sm text-gray-300">Listing:</p>
                <p className="font-semibold text-white truncate">{listing.title}</p>
                <p className="text-indigo-400 font-bold">₦{listing.price.toFixed(2)}</p>
            </div>
        </div>
    );

    return (
        <section className={`flex-col flex-1 bg-gray-900 ${partner ? 'flex' : 'hidden md:flex'}`}>
            <header className="flex items-center p-3 border-b border-gray-700 bg-gray-800">
                <button className="md:hidden mr-3 p-1 rounded-full hover:bg-gray-700" onClick={() => view.setActiveChatUserId(null)}>
                    <Icon name="chevron-left" className="w-6 h-6 text-white" />
                </button>
                <img src={partner.profilePicture} alt={partner.username} className="w-10 h-10 rounded-full object-cover" />
                <h2 className="ml-4 text-lg font-semibold text-white">{partner.username}</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeChat?.messages.map((msg) => {
                     const isSender = msg.senderId === auth.currentUser!.id;
                     return (
                        <div key={msg.id}>
                            {msg.listingContext && (
                                <ListingContextCard listing={msg.listingContext} />
                            )}
                            <div className={`flex items-end gap-2 ${isSender ? 'justify-end' : 'justify-start'}`}>
                                {!isSender && (
                                    <img src={partner.profilePicture} alt={partner.username} className="w-8 h-8 rounded-full object-cover"/>
                                )}
                                <div className={`max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isSender ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'}`}>
                                    <p className="break-words">{msg.text}</p>
                                </div>
                            </div>
                        </div>
                     )
                })}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-4 bg-gray-800 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button type="submit" className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 transition-colors disabled:opacity-50" disabled={!newMessage.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </form>
            </footer>
        </section>
    );
};

export default ChatWindow;
