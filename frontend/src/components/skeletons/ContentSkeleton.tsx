import React from 'react';

interface ContentSkeletonProps {
    lines?: number;
    image?: boolean;
}

export const ContentSkeleton: React.FC<ContentSkeletonProps> = ({ lines = 3, image = false }) => {
    return (
        <div className="w-full animate-pulse p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex gap-4">
                {image && <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>}
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    {[...Array(lines)].map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};
