import { Skeleton } from "@/components/ui/skeleton"

export function InternshipCardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <Skeleton className="w-10 h-10 rounded" />
                        <div>
                            <Skeleton className="h-6 w-48 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="mt-3 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between min-w-[150px]">
                    <Skeleton className="h-4 w-32 mb-4" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    )
}
