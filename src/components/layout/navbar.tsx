"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import useScroll from "@/lib/use-scroll";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import NavbarUserAuth from "../auth/navbar-user-auth";
import BookMeeting from "../shared/book-meeting";
import { BuyResourcesDropdown } from "./buy-resources-dropdown";
import { SellResourcesDropdown } from "./sell-resources-dropdown";
import { LanguageSwitcher } from "../shared/language-switcher";
import { routing } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { OwnResourcesDropdown } from "./own-resources-dropdown";
import { AboutUsResourcesDropdown } from "./about-us-resources-dropdown";

export default function NavBar({
  colorChange = false,
  children,
}: {
  colorChange?: boolean;
  children?: React.ReactNode;
}) {
  const scrolled = useScroll(50);
  const pathname = usePathname();
  const locale = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations("navbar");

  const navLinks = [
    {
      href: Object.keys(routing.pathnames).find((key) => key === "/contact"),
      label: t("contact"),
    },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <div
        className={`fixed top-0 flex w-full justify-center  ${
          scrolled
            ? "border-b border-gray-200 bg-white/95 backdrop-blur-md"
            : "bg-white/0"
        } z-50 transition-all duration-300`}
      >
        <div className="2xl:container w-full mx-auto px-6 sm:px-8 md:px-10 lg:px-14 flex h-16 items-center justify-between">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <BuyResourcesDropdown
              scrolled={scrolled}
              colorChange={colorChange}
            />
            <OwnResourcesDropdown
              scrolled={scrolled}
              colorChange={colorChange}
            />
            <SellResourcesDropdown
              scrolled={scrolled}
              colorChange={colorChange}
            />

            <AboutUsResourcesDropdown
              scrolled={scrolled}
              colorChange={colorChange}
            />

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href!}
                locale={locale}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-gray-900",
                  scrolled
                    ? "text-gray-600"
                    : colorChange
                    ? "text-white"
                    : "text-gray-600",
                  isActiveLink(link.href!) && "text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <div className="flex items-center z-50">
            <Link href="/" className="text-xl font-bold text-gray-900">
              <Image
                src={
                  scrolled || !colorChange
                    ? "/images/buyproperytyportugal-logo-dark.png"
                    : "/images/buyproperytyportugal-logo.png"
                }
                alt={t("exclusivePortugalVillasLogo")}
                width={70}
                height={50}
                className="object-contain h-15 w-20"
              />
            </Link>
          </div>

          {/* Desktop Right Section */}
          <div
            className={cn(
              "hidden lg:flex items-center space-x-4",
              scrolled
                ? "text-gray-600"
                : colorChange
                ? "text-white"
                : "text-gray-600"
            )}
          >
            {children ? children : <LanguageSwitcher />}

            <BookMeeting />
            <NavbarUserAuth />
          </div>

          {/* Mobile/Tablet Right Section */}
          <div className="flex lg:hidden items-center space-x-3">
            {children ? (
              children
            ) : (
              <LanguageSwitcher
                className={
                  scrolled
                    ? "text-gray-600"
                    : colorChange
                    ? "text-white"
                    : "text-gray-600"
                }
              />
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className={cn(
                "p-2",
                scrolled
                  ? "text-gray-600"
                  : colorChange
                  ? "text-white"
                  : "text-gray-600"
              )}
              aria-label={t("toggleMenu")}
            >
              {isMobileMenuOpen ? (
                <X className={cn("h-5 w-5")} />
              ) : (
                <Menu
                  className={cn(
                    "h-5 w-5",
                    scrolled
                      ? "text-gray-600"
                      : colorChange
                      ? "text-white"
                      : "text-gray-600"
                  )}
                />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 left-1/4 bg-white z-40 lg:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-20 px-6 h-full flex flex-col">
          {/* Mobile User Auth - Added at the top */}
          <div className="pb-6 border-b border-gray-200 mb-6">
            <NavbarUserAuth />
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1">
            <div className="space-y-1">
              {/* Mobile Buy/Sell Dropdowns */}
              <div className="pb-4 space-y-3">
                <div className="flex flex-col items-start space-y-2">
                  <BuyResourcesDropdown scrolled={true} colorChange={false} />
                  <OwnResourcesDropdown
                    scrolled={scrolled}
                    colorChange={false}
                  />
                  <SellResourcesDropdown scrolled={true} colorChange={false} />
                  <AboutUsResourcesDropdown
                    scrolled={true}
                    colorChange={false}
                  />
                </div>
              </div>

              {/* Regular Navigation Links */}
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href!}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-sm font-light py-4 transition-colors ${
                    isActiveLink(link.href!)
                      ? "text-primary border-l-2 border-primary pl-4"
                      : "text-gray-700 hover:text-gray-900 pl-0"
                  }`}
                  style={{
                    animationDelay: `${(index + 2) * 0.1}s`, // +2 to account for dropdown components
                    animation: isMobileMenuOpen
                      ? "slideInLeft 0.3s ease-out forwards"
                      : "none",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Mobile Action Buttons */}
          <div className="pb-8 space-y-4">
            <BookMeeting />
            <Button
              size="lg"
              className="w-full rounded-none bg-black hover:bg-black/90 text-white text-sm font-light h-12"
              asChild
            >
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                {t("signIn")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
