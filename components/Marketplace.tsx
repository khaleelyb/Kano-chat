import React, { useContext, useState, useMemo, useEffect } from 'react';
import { DataContext } from '../contexts';
import ListingCard from './ListingCard';
import CreateListing from './CreateListing';
import Icon from './Icon';

const Marketplace: React.FC = () => {
    const data = useContext(DataContext);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [_, setTick] = useState(0);

    // Force re-render every minute to update expiry timers
    useEffect(() => {
        const timer = setInterval(() => {
            setTick(prev => prev + 1);
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const activeListings = useMemo(() => {
        if (!data) return [];
        const twentyFourHours = 24 * 60 * 60 * 1000;
        return data.listings
            .filter(listing => (Date.now() - listing.createdAt) < twentyFourHours)
            .filter(listing => listing.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(listing => maxPrice === '' || listing.price <= parseFloat(maxPrice))
            .sort((a, b) => b.createdAt - a.createdAt);
    }, [data, searchTerm, maxPrice]);

    return (
        <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-white">Marketplace</h1>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="w-full md:w-auto bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                    <Icon name="add" className="w-5 h-5"/>
                    <span>Create Listing</span>
                </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
                <div className="relative flex-grow">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon name="search" className="w-5 h-5 text-gray-400" />
                     </div>
                    <input
                        type="text"
                        placeholder="Search listings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="relative flex-grow md:max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">₦</span>
                    </div>
                    <input
                        type="number"
                        placeholder="Max price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-7 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {activeListings.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeListings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
                </div>
            ) : (
                <div className="text-center py-16 text-gray-400">
                    <Icon name="empty" className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">No listings found</h3>
                    <p>Try adjusting your search filters or check back later.</p>
                </div>
            )}


            {isCreateModalOpen && <CreateListing onClose={() => setCreateModalOpen(false)} />}
        </div>
    );
};

export default Marketplace;