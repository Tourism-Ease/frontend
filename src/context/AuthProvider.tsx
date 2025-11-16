
import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext, type User, type UpdatedUser } from "./AuthContext";
import { authAPI } from "../features/user/auth/api/auth.api";

type Props = { children: React.ReactNode };

export default function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [updatedUser, setUpdatedUser] = useState<UpdatedUser | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const queryClient = useQueryClient();

  // Fetch current user using HTTP-only token
  const { 
    data: currentUser, 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<User | null> => {
      try {
        const userData = await authAPI.me();
        return userData;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // console.error("Failed to fetch current user:", err);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Sync user state with query data
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    } else {
      setUser(null);
    }
  }, [currentUser]);

  const login = useCallback((loggedUser: User) => {
    setUser(loggedUser);
    setUpdatedUser(null);
    queryClient.setQueryData(['currentUser'], loggedUser);
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setUpdatedUser(null);
      setResetEmail(null);
      setIsCodeVerified(false);
      queryClient.setQueryData(['currentUser'], null);
      queryClient.removeQueries({ queryKey: ['currentUser'] });
    }
  }, [queryClient]);

  const updateUser = useCallback((updated: UpdatedUser) => {
    setUser((prev) => prev ? { ...prev, ...updated } : null);
    setUpdatedUser(updated);
  }, []);

  const handleSetUser = useCallback((newUser: User | null) => {
    setUser(newUser);
    if (!newUser) {
      setUpdatedUser(null);
    }
  }, []);

  const handleSetUpdatedUser = useCallback((updated: UpdatedUser | null) => {
    setUpdatedUser(updated);
  }, []);

  // Check auth status on mount
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        updatedUser,
        setUpdatedUser: handleSetUpdatedUser,
        setUser: handleSetUser,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
        resetEmail,
        setResetEmail,
        isCodeVerified,
        setIsCodeVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
