
import React, { useState, useCallback, useRef } from 'react';
import Icon from './Icon';

interface ImageUploaderProps {
    onFilesChange: (files: string[]) => void;
    multiple: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFilesChange, multiple }) => {
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newPreviews: string[] = multiple ? [...previews] : [];
        const filePromises: Promise<string>[] = [];

        // FIX: Explicitly type `file` as `File` to resolve type inference issue.
        Array.from(files).forEach((file: File) => {
            const promise = new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            filePromises.push(promise);
        });

        Promise.all(filePromises).then(base64Files => {
            const updatedPreviews = [...newPreviews, ...base64Files];
            setPreviews(updatedPreviews);
            onFilesChange(updatedPreviews);
        });

    }, [previews, multiple, onFilesChange]);

    const removeImage = (index: number) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        setPreviews(updatedPreviews);
        onFilesChange(updatedPreviews);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {previews.map((src, index) => (
                    <div key={index} className="relative w-24 h-24">
                        <img src={src} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md" />
                        <button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-0.5 m-1 leading-none">
                             <Icon name="close" className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
                 {(multiple || previews.length === 0) && (
                    <button type="button" onClick={triggerFileInput} className="w-24 h-24 bg-gray-700 rounded-md flex flex-col items-center justify-center text-gray-400 hover:bg-gray-600 hover:text-white transition-colors">
                        <Icon name="upload" className="w-8 h-8"/>
                        <span className="text-xs mt-1">Add Image</span>
                    </button>
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                multiple={multiple}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};

export default ImageUploader;
