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

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const languages = routing.locales;

  const handleLanguageChange = (lang: string) => {
    if (lang !== locale) {
      // @ts-expect-error -- Typescript will validate only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks
      router.push(pathname, { locale: lang });
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
            className={cn("flex items-center space-x-1", className)}
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
