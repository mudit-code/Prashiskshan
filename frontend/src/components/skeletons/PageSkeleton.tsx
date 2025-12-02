import React from 'react';

const PageSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>

                {/* Content Skeleton */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 h-64">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded w-full"></div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 h-64">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageSkeleton;
