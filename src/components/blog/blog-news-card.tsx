import Image from "next/image";
import { Blog } from "@/types";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function BlogNewsCard({ blog }: { blog: Blog }) {
  const t = await getTranslations("blogNewsCard");

  return (
    <>
      <Link
        href={{
          pathname: "/blogs/[slug]",
          params: { slug: blog.slug },
        }}
        className="w-full"
      >
        <div className="relative w-full aspect-video">
          <Image
            src={blog.image}
            alt="Blog image"
            fill
            className="object-cover"
          />
        </div>

        <div className="py-2">
          <p className="text-neutral-900 flex items-center justify-between text-[10px]">
            <span>
              <span>{blog.readTime}</span> {t("minRead")}
            </span>

            <span className="text-muted-foreground/85">{blog.date}</span>
          </p>
        </div>

        <div>
          <h3 className="line-clamp-2 text-neutral-900 font-medium text-sm md:text-base mb-2 leading-tight">
            {blog.title}
          </h3>

          <p className="text-gray-400 text-xs">{blog.author}</p>
        </div>
      </Link>
    </>
  );
}
