"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/auth/route-guard";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

interface Company {
  _id: string;
  name: string;
  description: string;
  category: string;
  phone: string;
  email: string;
  website?: string;
  country: string;
  city: string;
  address: string;
  logo?: string;
  isApproved: boolean;
  createdAt: string;
  ownerEmail: string;
}

function ViewAdContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // جلب المستخدم الحالي على العميل فقط
    setCurrentUser(getCurrentUser());
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);

      // التأكد من توفر localStorage (العميل فقط)
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      const response = await fetch(
        `https://adwallpro.com/api/v1/companies/${id}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error("فشل في جلب بيانات الشركة");
      }

      const data = await response.json();
      const companyData = data.data || data;

      // التحقق من أن الشركة تخص المستخدم الحالي
      if (companyData.ownerEmail !== currentUser?.email) {
        toast.error("ليس لديك صلاحية عرض هذا الإعلان");
        router.push("/user-dashboard/manage/ads");
        return;
      }

      setCompany(companyData);
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("فشل في جلب بيانات الإعلان");
      router.push("/dashboard/manage/ads");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!company) return;

    if (
      !confirm(
        "هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء."
      )
    )
      return;

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;

      const response = await fetch(
        `https://adwallpro.com/api/v1/companies/delete/${company._id}`,
        {
          method: "DELETE",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.ok) {
        toast.success("تم حذف الإعلان بنجاح");
        router.push("/user-dashboard/manage/ads");
      } else {
        toast.error("فشل في حذف الإعلان");
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const getStatusBadge = () => {
    if (!company) return null;

    if (company.isApproved) {
      return (
        <Badge variant="default" className="bg-green-500 text-white">
          <CheckCircle className="h-3 w-3 mr-1" />
          معتمد ومنشور
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
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

  if (!company) {
    return (
      <div className="flex h-screen">
        <DashboardNav className="w-64 border-l" />
        <main className="flex-1 p-8">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">الإعلان غير موجود</h2>
            <Button asChild>
              <Link href="/user-dashboard/manage/ads">
                <ArrowLeft className="h-4 w-4 mr-2" />
                العودة للإعلانات
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav className="w-64 border-l bg-white" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/user-dashboard/manage/ads">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    العودة
                  </Link>
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    تفاصيل الإعلان
                  </h1>
                  <p className="text-gray-600 mt-1">معلومات شاملة عن إعلانك</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/user-dashboard/manage/ads/${company._id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    تعديل
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeleteCompany}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  حذف
                </Button>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{company.name}</h2>
                    <p className="text-muted-foreground">
                      التصنيف: {company.category}
                    </p>
                  </div>
                </div>
                {getStatusBadge()}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>وصف الشركة</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {company.description}
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>معلومات التواصل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">رقم الهاتف</p>
                      <p className="text-muted-foreground">{company.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">البريد الإلكتروني</p>
                      <p className="text-muted-foreground">{company.email}</p>
                    </div>
                  </div>

                  {company.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">الموقع الإلكتروني</p>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {company.website}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    الموقع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">الدولة</p>
                    <p className="font-medium">{company.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المدينة</p>
                    <p className="font-medium">{company.city}</p>
                  </div>
                  {company.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">العنوان</p>
                      <p className="font-medium">{company.address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    معلومات إضافية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      تاريخ الإنشاء
                    </p>
                    <p className="font-medium">
                      {new Date(company.createdAt).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">
                      معرف الإعلان
                    </p>
                    <p className="font-medium text-xs font-mono bg-gray-100 p-2 rounded">
                      {company._id}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Status Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    حالة الإعلان
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {company.isApproved ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">الإعلان معتمد ومنشور</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-orange-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">الإعلان قيد المراجعة</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {company.isApproved
                        ? "إعلانك مرئي لجميع المستخدمين في AddWall"
                        : "سيتم مراجعة إعلانك من قبل فريق الإدارة قريباً"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ViewAdPage() {
  return (
    <ProtectedRoute>
      <ViewAdContent />
    </ProtectedRoute>
  );
}
