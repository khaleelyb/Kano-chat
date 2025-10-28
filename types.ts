export interface User {
    id: string;
    username: string;
    passwordHash: string;
    profilePicture: string;
}

export interface Listing {
    id: string;
    sellerId: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    createdAt: number;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: number;
    listingContext?: Listing;
}

export interface Chat {
    id: string;
    participantIds: string[];
    messages: Message[];
    listingId?: string;
}
