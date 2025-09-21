"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/lang-provider";
import { signOut, getCurrentUser, useAuthStore, type User } from "@/lib/auth";
import { LogIn, LogOut, Shield, UserIcon } from "@/components/ui/icon";

export function SignInDialog() {
  const { t } = useI18n();
  const router = useRouter();
  const { user } = useAuthStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Update current user from store or localStorage
    const userFromAuth = getCurrentUser();
    setCurrentUser(userFromAuth);
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    setCurrentUser(null);
    router.push("/");
    window.location.reload();
  };

  if (currentUser) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-50 dark:bg-primary-950/50">
          {currentUser.role === "admin" ? (
            <Shield className="h-4 w-4 text-primary-600" />
          ) : (
            <UserIcon className="h-4 w-4 text-primary-600" />
          )}
          <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
            {currentUser.name || currentUser.email}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
            {currentUser.role === "admin" ? "أدمن" : "مستخدم"}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          {t("signOut")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button size="sm" className="btn-ultra">
          <LogIn className="h-4 w-4 mr-2" />
          {t("signIn")}
        </Button>
      </Link>
      <Link href="/signup">
        <Button size="sm" variant="outline">
          {t("signUp") || "تسجيل"}
        </Button>
      </Link>
    </div>
  );
}

export function SignInButton() {
  return <SignInDialog />;
}

export { getCurrentUser };
