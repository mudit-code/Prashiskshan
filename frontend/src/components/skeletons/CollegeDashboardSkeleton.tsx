import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const CollegeDashboardSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton - Matches AdminDashboard Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            {/* Title: College Admin Dashboard */}
                            <Skeleton className="h-10 w-72 mb-2 bg-white/20" />
                            {/* Subtitle: Manage your students... */}
                            <Skeleton className="h-6 w-56 bg-white/20" />
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-right">
                                {/* Label: Total Students */}
                                <Skeleton className="h-4 w-24 mb-1 bg-white/20" />
                                {/* Value */}
                                <Skeleton className="h-8 w-16 ml-auto bg-white/20" />
                            </div>
                            {/* Logout Button */}
                            <Skeleton className="h-10 w-24 rounded-lg bg-white/20" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Section Skeleton */}
                <div className="mb-8 bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-200 flex items-center gap-4">
                    {/* Logo Circle */}
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div>
                        {/* College Name */}
                        <Skeleton className="h-6 w-64 mb-2" />
                        {/* Location */}
                        <Skeleton className="h-4 w-40" />
                    </div>
                    {/* Edit Button */}
                    <Skeleton className="h-8 w-24 ml-auto" />
                </div>

                {/* Stats Cards Skeleton - Matches 4-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    {/* Label */}
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    {/* Value */}
                                    <Skeleton className="h-8 w-16" />
                                </div>
                                {/* Icon Circle */}
                                <Skeleton className="w-12 h-12 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs Skeleton - Matches Tab Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex px-6 overflow-x-auto">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="py-4 mr-8 flex items-center gap-2">
                                    {/* Icon */}
                                    <Skeleton className="h-4 w-4" />
                                    {/* Label */}
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Area Skeleton - Matches Overview Tab (2 Columns) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Actions Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <Skeleton className="h-7 w-40 mb-6" />
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full rounded-md" />
                            <Skeleton className="h-12 w-full rounded-md" />
                            <Skeleton className="h-12 w-full rounded-md" />
                        </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                        <Skeleton className="h-7 w-40 mb-6" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="w-2 h-2 rounded-full mt-2" />
                                    <div className="flex-1">
                                        <Skeleton className="h-4 w-3/4 mb-1" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
