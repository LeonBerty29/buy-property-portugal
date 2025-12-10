// loading-components.tsx
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Main blog content loading skeleton
export function BlogContentLoader() {
  return (
    <div className="flex-1">
      {/* Blog header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-6" />
        <Skeleton className="aspect-video rounded-lg mb-6" />
      </div>

      {/* Blog content skeleton */}
      <div className="space-y-4 mb-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Related articles section skeleton */}
      <Separator className="my-6" />
      <Skeleton className="h-8 w-1/3 mb-5" />
      <RelatedArticlesLoader />
    </div>
  );
}

// Recent posts loading skeleton
export function RecentPostsLoader() {
  return (
    <div className="sm:min-w-[400px] lg:w-[400px]">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid sm:grid-cols-2 lg:flex lg:flex-wrap gap-4 lg:flex-col">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-full min-h-32 bg-gray-50 p-4 rounded-xl border"
          >
            <div className="py-2">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Related articles loading skeleton
export function RelatedArticlesLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="w-full">
          <Skeleton className="relative w-full aspect-video rounded-lg mb-2" />
          <div className="py-2">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
