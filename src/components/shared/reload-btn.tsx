"use client";
import { Link, useRouter } from "@/i18n/navigation";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export const ReloadBtn = ({
  className,
  text,
  showHome = false,
}: {
  className?: string;
  text?: string;
  showHome?: boolean;
}) => {
  const router = useRouter();
  const t = useTranslations("reloadBtn");
  const [isPending, startTransition] = useTransition();
  const handleOnClick = () => {
    startTransition(() => {
      router.refresh();
    });
  };
  return (
    <div className=" flex items-center gap-4 flex-wrap justify-center">
      <Button
        onClick={handleOnClick}
        className={cn(
          "bg-primary hover:bg-primary/90 text-white px-8 border-primary transition-colors",
          className
        )}
        disabled={isPending}
      >
        {text ? text : "Reload"}
        {isPending ? (
          <Loader2 className="size-4 text-white animate-spin" />
        ) : (
          ""
        )}
      </Button>

      {showHome && (
        <Button
          className="bg-transparent border border-black text-black hover:bg-black hover:text-white transition-colors"
          asChild
        >
          <Link href={"/"} className="text-gray-800">
            {t("home")}
          </Link>
        </Button>
      )}
    </div>
  );
};
