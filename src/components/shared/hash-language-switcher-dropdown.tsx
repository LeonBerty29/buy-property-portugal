"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import { useParams } from "next/navigation";

export const HashLanguageSwitcherDropdown = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams()
  const hash = params.hash as string
  const router = useRouter();

  const isPropertiesHashPage = pathname.includes("/exclusive-listing/");

  if (!isPropertiesHashPage) {
    return <LanguageSwitcher />;
  }
  const languages = routing.locales;

  const handleLanguageChange = (lang: string) => {
    if (lang !== locale) {
      const path = hash;
      const targetPath = path
        ? {
            pathname: "/exclusive-listing/[hash]" as const,
            params: { hash: path },
          }
        : "/";

      router.replace(targetPath, { locale: lang });
      router.refresh();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1"
          >
            <Globe className="h-4 w-4" />
            <span className="text-sm">{locale}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-20">
          {/* <DropdownMenuItem className="cursor-pointer">
            <span className="text-sm">ENG</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <span className="text-sm">FRE</span>
          </DropdownMenuItem> */}
          {languages.map((lang, index) => (
            <DropdownMenuItem
              key={`${lang}-${index}`}
              className={cn(
                "cursor-pointer",
                lang === locale && "text-primary"
              )}
              onClick={() => handleLanguageChange(lang)}
            >
              <span className="text-base">{lang}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
