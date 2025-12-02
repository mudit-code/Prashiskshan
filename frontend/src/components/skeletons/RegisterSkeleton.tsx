import { Skeleton } from "@/components/ui/skeleton"

export function RegisterSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center">
                    {/* Logo Circle */}
                    <Skeleton className="w-20 h-20 rounded-full mb-4" />
                    {/* Title */}
                    <Skeleton className="h-10 w-64 mb-2" />
                    {/* Subtitle */}
                    <Skeleton className="h-5 w-48" />
                </div>

                {/* Form Card */}
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                    <div className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <Skeleton className="h-4 w-24 mb-3" />
                            <div className="grid grid-cols-3 gap-3">
                                <Skeleton className="h-24 rounded-lg" />
                                <Skeleton className="h-24 rounded-lg" />
                                <Skeleton className="h-24 rounded-lg" />
                            </div>
                        </div>

                        {/* Name Fields */}
                        <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <div className="grid grid-cols-3 gap-3">
                                <Skeleton className="h-12 rounded-lg" />
                                <Skeleton className="h-12 rounded-lg" />
                                <Skeleton className="h-12 rounded-lg" />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>

                        {/* Password Field */}
                        <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-12 w-full rounded-lg" />
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded" />
                            <Skeleton className="h-4 w-64" />
                        </div>

                        {/* Submit Button */}
                        <Skeleton className="h-14 w-full rounded-lg" />

                        {/* Footer Links */}
                        <div className="flex flex-col items-center gap-4 mt-6">
                            <Skeleton className="h-px w-full" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
