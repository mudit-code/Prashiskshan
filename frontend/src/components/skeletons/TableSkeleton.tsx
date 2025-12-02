import React from 'react';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="w-full animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4 w-full"></div>
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex gap-4 mb-4">
                    {[...Array(columns)].map((_, j) => (
                        <div key={j} className="h-8 bg-gray-200 rounded flex-1"></div>
                    ))}
                </div>
            ))}
        </div>
    );
};
