// src/features/user/auth/hooks/useResetPassword.ts
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api";
import type { ResetPasswordRequest } from "../types";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import type { User } from "@/context/AuthContext";

export function useResetPassword(onSuccess?: (user: User) => void) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (payload: ResetPasswordRequest) => authAPI.resetPassword(payload),
    onSuccess: (user) => {
      login(user);
      
      // Redirect based on role after password reset
      setTimeout(() => {
        switch (user.role) {
          case 'admin':
            navigate('/admin', { replace: true });
            break;
          case 'employee':
            navigate('/', { replace: true });
            break;
          case 'user':
          default:
            navigate('/', { replace: true });
            break;
        }
      }, 500);
      
      if (onSuccess) onSuccess(user);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to reset password";
      toast.error(message);
    },
  });

  return mutation;
}