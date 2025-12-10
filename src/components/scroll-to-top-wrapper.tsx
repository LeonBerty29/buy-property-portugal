"use client";
import { useEffect } from "react";

export function ScrollToTopWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // This ensures the scroll resets on client-side navigation
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []); // Empty deps: fire once on mount

  return <>{children}</>;
}
