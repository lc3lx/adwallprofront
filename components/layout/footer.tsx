"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "@/components/ui/icon";
import { useI18n } from "@/providers/lang-provider";

export function Footer() {
  const { t } = useI18n();

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://facebook.com/adwall",
      color: "text-blue-600",
      bgColor: "bg-blue-600",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/adwall",
      color: "text-pink-600",
      bgColor: "bg-gradient-to-r from-purple-600 to-pink-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/adwall",
      color: "text-blue-400",
      bgColor: "bg-blue-400",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:info@adwall.com",
      color: "text-green-600",
      bgColor: "bg-green-600",
    },
    {
      name: "Phone",
      icon: Phone,
      href: "tel:+1234567890",
      color: "text-orange-600",
      bgColor: "bg-orange-600",
    },
  ];

  return (
    <footer className="mt-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container py-16">
        {/* Social Media Icons with 3D Reflection Effect */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            {t("contactUs")}
          </h3>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <div key={social.name} className="group perspective-1000">
                  <div className="relative transform-gpu transition-all duration-500 group-hover:scale-110">
                    {/* Main Icon */}
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block"
                    >
                      <div
                        className={`
                        w-16 h-16 rounded-2xl ${social.bgColor} 
                        flex items-center justify-center text-white
                        shadow-2xl transform transition-all duration-300
                        group-hover:shadow-3xl group-hover:-translate-y-2
                        group-hover:rotate-3d
                      `}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                    </Link>

                    {/* 3D Reflection */}
                    <div className="absolute top-20 left-0 w-16 h-16 opacity-30 transform scale-y-[-1]">
                      <div
                        className={`
                        w-full h-full rounded-2xl ${social.bgColor}
                        flex items-center justify-center text-white
                        bg-gradient-to-t from-transparent via-current to-current
                        transition-all duration-300 group-hover:opacity-20
                      `}
                      >
                        <Icon className="w-8 h-8 opacity-60" />
                      </div>
                      {/* Fade overlay for reflection */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent rounded-2xl" />
                    </div>
                  </div>

                  {/* Label */}
                  <p className="mt-16 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {social.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border/50">
          <div className="h-1 w-32 rounded-full bg-gradient-to-r from-primary via-secondary to-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <span className="font-bold text-primary">AdWall</span>.{" "}
            {t("allRightsReserved")}
          </p>
          <p className="text-sm text-muted-foreground/70 mt-2">
            {t("modernAdPlatform")}
          </p>
        </div>
      </div>
    </footer>
  );
}
