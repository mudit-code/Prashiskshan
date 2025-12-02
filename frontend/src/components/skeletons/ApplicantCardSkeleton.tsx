import { Skeleton } from "@/components/ui/skeleton"

export function ApplicantCardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <Skeleton className="h-6 w-48 mb-2" />
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-3 w-40" />
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>

                    <div className="flex gap-3 mb-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[150px]">
                    <div className="flex gap-2">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                    </div>
                </div>
            </div>
        </div>
    )
}
