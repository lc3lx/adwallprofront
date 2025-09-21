"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import {
  Settings,
  Server,
  Database,
  Mail,
  Shield,
  AlertCircle,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

function AdminSettingsContent() {
  const [settings, setSettings] = useState({
    apiUrl: "https://adwallpro.com/api/v1",
    appName: "AddWall",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    enable2FA: false,
    enableLogging: true,
    enableSpamProtection: true,
    enableAutoBackup: true,
    enableCompression: false,
  });

  const handleSave = () => {
    // هنا سيتم حفظ الإعدادات في قاعدة البيانات
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardNav className="w-64 border-l bg-white" />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  إعدادات النظام
                </h1>
                <p className="text-gray-600 mt-2">
                  إدارة إعدادات المنصة والتكوين العام
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              حفظ التغييرات
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  حالة النظام
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">ممتاز</div>
                <p className="text-xs text-muted-foreground mt-2">
                  جميع الخدمات تعمل بشكل طبيعي
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  مساحة القرص
                </CardTitle>
                <Database className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">2.4 GB</div>
                <p className="text-xs text-muted-foreground mt-2">
                  75% من المساحة متاحة
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  آخر نسخة احتياطية
                </CardTitle>
                <Shield className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  منذ ساعة
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  تم إنشاؤها بنجاح
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الذاكرة المستخدمة
                </CardTitle>
                <Server className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">68%</div>
                <p className="text-xs text-muted-foreground mt-2">
                  الأداء مستقر وطبيعي
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Settings Cards */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* إعدادات الخادم */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  إعدادات الخادم
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api-url">رابط API</Label>
                  <Input
                    id="api-url"
                    value={settings.apiUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, apiUrl: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="app-name">اسم التطبيق</Label>
                  <Input
                    id="app-name"
                    value={settings.appName}
                    onChange={(e) =>
                      setSettings({ ...settings, appName: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* إعدادات قاعدة البيانات */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  قاعدة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>النسخ الاحتياطي التلقائي</Label>
                  <Switch
                    checked={settings.enableAutoBackup}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, enableAutoBackup: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>ضغط البيانات</Label>
                  <Switch
                    checked={settings.enableCompression}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, enableCompression: checked })
                    }
                  />
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  إنشاء نسخة احتياطية الآن
                </Button>
              </CardContent>
            </Card>

            {/* إعدادات البريد الإلكتروني */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  البريد الإلكتروني
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="smtp-host">خادم SMTP</Label>
                  <Input
                    id="smtp-host"
                    placeholder="smtp.gmail.com"
                    value={settings.smtpHost}
                    onChange={(e) =>
                      setSettings({ ...settings, smtpHost: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-port">المنفذ</Label>
                  <Input
                    id="smtp-port"
                    placeholder="587"
                    value={settings.smtpPort}
                    onChange={(e) =>
                      setSettings({ ...settings, smtpPort: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="smtp-user">البريد الإلكتروني</Label>
                  <Input
                    id="smtp-user"
                    type="email"
                    placeholder="noreply@addwall.com"
                    value={settings.smtpUser}
                    onChange={(e) =>
                      setSettings({ ...settings, smtpUser: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* إعدادات الأمان */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  الأمان
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>المصادقة الثنائية</Label>
                  <Switch
                    checked={settings.enable2FA}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, enable2FA: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تسجيل العمليات</Label>
                  <Switch
                    checked={settings.enableLogging}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, enableLogging: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>حماية من البريد المزعج</Label>
                  <Switch
                    checked={settings.enableSpamProtection}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        enableSpamProtection: checked,
                      })
                    }
                  />
                </div>
                <Separator />
                <Button variant="destructive" className="w-full">
                  مسح جميع الجلسات النشطة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminRoute>
      <AdminSettingsContent />
    </AdminRoute>
  );
}
