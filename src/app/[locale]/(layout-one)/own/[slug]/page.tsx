import { StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchOwnResourcePage } from "@/data/resources";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToTopWrapper } from "@/components/scroll-to-top-wrapper";

type Params = {
  [x: string]: string;
};

export type PageProps = {
  params?: Promise<Params>;
  searchParams?: Promise<{ [x: string]: string | string[] | undefined }>;
};

export type AwaitedPageProps = {
  params?: Awaited<PageProps["params"]>;
  searchParams?: Awaited<PageProps["searchParams"]>;
};

const OwnResourcePage = async (props: PageProps) => {
  const params = await props.params;

  // Better null/undefined checking
  if (!params?.slug) {
    notFound();
  }

  return (
    <>
      <ScrollToTopWrapper>
        <Suspense
          fallback={
            <div className="lg:container w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-14 py-10">
              <Skeleton className="min-h-[80vh] w-full" />
            </div>
          }
        >
          <OwnResourceContent slug={params.slug as string} />
        </Suspense>
      </ScrollToTopWrapper>
    </>
  );
};

export default OwnResourcePage;

async function OwnResourceContent({ slug }: { slug: string }) {
  const story = await fetchOwnResourcePage(slug);
  return (
    <>
      <StoryblokStory story={story} />
    </>
  );
}
