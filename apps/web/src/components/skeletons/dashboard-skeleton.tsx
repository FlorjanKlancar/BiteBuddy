import { Skeleton } from "@/components/ui/skeleton";

const BAR_HEIGHTS = [30, 55, 45, 70, 40, 80, 60];

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <Skeleton className="h-7 w-44" />
        <Skeleton className="h-4 w-36 mt-1" />
      </div>

      {/* Calorie Ring card */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10 flex items-center justify-center">
        <Skeleton className="w-52 h-52 rounded-full" />
      </div>

      {/* Macro Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_12px_32px_rgba(18,28,42,0.04)] border border-outline-variant/10 space-y-4">
        <Skeleton className="h-5 w-20" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2.5 w-full rounded-full" />
          </div>
        ))}
      </div>

      {/* Weekly Trend */}
      <div className="bg-surface-container-low rounded-3xl p-6 space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex items-end justify-between h-32 px-2 gap-2">
          {BAR_HEIGHTS.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-1">
              <Skeleton
                className="w-full rounded-t-lg"
                style={{ height: `${h}%` }}
              />
              <Skeleton className="h-3 w-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
