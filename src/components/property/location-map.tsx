"use client";

import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";

export function HomeMap({ locationValue }: { locationValue: [number, number] }) {
  const LazyMap = dynamic(() => import("@/components/shared/map"), {
    ssr: false,
    loading: () => <Skeleton className="h-[350px] w-full" />,
  });

  return <LazyMap locationValue={locationValue} />;
}
