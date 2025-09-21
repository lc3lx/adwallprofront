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
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
} from "@/components/ui/icon";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

interface Company {
  _id: string;
  name?: string;
  companyName?: string;
  description?: string;
  category?: string;
  status?: string;
  isApproved?: boolean;
  createdAt?: string;
  logo?: string;
  email?: string;
  country?: string;
  city?: string;
  whatsapp?: string;
  website?: string;
  facebook?: string;
  userId?: string;
}

function UserAdsContent() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchUserCompanies();
  }, []);

  const fetchUserCompanies = async () => {
    try {
      setLoading(true);

      // جلب جميع الشركات ثم فلترة الخاصة بالمستخدم
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
          (company: any) =>
            company.ownerEmail === currentUser?.email ||
            company.email === currentUser?.email
        );

        setCompanies(userCompanies);
      }
    } catch (error) {
      console.error("Error fetching user companies:", error);
      toast.error("فشل في جلب الإعلانات");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) return;

    try {
      const response = await fetch(
        `https://adwallpro.com/api/v1/companies/delete/${companyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (response.ok) {
        setCompanies(companies.filter((company) => company._id !== companyId));
        toast.success("تم حذف الإعلان بنجاح");
      } else {
        toast.error("فشل في حذف الإعلان");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const companyName = company.name || company.companyName || "";
    const matchesSearch =
      companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (company.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && company.isApproved) ||
      (statusFilter === "pending" && !company.isApproved);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (company: Company) => {
    if (company.isApproved) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          معتمد
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        قيد المراجعة
      </Badge>
    );
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                إدارة الإعلانات
              </h1>
              <p className="text-gray-600 mt-2">
                إدارة إعلاناتك الشخصية في AddWall
              </p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/manage/ads/new">
                <PlusCircle className="h-4 w-4 mr-2" />
                إضافة إعلان جديد
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الإعلانات
                </CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{companies.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المعتمدة</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {companies.filter((c) => c.isApproved).length}
                </div>
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
                  {companies.filter((c) => !c.isApproved).length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  معدل القبول
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {companies.length > 0
                    ? Math.round(
                        (companies.filter((c) => c.isApproved).length /
                          companies.length) *
                          100
                      )
                    : 0}
                  %
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="البحث في الإعلانات..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    الكل ({companies.length})
                  </Button>
                  <Button
                    variant={
                      statusFilter === "approved" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter("approved")}
                  >
                    معتمد ({companies.filter((c) => c.isApproved).length})
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                  >
                    قيد المراجعة (
                    {companies.filter((c) => !c.isApproved).length})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Companies List */}
          <div className="space-y-6">
            {filteredCompanies.length === 0 ? (
              <Card>
                <CardContent className="py-16">
                  <div className="text-center">
                    <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {companies.length === 0
                        ? "لا توجد إعلانات"
                        : "لا توجد نتائج"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {companies.length === 0
                        ? "ابدأ بإضافة أول إعلان لك في AddWall"
                        : "جرب تغيير معايير البحث"}
                    </p>
                    {companies.length === 0 && (
                      <Button asChild>
                        <Link href="/manage/ads/new">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          إضافة أول إعلان
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredCompanies.map((company) => (
                <Card
                  key={company._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          {company.logo ? (
                            <img
                              src={company.logo}
                              alt={
                                company.name || company.companyName || "Company"
                              }
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building2 className="h-8 w-8 text-primary" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold truncate">
                              {company.name ||
                                company.companyName ||
                                "شركة غير محددة"}
                            </h3>
                            {getStatusBadge(company)}
                          </div>

                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {company.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>التصنيف: {company.category}</span>
                            <span>•</span>
                            <span>
                              تم الإنشاء:{" "}
                              {company.createdAt
                                ? new Date(
                                    company.createdAt
                                  ).toLocaleDateString("ar-SA")
                                : "غير محدد"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/user-dashboard/manage/ads/${company._id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            عرض
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/user-dashboard/manage/ads/${company._id}/edit`}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            تعديل
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCompany(company._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          حذف
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function UserAdsPage() {
  return (
    <ProtectedRoute>
      <UserAdsContent />
    </ProtectedRoute>
  );
}
