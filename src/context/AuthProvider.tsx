import { useState, useEffect, type ReactNode } from "react";
import { AuthContext, type User, type AuthState } from "./AuthContext";
import { authAPI } from "@/features/user/auth/api/auth.api";
import { profileAPI } from "@/features/user/profile/api/profile.api";
import toast from "react-hot-toast";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  // Modal state - fixed the type
  const [authModal, setAuthModal] = useState<AuthState["authModal"]>({
    isOpen: false,
    view: "login",
    redirectPath: null,
  });

  const isAuthenticated = !!user;
  const isAccountActive = user?.active !== false;

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const userData = await authAPI.me();
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
    
    // Auto-close modal on successful login
    closeAuthModal();
    
    // Show welcome message
    toast.success(`Welcome${userData.firstName ? `, ${userData.firstName}` : ''}!`);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    } finally {
      setUser(null);
      setUpdatedUser(null);
      setResetEmail("");
      setIsCodeVerified(false);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUserData = { ...user, ...userData };
      setUser(updatedUserData);
      setUpdatedUser(updatedUserData);
    }
  };

  // Modal handlers - fixed the type
  const openAuthModal = (
    view: AuthState["authModal"]["view"] = "login",
    redirectPath: string | null = null
  ) => {
    setAuthModal({
      isOpen: true,
      view,
      redirectPath,
    });
  };

  const closeAuthModal = () => {
    setAuthModal({
      isOpen: false,
      view: "login",
      redirectPath: null,
    });
  };

  // Account deactivation
  const deactivateAccount = async () => {
    try {
      await profileAPI.deactivateAccount();
      setUser((prev) => prev ? { ...prev, active: false } : null);
      toast.success("Account deactivated successfully");
      closeAuthModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to deactivate account";
      toast.error(message);
      throw error;
    }
  };

  // Account reactivation
  const reactivateAccount = async (email: string, password: string) => {
    try {
      const userData = await authAPI.reactivateAccount(email, password);
      setUser(userData);
      toast.success("Account reactivated successfully");
      closeAuthModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reactivate account";
      toast.error(message);
      throw error;
    }
  };

  const value: AuthState = {
    user,
    isAuthenticated: isAuthenticated && isAccountActive,
    isLoading,
    login,
    logout,
    updateUser,
    setUser,
    updatedUser,
    setUpdatedUser,
    resetEmail,
    setResetEmail,
    isCodeVerified,
    setIsCodeVerified,
    authModal,
    openAuthModal,
    closeAuthModal,
    deactivateAccount,
    reactivateAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}