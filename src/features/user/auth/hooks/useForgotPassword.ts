import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api";
import type { ForgotPasswordRequest } from "../types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => authAPI.forgotPassword(payload),
    onSuccess: () => {
      toast.success("Reset code sent to your email");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to send reset code";
      toast.error(message);
    },
  });
}