"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminRoute } from "@/components/auth/route-guard";
import { AdminCategoriesTable } from "@/components/admin/admin-categories-table";
import { CategoryStats } from "@/components/admin/category-stats";
import { Tags, Plus, AlertCircle } from "@/components/ui/icon";
import { CreateCategoryDialog } from "@/components/admin/create-category-dialog";

function AdminCategoriesContent() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Tags className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  إدارة الفئات
                </h1>
                <p className="text-gray-600 mt-2">
                  إدارة فئات الشركات والخدمات في المنصة
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              إضافة فئة جديدة
            </Button>
          </div>

          {/* Quick Stats */}
          <CategoryStats refreshKey={refreshKey} />

          {/* Categories Table */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                قائمة الفئات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminCategoriesTable
                key={refreshKey}
                onRefresh={() => setRefreshKey((prev) => prev + 1)}
              />
            </CardContent>
          </Card>

          {/* Create Category Dialog */}
          <CreateCategoryDialog
            open={showCreateDialog}
            onOpenChange={setShowCreateDialog}
            onSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        </div>
      </main>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <AdminRoute>
      <AdminCategoriesContent />
    </AdminRoute>
  );
}
