import { Button } from "../ui/button";
import { fetchAllBlogs } from "@/data/blogs";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { formatDateString } from "@/utils";
import { Suspense } from "react";
import { LoadingBlogs } from "../blog/loading-blogs";
import { getLocale, getTranslations } from "next-intl/server";

const LatestNews = async () => {
  const t = await getTranslations("latestNews")
  return (
    <div className="lg:container mx-auto px-6 sm:px-8 md:px-10 lg:px-12">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-10">
        <h2 className="text-2xl sm:text-3xl">{t("ourLatestNews")}</h2>
        <Button asChild className="rounded-none bg-black text-white">
          <Link href="/blogs">{t("readMore")}</Link>
        </Button>
      </div>
      <Suspense fallback={<LoadingBlogs />}>
        <RecentBlogsGrid />
      </Suspense>
    </div>
  );
};

export default LatestNews;

async function RecentBlogsGrid() {
  const locale = await getLocale();
  const blogs = await fetchAllBlogs({
    per_page: 4,
    page: 1,
    sort_by: "created_at:desc",
    language: locale
  });
  const t = await getTranslations("latestNews")
  
  const recentBlogs = blogs.data.stories;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recentBlogs?.map((blog) => (
          <div key={blog.content._uid}>
            <Link href={{
              pathname: "/blogs/[slug]",
              params: { slug: blog.slug },
            }} className="w-full">
              <div className="relative w-full aspect-video">
                <Image
                  src={blog.content.banner_image.filename}
                  alt={blog.content.banner_image.alt || blog.content.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="py-2">
                <p className="text-neutral-900 flex items-center justify-between text-[11px]">
                  <span>
                    <span>{blog.content.read_time_in_minutes}</span> {t("minRead")}
                  </span>

                  <span className="text-muted-foreground/85">
                    {formatDateString(blog.created_at)}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="line-clamp-2 text-neutral-900 font-medium text-sm md:text-base mb-2 leading-tight">
                  {blog.content.title}
                </h3>

                <p className="text-gray-400 text-xs">{blog.content.author}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
