import React from 'react';

interface FormSkeletonProps {
    fields?: number;
}

export const FormSkeleton: React.FC<FormSkeletonProps> = ({ fields = 5 }) => {
    return (
        <div className="w-full animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(fields)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded w-full"></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-4">
                <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
        </div>
    );
};
