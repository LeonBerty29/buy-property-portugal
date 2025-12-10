import { formatDateString } from "@/utils";
import { ISbStoryData } from "@storyblok/react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function RecentPosts({
  blogs,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blogs: ISbStoryData<any>[];
}) {

  const t = await getTranslations("recentPosts");

  return (
    <>
      {blogs.slice(0, 3).length > 0 && (
        <div className="sm:min-w-[400px] lg:w-[400px]">
          <h2 className="text-2xl mb-6">{t("recentPost")}</h2>
          <div className="grid sm:grid-cols-2 lg:flex lg:flex-wrap gap-4 lg:flex-col">
            {blogs.slice(0, 3).map((blog) => (
              <Link
                key={blog.slug}
                href={{
                  pathname: "/blogs/[slug]",
                  params: { slug: blog.slug },
                }}
                className="w-full min-h-32 bg-gray-200 p-4 rounded-xl"
              >
                <div className="py-2">
                  <p className="text-neutral-900 flex items-center justify-between text-[10px]">
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
            ))}
          </div>
        </div>
      )}
    </>
  );
}
