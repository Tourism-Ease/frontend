import { useState } from 'react';
import { XCircle } from 'lucide-react';

interface ImageUploadProps {
    label: string;
    single?: boolean; // true for imageCover
    maxFiles?: number;
    defaultImages?: string[]; // URLs from backend
    onChange: (files: File[] | File | null) => void;
    required?: boolean;
}

export function ImageUpload({
    label,
    single = false,
    maxFiles = 5,
    defaultImages = [],
    onChange,
    required = false,
}: ImageUploadProps) {
    const [previews, setPreviews] = useState<(string | File)[]>(defaultImages);

    // Handle new files
    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const fileArray = Array.from(files);
        if (single) {
            setPreviews([fileArray[0]]);
            onChange(fileArray[0]);
        } else {
            const newPreviews = [...previews.filter(f => typeof f === 'string'), ...fileArray].slice(0, maxFiles);
            setPreviews(newPreviews);
            onChange(fileArray);
        }
    };

    // Remove preview
    const removePreview = (index: number) => {
        const newPreviews = previews.filter((_, i) => i !== index);
        setPreviews(newPreviews);
        if (single) {
            onChange(null);
        } else {
            onChange(newPreviews.filter(f => f instanceof File) as File[]);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block font-medium text-sm">{label} {required && '*'}</label>
            <input
                type="file"
                accept="image/*"
                multiple={!single}
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                id={`file-upload-${label}`}
            />
            <label
                htmlFor={`file-upload-${label}`}
                className="cursor-pointer flex items-center justify-center h-32 w-full border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:border-blue-500 hover:text-blue-500 transition"
            >
                {single ? (previews.length ? 'Click to replace' : 'Click to upload') : 'Click or drag to upload'}
            </label>

            {/* Preview */}
            <div className="flex flex-wrap gap-2 mt-2">
                {previews.map((file, idx) => (
                    <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                        <img
                            src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                            alt="preview"
                            className="object-cover w-full h-full"
                        />
                        <XCircle
                            size={20}
                            className="absolute top-1 right-1 text-red-500 cursor-pointer"
                            onClick={() => removePreview(idx)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
