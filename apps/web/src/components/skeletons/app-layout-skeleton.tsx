import { Skeleton } from "@/components/ui/skeleton";

export function AppLayoutSkeleton() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header placeholder */}
      <div className="fixed top-0 left-0 right-0 z-50 h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 px-6 flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Content area */}
      <main className="mx-auto max-w-lg px-6 pb-28 pt-22 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </main>

      {/* Bottom nav placeholder */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-surface border-t border-outline-variant/10 flex items-center justify-around px-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-6 rounded-full" />
        ))}
      </div>
    </div>
  );
}
