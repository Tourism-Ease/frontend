import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api";
import type { ResetPasswordRequest } from "../types";
import { useAuth } from "../../../../hooks/useAuth";

export function useResetPassword(onSuccessCallback?: () => void) {
  const { login } = useAuth();

  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => authAPI.resetPassword(payload),
    onSuccess: (user) => {
      login(user);
      toast.success("Password reset and signed in");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to reset password";
      toast.error(message);
    },
  });
}
