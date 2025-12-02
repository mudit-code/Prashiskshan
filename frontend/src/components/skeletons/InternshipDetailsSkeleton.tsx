import React from 'react';

export const InternshipDetailsSkeleton: React.FC = () => {
    return (
        <div className="max-w-2xl w-full animate-pulse">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>

                <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
};
