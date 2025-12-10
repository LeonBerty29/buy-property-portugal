import { StoryblokStory } from "@storyblok/react/rsc";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { fetchSellResourcePage } from "@/data/resources";
import { Skeleton } from "@/components/ui/skeleton";
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

const SellResourcePage = async (props: PageProps) => {
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
          <SellResourceContent slug={params.slug as string} />
        </Suspense>
      </ScrollToTopWrapper>
    </>
  );
};

export default SellResourcePage;

async function SellResourceContent({ slug }: { slug: string }) {
  const story = await fetchSellResourcePage(slug);
  return (
    <>
      <StoryblokStory story={story} />
    </>
  );
}
