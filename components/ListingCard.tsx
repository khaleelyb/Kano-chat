import React, { useContext, useMemo, useState } from 'react';
import { Listing, User } from '../types';
import { DataContext, ViewContext, AuthContext } from '../contexts';
import Icon from './Icon';

interface ListingCardProps {
    listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
    const data = useContext(DataContext);
    const view = useContext(ViewContext);
    const auth = useContext(AuthContext);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const seller = useMemo(() => {
        return data?.users.find(u => u.id === listing.sellerId);
    }, [data?.users, listing.sellerId]);

    const timeRemaining = useMemo(() => {
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const expiresAt = listing.createdAt + twentyFourHours;
        const diff = expiresAt - Date.now();

        if (diff <= 0) return 'Expired';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m remaining`;
    }, [listing.createdAt]);

    const handleContactSeller = () => {
        if (view) {
            view.startChat(listing.sellerId, listing);
        }
    };
    
    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
    }

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
    }

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex flex-col transition-shadow duration-300 hover:shadow-indigo-500/50">
            <div className="relative">
                <img src={listing.images[currentImageIndex]} alt={listing.title} className="w-full h-56 object-cover" />
                {listing.images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80">
                           <Icon name="chevron-left" className="w-6 h-6" />
                        </button>
                         <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/80">
                           <Icon name="chevron-right" className="w-6 h-6" />
                        </button>
                    </>
                )}
                 <div className="absolute top-2 right-2 bg-gray-900/70 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
                    {timeRemaining}
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2">{listing.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 h-20 overflow-y-auto">{listing.description}</p>
                </div>
                
                <div className="text-2xl font-bold text-indigo-400 mb-4">₦{listing.price.toFixed(2)}</div>
                
                <div className="border-t border-gray-700 pt-4 mt-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {seller && (
                                <>
                                    <img src={seller.profilePicture} alt={seller.username} className="w-8 h-8 rounded-full object-cover mr-2" />
                                    <span className="text-sm font-medium text-gray-300">{seller.username}</span>
                                </>
                            )}
                        </div>
                        {auth?.currentUser?.id !== listing.sellerId && (
                            <button
                                onClick={handleContactSeller}
                                className="bg-indigo-600 text-white font-semibold py-1 px-3 rounded-md text-sm hover:bg-indigo-700 transition-colors duration-200 flex items-center space-x-1"
                            >
                                <Icon name="chat" className="w-4 h-4" />
                                <span>Contact</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;