// src/features/user/auth/hooks/useVerifyResetCode.ts
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../api/auth.api";
import type { VerifyResetCodeRequest } from "../types";
import { useState } from "react";
import { getFriendlyErrorMessage } from "@/lib/errorUtils";

export function useVerifyResetCode(onSuccessCallback?: () => void) {
  const [error, setError] = useState<string>('');

  const mutation = useMutation({
    mutationFn: (payload: VerifyResetCodeRequest) => authAPI.verifyResetCode(payload),
    onSuccess: () => {
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