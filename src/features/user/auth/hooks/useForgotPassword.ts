// src/features/user/auth/hooks/useForgotPassword.ts
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../api/auth.api";
import type { ForgotPasswordRequest } from "../types";
import { useState } from "react";
import { getFriendlyErrorMessage } from "@/lib/errorUtils";

export function useForgotPassword() {
  const [error, setError] = useState<string>('');

  const mutation = useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => authAPI.forgotPassword(payload),
    onSuccess: () => {
      setError('');
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