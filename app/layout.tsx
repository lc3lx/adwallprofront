import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Inter, Poppins, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-outfit",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "AdWell - جدار الإعلانات العصري",
    template: "%s | AdWell",
  },
  description: "منصة عصرية لعرض إعلانات الشركات مع تصميم متطور وخيارات VIP",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} ${outfit.variable} ${plusJakartaSans.variable}`}
    >
      <body className={`${outfit.className} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
