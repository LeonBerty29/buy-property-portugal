import { Blog } from "@/types";
import { BlogNewsCard } from "./blog-news-card";
// import { cn } from "@/lib/utils";

export function BlogNewsGrid({
  blogs,
//   perLine,
}: {
  blogs: Blog[];
  perLine?: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {blogs.map((blog: Blog, index) => (
        <div
          key={`${blog.slug}-${index}`}
        //   className={cn(
        //     "w-full sm:w-[45%] md:w-[23%] sm:min-w-[250px] md:min-w-[290px]",
        //     perLine == 3 && "md:w-[32%]"
        //   )}
        >
          <BlogNewsCard blog={blog} />
        </div>
      ))}
    </div>
  );
}
