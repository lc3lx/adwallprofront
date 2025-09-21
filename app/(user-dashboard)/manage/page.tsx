"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/route-guard";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import {
  Building2,
  PlusCircle,
  TrendingUp,
  Eye,
  Clock,
  CheckCircle,
  BarChart3,
  Users,
  Calendar,
  ArrowRight,
} from "@/components/ui/icon";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

interface Company {
  _id: string;
  name: string;
  description: string;
  category: string;
  isApproved: boolean;
  createdAt: string;
  logo?: string;
  ownerEmail?: string;
  views?: number;
}

function UserDashboardContent() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    approvedCompanies: 0,
    pendingCompanies: 0,
    totalViews: 0,
    monthlyGrowth: 0,
  });
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // جلب جميع الشركات وفلترة الخاصة بالمستخدم
      const response = await fetch("https://adwallpro.com/api/v1/companies", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const allCompanies = data.data || data;

        // فلترة الشركات الخاصة بالمستخدم الحالي
        const userCompanies = allCompanies.filter(
          (company: Company) => company.ownerEmail === currentUser?.email
        );

        setRecentCompanies(userCompanies.slice(0, 5)); // آخر 5 شركات

        setStats({
          totalCompanies: userCompanies.length,
          approvedCompanies: userCompanies.filter((c: Company) => c.isApproved)
            .length,
          pendingCompanies: userCompanies.filter((c: Company) => !c.isApproved)
            .length,
          totalViews: userCompanies.reduce(
            (sum: number, company: Company) => sum + (company.views || 0),
            0
          ),
          monthlyGrowth: 15, // يمكن حسابه من البيانات الفعلية
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <DashboardNav className="w-64 border-l" />
        <main className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav className="w-64 border-l bg-white" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  لوحة التحكم
                </h1>
                <p className="text-gray-600 mt-2">
                  مرحباً بك في لوحة تحكم AddWall - إدارة إعلاناتك بسهولة
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild variant="outline">
                  <Link href="/manage/ads">
                    <Eye className="h-4 w-4 mr-2" />
                    إدارة الإعلانات
                  </Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/manage/ads/new">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    إضافة إعلان جديد
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الإعلانات
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCompanies}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.monthlyGrowth > 0 && (
                    <span className="text-green-600">
                      +{stats.monthlyGrowth}% من الشهر الماضي
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المعتمدة</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.approvedCompanies}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalCompanies > 0
                    ? Math.round(
                        (stats.approvedCompanies / stats.totalCompanies) * 100
                      )
                    : 0}
                  % معدل القبول
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  قيد المراجعة
                </CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.pendingCompanies}
                </div>
                <p className="text-xs text-muted-foreground">
                  في انتظار الموافقة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي المشاهدات
                </CardTitle>
                <Eye className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalViews}
                </div>
                <p className="text-xs text-muted-foreground">
                  مشاهدات هذا الشهر
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    إجراءات سريعة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full justify-start">
                    <Link href="/manage/ads/new">
                      <PlusCircle className="h-4 w-4 mr-3" />
                      إضافة إعلان جديد
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/manage/ads">
                      <Eye className="h-4 w-4 mr-3" />
                      عرض جميع الإعلانات
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/manage/profile">
                      <Users className="h-4 w-4 mr-3" />
                      تعديل الملف الشخصي
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Account Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    معلومات الحساب
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">الاسم</p>
                    <p className="font-medium">{currentUser?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      البريد الإلكتروني
                    </p>
                    <p className="font-medium">{currentUser?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      تاريخ الانضمام
                    </p>
                    <p className="font-medium">
                      {currentUser?.createdAt
                        ? new Date(currentUser.createdAt).toLocaleDateString(
                            "ar-SA"
                          )
                        : "غير محدد"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Companies */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      آخر الإعلانات
                    </CardTitle>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/manage/ads">
                        عرض الكل
                        <ArrowRight className="h-4 w-4 mr-2" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentCompanies.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        لا توجد إعلانات
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        ابدأ بإضافة أول إعلان لك في AddWall
                      </p>
                      <Button asChild>
                        <Link href="/manage/ads/new">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          إضافة أول إعلان
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentCompanies.map((company) => (
                        <div
                          key={company._id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              {company.logo ? (
                                <img
                                  src={company.logo}
                                  alt={company.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Building2 className="h-6 w-6 text-primary" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">
                                {company.name}
                              </h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {company.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                التصنيف: {company.category}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {company.isApproved ? (
                              <Badge variant="default" className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                معتمد
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                قيد المراجعة
                              </Badge>
                            )}

                            <Button asChild variant="outline" size="sm">
                              <Link href={`/manage/ads/${company._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <ProtectedRoute>
      <UserDashboardContent />
    </ProtectedRoute>
  );
}
