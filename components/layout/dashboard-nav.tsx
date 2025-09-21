"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore, signOut, getCurrentUser, isAdmin } from "@/lib/auth";
import {
  LayoutDashboard,
  Building2,
  Users,
  Tags,
  Ticket,
  Settings,
  LogOut,
  User,
  PlusCircle,
  Eye,
  BarChart3,
} from "@/components/ui/icon";
import { useI18n } from "@/providers/lang-provider";

function getAdminNavItems(t: (key: string) => string) {
  return [
    {
      title: t("overview"),
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: t("companiesManagementNav"),
      href: "/admin/companies",
      icon: Building2,
    },
    {
      title: t("usersManagement"),
      href: "/admin/users",
      icon: Users,
    },
    {
      title: t("categoriesManagement"),
      href: "/admin/categories",
      icon: Tags,
    },
    {
      title: t("couponsManagement"),
      href: "/admin/coupons",
      icon: Ticket,
    },
    {
      title: t("settings"),
      href: "/admin/settings",
      icon: Settings,
    },
  ];
}

function getUserNavItems(t: (key: string) => string) {
  return [
    {
      title: t("dashboardControl"),
      href: "/manage",
      icon: LayoutDashboard,
    },
    {
      title: t("adsManagement"),
      href: "/manage/ads",
      icon: Eye,
    },
    {
      title: t("addNewAd"),
      href: "/manage/ads/new",
      icon: PlusCircle,
    },
    {
      title: t("personalProfile"),
      href: "/manage/profile",
      icon: Users,
    },
  ];
}

interface DashboardNavProps {
  className?: string;
}

export function DashboardNav({ className }: DashboardNavProps) {
  const { t } = useI18n();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin(currentUser);

  const navItems = userIsAdmin ? getAdminNavItems(t) : getUserNavItems(t);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* User Info */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {currentUser?.name || t("user")}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {currentUser?.email}
            </p>
            <Badge
              variant={userIsAdmin ? "default" : "secondary"}
              className="mt-1 text-xs"
            >
              {userIsAdmin ? t("admin") : t("user")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          {t("signOut")}
        </Button>
      </div>
    </div>
  );
}
