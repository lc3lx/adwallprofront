"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/providers/lang-provider";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { cn } from "@/lib/utils";
import {
  Plus,
  Home,
  Grid3X3,
  Settings,
  Sparkles,
  Info,
  LogIn,
  Shield,
  LayoutDashboard,
} from "@/components/ui/icon";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export function UltraHeader() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  // تحديد تكوين زر إضافة الإعلان بناءً على حالة تسجيل الدخول
  const getAddButtonConfig = () => {
    if (user) {
      return {
        href: "/manage/ads/new",
        label: t("addNewAdBtn"),
        icon: Plus,
      };
    } else {
      return {
        href: "/login",
        label: t("addNewAdBtn"),
        icon: Plus,
      };
    }
  };

  const addButtonConfig = getAddButtonConfig();

  // Check if user is on dashboard pages
  const isOnDashboard = pathname.startsWith("/manage");

  const nav = [
    // Show dashboard button for regular users when not on dashboard
    ...(user && !isAdmin(user) && !isOnDashboard
      ? [
          {
            href: "/manage",
            label: t("dashboard"),
            icon: LayoutDashboard,
            onClick: undefined,
          },
        ]
      : []),
    // Show home button when on dashboard
    ...(isOnDashboard
      ? [{ href: "/", label: t("home"), icon: Home, onClick: undefined }]
      : []),
    // Regular navigation when not on dashboard
    ...(!isOnDashboard
      ? [
          { href: "/", label: t("home"), icon: Home, onClick: undefined },
          {
            href: "/categories",
            label: t("categories"),
            icon: Grid3X3,
            onClick: undefined,
          },
          {
            href: "/about",
            label: t("aboutUs"),
            icon: Info,
            onClick: undefined,
          },
          {
            href: "/privacy-policy",
            label: t("privacyPolicy"),
            icon: Shield,
            onClick: undefined,
          },
        ]
      : []),
    {
      href: addButtonConfig.href,
      label: addButtonConfig.label,
      icon: addButtonConfig.icon,
      onClick: undefined,
    },
    ...(isAdmin(user)
      ? [
          {
            href: "/admin",
            label: t("admin"),
            icon: Settings,
            onClick: undefined,
          },
        ]
      : []),
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container-premium">
        <div className="flex h-20 lg:h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative h-14 w-14 lg:h-16 lg:w-16 overflow-hidden rounded-3xl group-hover:ring-primary-300 transition-all duration-300">
                <Image
                  src="/images/adwell-logo.jpg"
                  alt="AdWallPro Logo"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl lg:text-3xl font-bold gradient-text">
                AdWallPor
              </h1>
              <p className="text-sm text-muted-foreground -mt-1 font-medium">
                {t("modernAdWall")}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {nav.map((n) => {
              const Icon = n.icon;
              const isActive =
                pathname === n.href ||
                (n.href === "/categories" &&
                  (pathname.startsWith("/category") ||
                    pathname.startsWith("/companies/category") ||
                    pathname === "/categories"));

              if (n.onClick) {
                return (
                  <button
                    key={n.href}
                    onClick={n.onClick}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300",
                      "hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:scale-105",
                      "text-foreground/70 hover:text-primary-600"
                    )}
                  >
                    <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    {n.label}
                  </button>
                );
              }

              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300",
                    "hover:bg-primary-50 dark:hover:bg-primary-950/50 hover:scale-105",
                    isActive
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 shadow-lg"
                      : "text-foreground/70 hover:text-primary-600"
                  )}
                >
                  <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  {n.label}
                  {isActive && (
                    <Sparkles className="h-4 w-4 text-primary-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <SignInDialog />
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 lg:hidden">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative h-12 w-12 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-950/50"
            >
              <div className="flex flex-col items-center justify-center">
                <span
                  className={cn(
                    "block h-0.5 w-6 bg-current transition-all duration-300",
                    mobileOpen ? "rotate-45 translate-y-1.5" : ""
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-6 bg-current transition-all duration-300 mt-1.5",
                    mobileOpen ? "opacity-0" : ""
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-6 bg-current transition-all duration-300 mt-1.5",
                    mobileOpen ? "-rotate-45 -translate-y-1.5" : ""
                  )}
                />
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-20 transition-all duration-500 ease-out",
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-8 pointer-events-none"
        )}
      >
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 mx-6 rounded-3xl shadow-2xl">
          <div className="p-8 space-y-8">
            <nav className="space-y-3">
              {nav.map((n) => {
                const Icon = n.icon;
                const isActive =
                  pathname === n.href ||
                  (n.href === "/categories" &&
                    (pathname.startsWith("/category") ||
                      pathname.startsWith("/companies/category") ||
                      pathname === "/categories"));

                if (n.onClick) {
                  return (
                    <button
                      key={n.href}
                      onClick={n.onClick}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl px-6 py-4 text-base font-semibold transition-all duration-300 w-full text-left",
                        "text-foreground/70 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-950/50"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                      {n.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl px-6 py-4 text-base font-semibold transition-all duration-300",
                      isActive
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300 shadow-lg"
                        : "text-foreground/70 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-950/50"
                    )}
                  >
                    <Icon className="h-6 w-6" />
                    {n.label}
                    {isActive && (
                      <Sparkles className="h-4 w-4 text-primary-500 ml-auto" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t pt-6 space-y-6">
              <SignInDialog />
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">{t("theme")}</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
