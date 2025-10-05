"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { toast } from "sonner";
import { useI18n } from "@/providers/lang-provider";
import {
  Users,
  UserPlus,
  TrendingUp,
  AlertCircle,
  Shield,
  Crown,
} from "@/components/ui/icon";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";

interface UserStats {
  totalUsers: number;
  adminsCount: number;
  regularUsersCount: number;
  activeThisWeek: number;
  adminPercentage: string;
  regularUserPercentage: string;
  activePercentage: string;
}

function AdminUsersContent() {
  const { t } = useI18n();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  // جلب إحصائيات المستخدمين من API
  const fetchUserStats = async () => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      const response = await fetch("https://adwallpro.com/api/v1/users/stats", {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(t("adminFailedToFetchUserStats"));
      }

      const data = await response.json();
      setUserStats(data.data);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      toast.error(t("adminFailedToFetchUserStats"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("adminUsersManagementTitle")}
                </h1>
                <p className="text-gray-600 mt-2">
                  {t("adminUsersManagementDesc")}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {t("adminAddNewUser")}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("adminTotalUsers")}
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading
                    ? "..."
                    : userStats?.totalUsers.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("adminRegisteredUser")}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("adminAdmins")}
                </CardTitle>
                <Crown className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {loading ? "..." : userStats?.adminsCount || "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("adminAdminAccounts")}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("adminRegularUsers")}
                </CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {loading
                    ? "..."
                    : userStats?.regularUsersCount.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("adminForAdsUsers")}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("adminActiveThisWeek")}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {loading ? "..." : userStats?.activeThisWeek || "0"}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("adminActiveLast7Days")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Users Table */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                {t("adminUsersList")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminUsersTable />
            </CardContent>
          </Card>

          {/* Create User Dialog */}
          <CreateUserDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
          />
        </div>
      </main>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminRoute>
      <AdminUsersContent />
    </AdminRoute>
  );
}
