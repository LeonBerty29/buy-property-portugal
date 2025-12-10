"use client";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

// Export existing resume document
// export { ResumeDocument } from "./resume/document";

// Export new property brochure components
export { PropertyBrochureDocument } from "./property/document";
export type { PropertyData } from "./property/types";
export {
  getSamplePropertyData,
  convertHtmlPropertyToData,
} from "./property/data";

// Dynamic PDF components
export const PDFViewer = dynamic(
  async () => await import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        Loading PDF Viewer...
      </div>
    ),
  }
);

export const PDFDownloadLink = dynamic(
  async () =>
    await import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button disabled>
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
        Loading...
      </Button>
    ),
  }
);
