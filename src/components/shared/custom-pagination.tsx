"use client"

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/paginationtwo";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { env } from '@/env'
import { cn } from "@/lib/utils";

interface PaginationProps {
  baseURL: string;
  totalPages: number;
  maxVisiblePages?: number;
  styles: {
    paginationRoot: string;
    paginationPrevious: string;
    paginationNext: string;
    paginationLink: string;
    paginationLinkActive: string;
  }
}

export const CustomPagination = (props: PaginationProps) => {
  const { baseURL, totalPages, maxVisiblePages = 5, styles } = props
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current page from URL search params
  const getCurrentPage = () => {
    const pageParam = searchParams.get("page");
    const parsed = Number.parseInt(pageParam || "1", 10);
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
  };

  const [currentPage, setCurrentPage] = useState(getCurrentPage);

  const [visibleRange, setVisibleRange] = useState({
    start: 1,
    end: Math.min(maxVisiblePages, totalPages)
  });

  // Update currentPage when URL changes
  useEffect(() => {
    setCurrentPage(getCurrentPage());
  }, [searchParams]);

  useEffect(() => {
    const halfVisible = Math.floor(maxVisiblePages / 2);
    const newStart = Math.max(1, Math.min(currentPage - halfVisible, totalPages - maxVisiblePages + 1));
    const newEnd = Math.min(newStart + maxVisiblePages - 1, totalPages);
    setVisibleRange({ start: newStart, end: newEnd });
  }, [currentPage, totalPages, maxVisiblePages]);

  const createPageUrl = (pageNumber: number) => {
    const url = new URL(baseURL, process.env.NEXT_PUBLIC_APP_URL);
    url.searchParams.set("page", pageNumber.toString());
    return url.toString();
  };

  const navigateToPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    router.push(`${baseURL}?${params.toString()}`);
  };

  const handleEllipsisClick = (direction: "left" | "right") => {
    const newPage =
      direction === "left" ?
        Math.max(1, visibleRange.start - maxVisiblePages) :
        Math.min(totalPages, visibleRange.end + maxVisiblePages);

    navigateToPage(newPage);
  };

  return (
    <PaginationRoot className={styles.paginationRoot}>
      <PaginationContent className="lg:gap-4">
        <PaginationItem>
          <PaginationPrevious
            className={cn(
              currentPage <= 1 && "hidden",
              styles.paginationPrevious,
            )}
            href={createPageUrl(currentPage - 1)}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) navigateToPage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {
          visibleRange.start > 1 && (
            <PaginationItem className="hidden lg:block">
              <PaginationLink
                className={styles.paginationLink}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleEllipsisClick('left');
                }}
              >...</PaginationLink>
            </PaginationItem>
          )
        }

        {
          Array.from({ length: visibleRange.end - visibleRange.start + 1 }, (_, index) => visibleRange.start + index,
          ).map((pageNumber) => {
            const isActive = pageNumber === currentPage;
            let rel = "";
            if (pageNumber === currentPage - 1) {
              rel = "prev"
            }
            if (pageNumber === currentPage + 1) {
              rel = "next"
            }
            return <PaginationItem key={pageNumber}>
              <PaginationLink
                isActive={isActive}
                href={createPageUrl(pageNumber)}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToPage(pageNumber);
                }}
                {...(rel ? { rel } : {})}
                className={cn(
                  styles.paginationLink,
                  isActive && styles.paginationLinkActive
                )}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>;
          })
        }

        {
          visibleRange.end < totalPages && (
            <PaginationItem className="hidden lg:block">
              <PaginationLink
                className={styles.paginationLink}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleEllipsisClick('right');
                }}
              >...</PaginationLink>
            </PaginationItem>
          )
        }

        <PaginationItem>
          <PaginationNext
            className={cn(
              currentPage >= totalPages && "hidden",
              styles.paginationNext,
            )}
            href={createPageUrl(currentPage + 1)}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) navigateToPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}