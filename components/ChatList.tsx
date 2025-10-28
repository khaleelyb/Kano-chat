import React, { useContext, useMemo } from 'react';
import { AuthContext, DataContext, ViewContext } from '../contexts';
import { Chat } from '../types';

const ChatList: React.FC = () => {
    const auth = useContext(AuthContext);
    const data = useContext(DataContext);
    const view = useContext(ViewContext);

    const userChats = useMemo(() => {
        if (!data || !auth?.currentUser) return [];
        return data.chats
            .filter(chat => chat.participantIds.includes(auth.currentUser!.id))
            .sort((a, b) => (b.messages[b.messages.length - 1]?.timestamp ?? 0) - (a.messages[a.messages.length - 1]?.timestamp ?? 0));
    }, [data, auth?.currentUser]);
    
    if (!auth?.currentUser || !data || !view) return null;
    const { currentUser } = auth;
    const { users } = data;
    const { activeChatUserId, setActiveChatUserId } = view;

    const getPartner = (chat: Chat) => {
        const partnerId = chat.participantIds.find(id => id !== currentUser?.id);
        return users.find(u => u.id === partnerId);
    };

    return (
        <aside className={`bg-gray-800 border-r border-gray-700 w-full md:w-1/3 lg:w-1/4 ${activeChatUserId ? 'hidden md:block' : 'block'}`}>
            <div className="p-4 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(100%-61px)]">
                {userChats.length > 0 ? (
                    userChats.map(chat => {
                        const partner = getPartner(chat);
                        if (!partner) return null;

                        const lastMessage = chat.messages[chat.messages.length - 1];
                        const isSelected = activeChatUserId === partner.id;

                        return (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChatUserId(partner.id)}
                                className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${
                                    isSelected ? 'bg-indigo-600/30' : 'hover:bg-gray-700'
                                }`}
                            >
                                <img src={partner.profilePicture} alt={partner.username} className="w-12 h-12 rounded-full object-cover mr-4" />
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-semibold text-white truncate">{partner.username}</h3>
                                    {lastMessage && (
                                        <p className="text-sm text-gray-400 truncate">
                                            {lastMessage.senderId === currentUser?.id ? 'You: ' : ''}
                                            {lastMessage.text}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-4 text-center text-gray-500 mt-8">
                        No conversations yet.
                    </div>
                )}
            </div>
        </aside>
    );
};

export default ChatList;
