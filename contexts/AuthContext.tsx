"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  email: string;
  fullName: string;
  profilePicture: string | null;
  isSeller: boolean;
  isVerified: boolean;
  major: string | null;
  batch: string | null;
  nim: string | null;
  phoneNumber: string | null;
  bio: string | null;
  avgRating: number;
  totalReviews: number;
  totalOrdersCompleted: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  activateSellerMode: (phoneNumber: string, bio: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Validate API_URL is set
if (!API_URL && typeof window !== "undefined") {
  console.error("NEXT_PUBLIC_API_URL is not set! Please check your environment variables.");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Fetch user profile
  const fetchUserProfile = useCallback(async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const result = await response.json();
      setUser(result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      localStorage.removeItem("access_token");
      setUser(null);
      return null;
    }
  }, []);

  // Refresh user data
  const refreshUser = async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      await fetchUserProfile(token);
    }
  };

  // Check authentication on mount and when storage changes
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (token) {
          await fetchUserProfile(token);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for storage changes (e.g., when token is set after OAuth redirect)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token") {
        if (e.newValue) {
          fetchUserProfile(e.newValue);
        } else {
          setUser(null);
        }
      }
    };

    // Listen for custom event when token is set in same window
    const handleTokenSet = () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        // Add a small delay to ensure localStorage is updated
        setTimeout(() => {
          fetchUserProfile(token);
        }, 50);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("tokenSet", handleTokenSet);

    // Also check token when component becomes visible (handles redirect case)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const token = localStorage.getItem("access_token");
        if (token) {
          fetchUserProfile(token);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("tokenSet", handleTokenSet);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchUserProfile]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      fetchUserProfile(token);
    }
  }, [pathname, user, fetchUserProfile]);

  // Login with Google
  const login = () => {
    if (!API_URL) {
      console.error("API_URL is not configured. Cannot redirect to Google OAuth.");
      alert("Configuration error: API URL is not set. Please contact support.");
      return;
    }
    window.location.href = `${API_URL}/auth/google`;
  };

  // Activate seller mode
  const activateSellerMode = async (phoneNumber: string, bio: string) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_URL}/users/activate-seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          bio,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to activate seller mode");
      }

      // Update user state with new data
      setUser(result.data);

      // Redirect to seller dashboard
      router.push("/seller/dashboard");
    } catch (error) {
      console.error("Activate seller error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      setUser(null);
      router.push("/");
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    activateSellerMode,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
