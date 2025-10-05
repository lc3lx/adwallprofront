"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminRoute } from "@/components/auth/route-guard";
import { UserStatsCards } from "@/components/admin/user-stats-cards";
import { useI18n } from "@/providers/lang-provider";
import {
  Building2,
  Users,
  Tags,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
} from "@/components/ui/icon";
import Link from "next/link";

interface StatsData {
  totalCompanies: number;
  pendingCompanies: number;
  approvedCompanies: number;
  rejectedCompanies: number;
  totalUsers: number;
  totalCategories: number;
  recentActivity: any[];
}

function AdminDashboardContent() {
  const { t } = useI18n();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Admin dashboard component mounted");
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // جلب البيانات من الـ API
      const [companiesRes, usersRes, categoriesRes] = await Promise.all([
        fetch("https://adwallpro.com/api/v1/companies"),
        fetch("https://adwallpro.com/api/v1/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }),
        fetch("https://adwallpro.com/api/v1/categories"),
      ]);

      const [companies, users, categories] = await Promise.all([
        companiesRes.json(),
        usersRes.json(),
        categoriesRes.json(),
      ]);

      const companiesData = companies.data || companies;
      const usersData = users.data || users;
      const categoriesData = categories.data || categories;

      setStats({
        totalCompanies: Array.isArray(companiesData) ? companiesData.length : 0,
        pendingCompanies: Array.isArray(companiesData)
          ? companiesData.filter((c: any) => !c.isApproved).length
          : 0,
        approvedCompanies: Array.isArray(companiesData)
          ? companiesData.filter((c: any) => c.isApproved).length
          : 0,
        rejectedCompanies: 0, // يمكن إضافته لاحقاً
        totalUsers: Array.isArray(usersData) ? usersData.length : 0,
        totalCategories: Array.isArray(categoriesData)
          ? categoriesData.length
          : 0,
        recentActivity: [], // يمكن إضافته لاحقاً
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {t("adminDashboardTitle")}
            </h1>
            <p className="text-gray-600 mt-2">{t("adminDashboardWelcome")}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("adminTotalCompanies")}
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalCompanies || 0}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {stats?.approvedCompanies || 0} {t("adminApproved")}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {stats?.pendingCompanies || 0} {t("adminPending")}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("adminTotalUsers")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalUsers || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("adminRegisteredUsers")}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("adminCategories")}
                </CardTitle>
                <Tags className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalCategories || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("adminAvailableCategories")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Statistics Section */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {t("adminUserStatistics")}
              </h2>
              <p className="text-sm text-gray-600">
                {t("adminUserStatisticsDesc")}
              </p>
            </div>
            <UserStatsCards />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  {t("adminCompaniesManagement")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("adminReviewApproveCompanies")}
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href="/admin/companies">
                      {t("adminViewCompanies")}
                    </Link>
                  </Button>
                  {stats?.pendingCompanies && stats.pendingCompanies > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.pendingCompanies} {t("adminPending")}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  {t("adminUsersManagement")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("adminManageUserAccounts")}
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/users">{t("adminManageUsers")}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tags className="h-5 w-5 text-green-500" />
                  {t("adminCategoriesManagement")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("adminAddEditCategories")}
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/categories">
                    {t("adminManageCategories")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{t("adminRecentActivity")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {t("adminNewCompanyApproved")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      5 {t("adminMinutesAgo")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {t("adminNewUserRegistered")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      15 {t("adminMinutesAgo")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {t("adminNewCategoryRequest")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("adminHourAgo")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <AdminDashboardContent />
    </AdminRoute>
  );
}
