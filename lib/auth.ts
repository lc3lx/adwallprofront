"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  phone?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setUser: (user: User | null) => set({ user }),
      setToken: (token: string | null) => set({ token }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);

// Real authentication functions integrated with backend
export const signIn = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  const response = await fetch("https://adwallpro.com/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // تشخيص الاستجابة
  console.log("Login Response:", data);
  console.log("Response Status:", response.status);

  if (!response.ok) {
    console.error("Login Error:", data);
    throw new Error(data.message || "فشل في تسجيل الدخول");
  }

  // التعامل مع هيكل الاستجابة من الخادم
  let user, token;

  if (data.data) {
    // إذا كانت الاستجابة بصيغة { data: user, token }
    user = data.data;
    token = data.token;
  } else if (data.user) {
    // إذا كانت الاستجابة بصيغة { user: {...}, token: "..." }
    user = data.user;
    token = data.token;
  } else {
    // إذا كانت الاستجابة مباشرة
    user = data;
    token = data.token;
  }

  if (!user || !token) {
    throw new Error("استجابة غير صحيحة من الخادم");
  }

  // تحديث الـ store
  useAuthStore.getState().setUser(user);
  useAuthStore.getState().setToken(token);

  // حفظ في localStorage للاستمرارية
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user_data", JSON.stringify(user));

  console.log("Auth store updated:", {
    user: user,
    token: token ? "present" : "missing",
    role: user.role,
  });

  return { user, token };
};

export const signUp = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string,
  phone?: string
): Promise<{ user: User; token: string }> => {
  const response = await fetch("https://adwallpro.com/api/v1/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password, passwordConfirm, phone }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "فشل في إنشاء الحساب");
  }

  const { user, token } = data;
  useAuthStore.getState().setUser(user);
  useAuthStore.getState().setToken(token);

  // Also save to localStorage for persistence
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user_data", JSON.stringify(user));

  return { user, token };
};

export const signOut = async (): Promise<void> => {
  useAuthStore.getState().logout();
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
};

export const getCurrentUser = (): User | null => {
  // First check Zustand store
  const storeUser = useAuthStore.getState().user;
  if (storeUser) return storeUser;

  // If not in store, check localStorage
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        useAuthStore.getState().setUser(user);
        return user;
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }

  return null;
};

export const getAuthToken = (): string | null => {
  // First check Zustand store
  const storeToken = useAuthStore.getState().token;
  if (storeToken) return storeToken;

  // If not in store, check localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      useAuthStore.getState().setToken(token);
      return token;
    }
  }

  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser() && !!getAuthToken();
};

export const isAdmin = (user?: User | null): boolean => {
  const currentUser = user || getCurrentUser();
  return currentUser?.role === "admin";
};

export const requireAuth = (): User => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
};

export const requireAdmin = (): User => {
  const user = requireAuth();
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
  return user;
};

// Get authorization headers for API requests
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
  };
};

// Initialize auth state from localStorage on app start
export const initializeAuth = () => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user_data");

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        useAuthStore.getState().setToken(token);
        useAuthStore.getState().setUser(user);
      } catch (error) {
        console.error("Error initializing auth from localStorage:", error);
        // Clear corrupted data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      }
    }
  }
};
