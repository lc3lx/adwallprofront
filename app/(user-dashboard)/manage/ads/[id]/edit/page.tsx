"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProtectedRoute } from "@/components/auth/route-guard";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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
}

interface Category {
  _id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}

function EditAdContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    phone: "",
    email: "",
    website: "",
    country: "",
    city: "",
    address: "",
  });

  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // جلب بيانات الشركة
      const companyResponse = await fetch(
        `https://adwallpro.com/api/v1/companies/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      if (!companyResponse.ok) {
        throw new Error("فشل في جلب بيانات الشركة");
      }

      const companyData = await companyResponse.json();
      const companyInfo = companyData.data || companyData;

      // التحقق من أن الشركة تخص المستخدم الحالي
      if (companyInfo.ownerEmail !== currentUser?.email) {
        toast.error("ليس لديك صلاحية تعديل هذا الإعلان");
        router.push("/user-dashboard/manage/ads");
        return;
      }

      setCompany(companyInfo);
      setFormData({
        name: companyInfo.name || "",
        description: companyInfo.description || "",
        category: companyInfo.category || "",
        phone: companyInfo.phone || "",
        email: companyInfo.email || "",
        website: companyInfo.website || "",
        country: companyInfo.country || "",
        city: companyInfo.city || "",
        address: companyInfo.address || "",
      });

      // جلب التصنيفات
      const categoriesResponse = await fetch(
        "https://adwallpro.com/api/v1/categories"
      );
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data || categoriesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("فشل في جلب البيانات");
      router.push("/user-dashboard/manage/ads");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!company) return;

    try {
      setSaving(true);

      const response = await fetch(
        `https://adwallpro.com/api/v1/companies/update/${company._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("تم تحديث الإعلان بنجاح");
        router.push("/user-dashboard/manage/ads");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "فشل في تحديث الإعلان");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("حدث خطأ أثناء التحديث");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/user-dashboard/manage/ads">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  العودة
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  تعديل الإعلان
                </h1>
                <p className="text-gray-600 mt-1">
                  تحديث بيانات إعلانك في AddWall
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات الإعلان</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">اسم الشركة *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="اسم الشركة"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">التصنيف *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category.slug}>
                            {category.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">وصف الشركة *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="وصف مفصل للشركة وخدماتها"
                    rows={4}
                    required
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+966 50 000 0000"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="info@company.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">الموقع الإلكتروني</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    placeholder="https://www.company.com"
                  />
                </div>

                {/* Location Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="country">الدولة *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      placeholder="السعودية"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">المدينة *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="الرياض"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="العنوان التفصيلي"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        حفظ التغييرات
                      </>
                    )}
                  </Button>

                  <Button type="button" variant="outline" asChild>
                    <Link href="/user-dashboard/manage/ads">إلغاء</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function EditAdPage() {
  return (
    <ProtectedRoute>
      <EditAdContent />
    </ProtectedRoute>
  );
}
