"use client";

import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";

interface BackButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  href: string | any;
  label: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button
      variant="default"
      className="font-normal flex mx-auto border md:px-10 bg-gray-200 text-black hover:bg-black hover:text-white transition-colors"
      size="sm"
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
