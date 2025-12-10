"use client";

import { useState, useEffect } from "react";
import { StoryblokRichTextNode } from "@storyblok/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl"; // import useTranslations for client components

interface Resource {
  id: string;
  slug: string;
  name: string;
  content: {
    title: string;
    content: StoryblokRichTextNode<string | TrustedHTML>;
  };
}

export function AboutUsResourcesDropdown({
  scrolled,
  colorChange,
}: {
  scrolled: boolean;
  colorChange?: boolean;
}) {
  const t = useTranslations("aboutUsResourceDropdown"); // import translations
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const locale = useLocale();

  useEffect(() => {
    async function fetchResources() {
      try {
        const response = await fetch(
          `/api/resources/about-us-resources?locale=${locale}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setResources(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : t("failedToFetchResources")
        );
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [locale, t]);

  if (loading) {
    return <Skeleton className="h-6 w-12" aria-label={t("loading")} />;
  }

  if (error) {
    return (
      <Skeleton
        className="h-6 w-12 border rounded-md bg-red-200 text-red-600"
        aria-label={t("errorLoading")}
      />
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center space-x-1 bg-transparent hover:!bg-transparent !p-0",
              scrolled
                ? "text-gray-600"
                : colorChange
                ? "text-white"
                : "text-gray-600"
            )}
          >
            {t("aboutEAV")}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-3">
          {resources.length === 0 ? (
            <DropdownMenuItem disabled>
              {t("noResourcesAvailable")}
            </DropdownMenuItem>
          ) : (
            resources.map((resource) => (
              <DropdownMenuItem
                key={resource.id}
                asChild
                className="cursor-pointer py-3 hover:bg-gray-100 text-gray-800 border-b border-gray-200"
              >
                <Link
                  href={{
                    pathname: "/about-eav/[slug]",
                    params: { slug: resource.slug },
                  }}
                >
                  {resource.name}
                </Link>
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuItem
            asChild
            className="cursor-pointer py-3 hover:bg-gray-100 text-gray-800 border-b border-gray-200"
          >
            <Link href={{ pathname: "/about-eav/the-team" }}>
              {t("theTeam")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="cursor-pointer py-3 hover:bg-gray-100 text-gray-800 border-b border-gray-200"
          >
            <Link href={{ pathname: "/about-eav/client-testimonials" }}>
              {t("clientTestimonials")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}