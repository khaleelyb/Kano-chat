import React, { useState, useContext, useCallback } from 'react';
import { DataContext, AuthContext } from '../contexts';
import { Listing } from '../types';
import ImageUploader from './ImageUploader';
import Icon from './Icon';

interface CreateListingProps {
    onClose: () => void;
}

const CreateListing: React.FC<CreateListingProps> = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState('');

    const data = useContext(DataContext);
    const auth = useContext(AuthContext);

    const handleFilesChange = useCallback((files: string[]) => {
        setImages(files);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title || !description || !price || images.length === 0) {
            setError('All fields and at least one image are required.');
            return;
        }
        if (!auth?.currentUser) {
            setError('You must be logged in to create a listing.');
            return;
        }

        const newListing: Listing = {
            id: `listing-${Date.now()}`,
            sellerId: auth.currentUser.id,
            title,
            description,
            price: parseFloat(price),
            images,
            createdAt: Date.now(),
        };

        data?.addListing(newListing);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-full overflow-y-auto">
                 <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Create a New Listing</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                       <Icon name="close" className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                    </div>
                     <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Price (₦)</label>
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Images</label>
                        <ImageUploader onFilesChange={handleFilesChange} multiple={true} />
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">Create Listing</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateListing;