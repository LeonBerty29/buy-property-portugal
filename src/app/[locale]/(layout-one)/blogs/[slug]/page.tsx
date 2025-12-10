import { RecentPosts } from "@/components/blog/recent-posts";
import { Separator } from "@/components/ui/separator";
import { fetchAllBlogs, fetchBlogPage } from "@/data/blogs";
import { StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { formatDateString } from "@/utils";
import { Suspense } from "react";
import {
  BlogContentLoader,
  RecentPostsLoader,
  RelatedArticlesLoader,
} from "@/components/blog/blog-loading-states";
import { getLocale, getTranslations } from "next-intl/server";
import { ScrollToTopWrapper } from "@/components/scroll-to-top-wrapper";

type Params = {
  [x: string]: string | string[];
};

export type PageProps = {
  params?: Promise<Params>;
  searchParams?: Promise<{ [x: string]: string | string[] | undefined }>;
};

export type AwaitedPageProps = {
  params?: Awaited<PageProps["params"]>;
  searchParams?: Awaited<PageProps["searchParams"]>;
};

const BlogPage = async (props: PageProps) => {
  const params = await props.params;

  if (!params?.slug) {
    notFound();
  }

  return (
    <>
      <ScrollToTopWrapper>
        <Suspense
          fallback={
            <div className="2xl:container w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-14 py-10">
              <div className="flex flex-col gap-6 lg:flex-row">
                <BlogContentLoader />
                <RecentPostsLoader />
              </div>
            </div>
          }
        >
          <BlogPageContent slug={params.slug as string} />
        </Suspense>
      </ScrollToTopWrapper>
    </>
  );
};

export default BlogPage;

async function BlogPageContent({ slug }: { slug: string }) {
  const locale = await getLocale();
  const t = await getTranslations("blogDetailsPage");
  const story = await fetchBlogPage(slug, locale);

  return (
    <>
      <div className="2xl:container w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-14 py-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <StoryblokStory story={story} />

            {story.tag_list.length > 0 && (
              <>
                <Separator className="my-6" />
                <h3 className="text-2xl xl:text-3xl font-normal mb-5">
                  {t("relatedArticles")}
                </h3>

                <Suspense fallback={<RelatedArticlesLoader />}>
                  <RelatedArticles
                    tag={story.tag_list[0]}
                    excludeBlogWithSlug={story.slug}
                  />
                </Suspense>
              </>
            )}
          </div>

          <Suspense fallback={<RecentPostsLoader />}>
            <ListRecentBlogs excludeBlogWithSlug={story.slug} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function ListRecentBlogs({
  excludeBlogWithSlug,
}: {
  excludeBlogWithSlug?: string;
}) {
  const locale = await getLocale();
  const blogsResponse = await fetchAllBlogs({
    per_page: 4,
    page: 1,
    sort_by: "created_at:desc",
    language: locale,
  });

  const blogs = excludeBlogWithSlug
    ? blogsResponse.data.stories.filter(
        (blog) => blog.slug !== excludeBlogWithSlug
      )
    : blogsResponse.data.stories;

  return (
    <>
      <RecentPosts blogs={blogs} />
    </>
  );
}

async function RelatedArticles({
  tag,
  excludeBlogWithSlug,
}: {
  tag: string;
  excludeBlogWithSlug?: string;
}) {
  const locale = await getLocale();
  const t = await getTranslations("blogDetailsPage");
  const relatedBlogsResponse = await fetchAllBlogs({
    per_page: 4,
    page: 1,
    tag: tag,
    language: locale,
  });

  const relatedBlogs = excludeBlogWithSlug
    ? relatedBlogsResponse.data.stories.filter(
        (blog) => blog.slug !== excludeBlogWithSlug
      )
    : relatedBlogsResponse.data.stories;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedBlogs.map((blog, index) => (
          <div key={`${blog.slug}-${index}`}>
            <Link
              href={{
                pathname: "/blogs/[slug]",
                params: { slug: blog.slug },
              }}
              className="w-full"
            >
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
                    <span>{blog.content.read_time_in_minutes}</span>{" "}
                    {t("minRead")}
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
