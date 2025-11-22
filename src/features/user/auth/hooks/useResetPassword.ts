// src/features/user/auth/hooks/useResetPassword.ts
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../api/auth.api";
import type { ResetPasswordRequest } from "../types";
import { useAuth } from "../../../../hooks/useAuth";
import { useState } from "react";
import { getFriendlyErrorMessage } from "@/lib/errorUtils";

export function useResetPassword(onSuccessCallback?: () => void) {
  const { login } = useAuth();
  const [error, setError] = useState<string>('');

  const mutation = useMutation({
    mutationFn: (payload: ResetPasswordRequest) => authAPI.resetPassword(payload),
    onSuccess: (user) => {
      login(user);
      setError('');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: unknown) => {
      const friendlyError = getFriendlyErrorMessage(err);
      setError(friendlyError);
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error,
    clearError: () => setError(''),
  };
}