import { Skeleton } from "@/components/ui/skeleton"

export function EmployerDashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton - Matches EmployerDashboard Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            {/* Title: Employer Dashboard */}
                            <Skeleton className="h-10 w-64 mb-2 bg-white/20" />
                            {/* Subtitle: Manage your internships... */}
                            <Skeleton className="h-6 w-48 bg-white/20" />
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            {/* Post New Internship Button */}
                            <Skeleton className="h-10 w-40 rounded-lg bg-white/20" />
                            {/* Logout Button */}
                            <Skeleton className="h-10 w-24 rounded-lg bg-white/20" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs Skeleton - Matches Tab Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex px-6 overflow-x-auto">
                            {[1, 2, 3, 4].map((i) => (
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

                {/* Content Area Skeleton - Matches Overview Tab (3 Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Total Posted */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            {/* Icon Box */}
                            <Skeleton className="w-12 h-12 rounded-lg" />
                            {/* Label */}
                            <Skeleton className="h-4 w-24" />
                        </div>
                        {/* Big Number */}
                        <Skeleton className="h-10 w-16 mb-2" />
                        {/* Subtext */}
                        <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Card 2: Total Applicants */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="w-12 h-12 rounded-lg" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-10 w-16 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Card 3: Quick Action (Post New) - Gradient Background simulation */}
                    <div className="bg-primary-600/10 p-6 rounded-xl shadow-lg border border-primary-100">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="w-12 h-12 rounded-lg bg-primary-200" />
                            <Skeleton className="h-4 w-24 bg-primary-200" />
                        </div>
                        <Skeleton className="h-8 w-48 mb-2 bg-primary-200" />
                        <Skeleton className="h-4 w-32 bg-primary-200" />
                    </div>
                </div>
            </div>
        </div>
    )
}
