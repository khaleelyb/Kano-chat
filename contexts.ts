import { createContext } from 'react';
import { User, Listing, Chat, Message } from './types';

export type View = 'marketplace' | 'chat';

export interface AuthContextType {
    currentUser: User | null;
    login: (user: User) => void;
    logout: () => void;
    register: (user: User) => void;
}

export interface DataContextType {
    users: User[];
    listings: Listing[];
    chats: Chat[];
    addListing: (listing: Listing) => void;
    addMessage: (chatId: string, message: Message) => void;
    findOrCreateChat: (participantId: string, listing?: Listing) => Chat;
}

export interface ViewContextType {
    currentView: View;
    setCurrentView: (view: View) => void;
    activeChatUserId: string | null;
    setActiveChatUserId: (userId: string | null) => void;
    startChat: (userId: string, listing?: Listing) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
export const DataContext = createContext<DataContextType | null>(null);
export const ViewContext = createContext<ViewContextType | null>(null);
