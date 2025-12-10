import { Skeleton } from "@/components/ui/skeleton";
import SimilarPropertiesSkeleton from "./similar-properties-skeleton";

const PropertyDetailsLoading = () => {
  return (
    <div className="py-14">
      <div className="mb-5 2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto w-full mt-9">
        {/* Breadcrumb Loading */}
        <div className="flex items-center gap-x-8 gap-y-3 justify-between flex-wrap mb-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-1 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-1 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-2 items-center">
            <Skeleton className="size-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>

        {/* Title and Price Loading */}
        <div className="flex items-center justify-between flex-wrap gap-x-14 gap-y-4">
          <div className="flex items-center gap-x-16 gap-y-4 flex-wrap">
            <Skeleton className="h-7 w-80" />
            <Skeleton className="h-7 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      <div className="mt-10">
        <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto min-h-full">
          {/* Image Grid Loading */}
          <div className="gap-x-6 flex mb-8">
            <div className="w-full lg:flex-1">
              <Skeleton className="w-full h-[450px] xl:h-[550px]" />
            </div>
            <div className="hidden lg:flex lg:w-[37%] xl:w-[30%] space-y-6 flex-col">
              <Skeleton className="w-full flex-1" />
              <Skeleton className="w-full flex-1" />
            </div>
          </div>

          {/* Mobile Image Grid Loading */}
          <div className="flex gap-6 lg:hidden min-h-[500px] sm:min-h-[unset] flex-wrap">
            <Skeleton className="w-full flex-1 min-w-full sm:min-w-[300px] sm:h-[400px]" />
            <Skeleton className="w-full flex-1 min-w-full sm:min-w-[300px] sm:h-[400px]" />
          </div>

          <div className="gap-x-6 flex flex-col lg:flex-row mb-8">
            <div className="w-full lg:flex-1 pt-4">
              {/* Property Details Icons Loading */}
              <div className="items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mt-5 mb-14">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Skeleton className="h-14 w-14 border" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-12" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Scrollable Tabs Loading */}
              <div className="w-full">
                <div className="relative w-full flex items-center">
                  <Skeleton className="h-6 w-6 rounded-full opacity-50" />
                  <div className="flex-grow overflow-hidden mx-2">
                    <div className="flex gap-4 pl-1 pr-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-24 rounded-md" />
                      ))}
                    </div>
                  </div>
                  <Skeleton className="h-6 w-6 rounded-full opacity-50" />
                </div>

                {/* Tab Content Loading */}
                <div className="mt-4 p-4 border rounded-md px-8">
                  <div className="min-h-32 p-4 space-y-6">
                    {/* Property Info Loading */}
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-48" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description Loading */}
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Loading */}
            <div className="w-full lg:flex lg:w-[37%] xl:w-[30%] flex-col pt-4">
              <div className="w-full border p-5 mb-6">
                {/* Ref Code */}
                <div className="mb-5">
                  <Skeleton className="h-4 w-32" />
                </div>

                {/* Location */}
                <div className="mb-5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-40 mt-1" />
                </div>

                {/* Area Details */}
                <div className="flex justify-between gap-4 mb-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex-1">
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>

                {/* Book Visit Button */}
                <Skeleton className="h-12 w-full" />
              </div>

              {/* Contact Form Loading */}
              <div className="bg-black text-white w-full p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48 bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                  <Skeleton className="h-20 w-full bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section Loading */}
      <div className="py-16">
        <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto">
          <div className="text-center space-y-4 mb-12">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center space-y-4">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Properties Loading */}
      <SimilarPropertiesSkeleton />

      {/* Discover Section Loading */}
      <div className="py-16 bg-gray-50">
        <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto">
          <div className="text-center space-y-4 mb-12">
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsLoading;
