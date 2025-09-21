import { UltraHeader } from "@/components/layout/header"
import { AboutUsSection } from "@/components/home/about-us"
import { Footer } from "@/components/layout/footer"
import { Breadcrumb } from "@/components/common/breadcrumb"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <UltraHeader />
      <main className="pt-24">
        <div className="container-premium py-8">
          <Breadcrumb
            items={[
              { label: "الرئيسية", href: "/" },
              { label: "من نحن", href: "/about" },
            ]}
          />
        </div>
        <AboutUsSection />
      </main>
      <Footer />
    </div>
  )
}
