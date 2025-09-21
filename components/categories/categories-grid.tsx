"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/lang-provider";
import { useMemo, useState, useEffect } from "react";
import { getMultipleCategoriesCount } from "@/lib/companies-api";
import { ArrowRight, Eye, Loader2 } from "@/components/ui/icon";
import { toast } from "sonner";
import type { Category } from "@/types/types";

export function CategoriesGrid() {
  const { locale, t } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);
  const [companiesCount, setCompaniesCount] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // دالة جلب التصنيفات مع عدد الشركات
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching categories from API for grid...");
      const response = await fetch("https://adwallpro.com/api/v1/categories");

      console.log("Grid Response status:", response.status);
      console.log("Grid Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Grid Raw API response:", data);

      // التعامل مع هيكل الاستجابة المختلف
      let categoriesData: Category[] = [];

      if (data.data && Array.isArray(data.data)) {
        categoriesData = data.data;
        console.log("Grid Using data.data:", categoriesData);
      } else if (Array.isArray(data)) {
        categoriesData = data;
        console.log("Grid Using direct data:", categoriesData);
      } else {
        console.error("Grid Unexpected response structure:", data);
        throw new Error("استجابة غير صحيحة من الخادم");
      }

      setCategories(categoriesData);

      // جلب عدد الشركات لكل تصنيف
      const categorySlugs = categoriesData.map((cat) => cat.slug);
      const counts = await getMultipleCategoriesCount(categorySlugs);
      setCompaniesCount(counts);
      console.log("Grid Categories loaded successfully:", categoriesData);
      console.log("Grid Companies counts:", counts);
    } catch (error) {
      console.error("Grid Error fetching categories:", error);
      setError(error instanceof Error ? error.message : "فشل في جلب التصنيفات");
      toast.error("فشل في جلب التصنيفات");
    } finally {
      setLoading(false);
    }
  };

  // جلب التصنيفات من الـ API
  useEffect(() => {
    fetchCategories();
  }, []);

  // عرض حالة التحميل
  if (loading) {
    return (
      <section className="py-16 md:py-20">
        <div className="container-premium">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">جاري تحميل التصنيفات...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // عرض حالة الخطأ
  if (error) {
    return (
      <section className="py-16 md:py-20">
        <div className="container-premium">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="rounded-full bg-red-50 p-4 mb-4 mx-auto w-fit">
                <Eye className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">خطأ في التحميل</h3>
              <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
              <Button onClick={fetchCategories} className="rounded-xl">
                إعادة المحاولة
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container-premium">
        <div className="mb-12 text-center">
          <h2 className="text-ultra-lg font-black mb-6 text-balance">
            استكشف <span className="gradient-text">التصنيفات</span>
          </h2>
          <p className="text-ultra-base text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed mb-8">
            اكتشف آلاف الشركات المصنفة حسب المجال والتخصص في منصة AdWell العصرية
          </p>

          <Button
            asChild
            variant="outline"
            className="rounded-2xl border-2 hover:bg-primary-50 bg-transparent"
          >
            <Link href="/categories">
              <Eye className="h-5 w-5 mr-2" />
              عرض جميع التصنيفات
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="ultra-grid">
          {categories.slice(0, 8).map((c) => {
            const name = locale === "ar" ? c.nameAr : c.nameEn;
            const adsCount = companiesCount[c.slug] || 0;

            console.log(
              "Grid rendering category:",
              c.slug,
              "name:",
              name,
              "adsCount:",
              adsCount
            );

            return (
              <Link
                key={c.slug}
                href={`/companies/category/${c._id}`}
                className="group block"
              >
                <Card className="ultra-card overflow-hidden border-0">
                  <div
                    className="h-[3px] w-full"
                    style={{
                      background: `linear-gradient(90deg, ${c.color} 0%, ${c.color}80 100%)`,
                    }}
                    aria-hidden
                  />
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={c.image || "/placeholder.svg"}
                        alt={name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
                      <div className="absolute bottom-3 inset-x-3 flex items-center justify-between rounded-lg bg-white/70 px-3 py-2 text-foreground shadow-sm backdrop-blur-sm">
                        <h3 className="font-semibold text-center">{name}</h3>
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-8 rounded-full"
                            style={{ backgroundColor: c.color }}
                            aria-hidden
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
