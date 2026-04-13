import { Skeleton } from "@/components/ui/skeleton";

export function DiarySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-surface-container overflow-hidden shadow-sm"
        >
          {/* Meal header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-surface-container-low">
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-14" />
          </div>
          {/* Entry rows */}
          <div className="divide-y divide-surface-container-low">
            {Array.from({ length: i % 2 === 0 ? 2 : 1 }).map((_, j) => (
              <div key={j} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <Skeleton className="h-5 w-10" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
