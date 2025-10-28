
import React, { useContext, useMemo } from 'react';
import { DataContext, ViewContext, AuthContext } from '../contexts';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import Icon from './Icon';

const Chat: React.FC = () => {
    const data = useContext(DataContext);
    const view = useContext(ViewContext);
    const auth = useContext(AuthContext);

    const activeChatPartner = useMemo(() => {
        if (!view?.activeChatUserId || !data?.users) return null;
        return data.users.find(u => u.id === view.activeChatUserId) || null;
    }, [view?.activeChatUserId, data?.users]);

    if (!auth?.currentUser) return null;

    return (
        <div className="flex h-[calc(100vh-120px)] md:h-[calc(100vh-100px)] bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <ChatList />
            {activeChatPartner ? (
                <ChatWindow partner={activeChatPartner} />
            ) : (
                <div className="hidden md:flex flex-col flex-1 items-center justify-center text-gray-500">
                    <Icon name="chat" className="w-24 h-24 mb-4" />
                    <h2 className="text-2xl font-semibold">Select a conversation</h2>
                    <p>Choose a user from the list to start chatting.</p>
                </div>
            )}
        </div>
    );
};

export default Chat;
