import { Skeleton } from "@/components/ui/skeleton"

export function StudentDashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton - Matches StudentDashboard Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            {/* Title: Student Dashboard */}
                            <Skeleton className="h-10 w-64 mb-2 bg-white/20" />
                            {/* Subtitle: Welcome back... */}
                            <Skeleton className="h-6 w-48 bg-white/20" />
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-right">
                                {/* Label: Total Credits Earned */}
                                <Skeleton className="h-4 w-32 mb-1 bg-white/20" />
                                {/* Value: 0 */}
                                <Skeleton className="h-8 w-16 ml-auto bg-white/20" />
                            </div>
                            {/* Logout Button */}
                            <Skeleton className="h-10 w-24 rounded-lg bg-white/20" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Section Skeleton - Matches Profile Section */}
                <div className="mb-8 bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-200 flex items-center gap-4">
                    {/* Avatar */}
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="flex-1">
                        {/* Name */}
                        <Skeleton className="h-6 w-48 mb-2" />
                        {/* Email */}
                        <Skeleton className="h-4 w-64 mb-2" />
                        {/* Status Badge */}
                        <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
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
                            {[1, 2, 3, 4, 5, 6].map((i) => (
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

                {/* Content Area Skeleton - Matches Opportunities Tab (Search + List) */}
                <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-6">
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-full rounded-md" />
                        </div>
                    </div>

                    {/* Internship Cards List */}
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        {/* Title */}
                                        <Skeleton className="h-7 w-1/3 mb-2" />
                                        {/* Description */}
                                        <Skeleton className="h-4 w-3/4 mb-3" />
                                        {/* Metadata tags */}
                                        <div className="flex gap-4">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </div>
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Skeleton className="h-10 w-24 rounded-md" />
                                        <Skeleton className="h-10 w-12 rounded-md" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
