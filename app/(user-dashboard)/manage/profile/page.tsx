"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProtectedRoute } from "@/components/auth/route-guard";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { useI18n } from "@/providers/lang-provider";
import { User, Mail, Phone, Calendar, Save, Loader2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

function ProfileContent() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // في الواقع، يجب أن يكون هناك endpoint لجلب بيانات المستخدم
      // لكن مؤقتاً سنستخدم البيانات من localStorage
      if (currentUser) {
        setUser({
          _id: currentUser._id || currentUser.id || "",
          name: currentUser.name,
          email: currentUser.email,
          phone: currentUser.phone || "",
          role: currentUser.role,
          createdAt: currentUser.createdAt || new Date().toISOString(),
        });

        setFormData({
          name: currentUser.name,
          phone: currentUser.phone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error(t("failedToFetchProfile"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      // تحديث البيانات محلياً (في الواقع يجب أن يكون هناك API call)
      const updatedUser = {
        ...currentUser,
        name: formData.name,
        phone: formData.phone,
      };

      // تحديث localStorage
      localStorage.setItem("user_data", JSON.stringify(updatedUser));

      toast.success("تم تحديث الملف الشخصي بنجاح");

      // إعادة تحميل الصفحة لتحديث البيانات
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t("failedToUpdateProfile"));
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

  if (!user) {
    return (
      <div className="flex h-screen">
        <DashboardNav className="w-64 border-l" />
        <main className="flex-1 p-8">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">فشل في جلب البيانات</h2>
            <Button onClick={fetchUserProfile}>إعادة المحاولة</Button>
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
            <h1 className="text-3xl font-bold text-gray-900">{t("profile")}</h1>
            <p className="text-gray-600 mt-2">{t("manageAccountData")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("accountInformation")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">{t("fullName")}</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="pl-10"
                          placeholder="الاسم الكامل"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={user.email}
                          className="pl-10"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("cannotChangeEmail")}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="phone">{t("phoneNumber")}</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="pl-10"
                          placeholder="+966 50 000 0000"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={saving} className="w-full">
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t("saving")}
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t("saveChanges")}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Profile Info Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("accountStatus")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("type")}
                    </span>
                    <span className="font-medium">
                      {user.role === "admin" ? t("admin") : t("user")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("status")}
                    </span>
                    <span className="font-medium text-green-600">
                      {t("active")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {t("joinDate")}
                    </span>
                    <span className="font-medium text-sm">
                      {new Date(user.createdAt).toLocaleDateString("ar-SA")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("quickStats")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">
                      {t("activeAds")}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-muted-foreground">
                      {t("viewsThisMonth")}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Note */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-900">
                        {t("securityTip")}
                      </h4>
                      <p className="text-sm text-orange-700 mt-1">
                        {t("securityTipDesc")}
                      </p>
                    </div>
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

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
