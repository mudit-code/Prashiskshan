import React from 'react';

const AboutSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 animate-pulse">
            {/* Hero Section Skeleton */}
            <div className="bg-gray-200 h-64 w-full mb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center">
                    <div className="h-12 bg-gray-300 rounded w-3/4 md:w-1/2 mb-6"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 md:w-1/3"></div>
                </div>
            </div>

            {/* About Section Skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                        <div className="flex items-center gap-2 mt-6">
                            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
                                <div className="h-10 w-10 bg-gray-200 rounded-full mb-3"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Roles Section Skeleton */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 flex flex-col items-center">
                        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-50 p-8 rounded-lg h-80 flex flex-col items-center">
                                <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSkeleton;
