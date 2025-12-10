import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Property card skeleton
export const PropertyCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="relative">
      <Skeleton className="w-full aspect-4/3" />
      <div className="absolute top-3 right-3">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
    <div className="p-4 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-8" />
        </div>
        <div className="flex items-center space-x-1">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </div>
  </div>
);

// Search header skeleton
export const SearchHeaderSkeleton = () => (
  <div className="space-y-5">
    {/* Breadcrumb skeleton */}
    <div className="mb-5 2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto w-full">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-16" />
        <div className="text-gray-300">/</div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>

    {/* Black header section skeleton */}
    <div className="bg-black py-5 text-white">
      <div className="2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto w-full flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
        <Skeleton className="h-8 w-32" />
        <div className="flex-col items-center gap-2 hidden sm:flex">
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-44" />
        </div>
      </div>
    </div>

    {/* Filter tags skeleton */}
    <div className="flex gap-5 2xl:container px-6 sm:px-8 md:px-10 lg:px-14 mx-auto py-5">
      <div className="hidden sm:flex items-center gap-3 flex-wrap">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="lg:hidden ml-auto">
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);

// Side filters skeleton
export const SideFiltersSkeleton = () => (
  <div className="w-80 space-y-6 p-4">
    {/* Filter sections */}
    {[...Array(5)].map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="h-5 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {i === 1 && (
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

// Pagination skeleton
export const PaginationSkeleton = () => (
  <div className="flex justify-center items-center space-x-2 py-8">
    <Skeleton className="h-10 w-20" />
    <Skeleton className="h-10 w-10" />
    <Skeleton className="h-10 w-10" />
    <Skeleton className="h-10 w-10" />
    <Skeleton className="h-10 w-10" />
    <Skeleton className="h-10 w-20" />
  </div>
);

// Main properties grid skeleton
export const PropertiesGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {[...Array(12)].map((_, i) => (
      <PropertyCardSkeleton key={i} />
    ))}
  </div>
);

// Elegant loading dots
export const LoadingDots = ({ className = "" }) => (
  <div className={`flex space-x-2 ${className}`}>
    <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
  </div>
);
