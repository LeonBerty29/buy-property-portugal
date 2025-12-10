import { Skeleton } from "@/components/ui/skeleton";

export function LoadingBlogs() {
  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton className="w-full h-60" key={`loadingBlogs--${index}`} />
        ))}
      </div>
    </>
  );
}
