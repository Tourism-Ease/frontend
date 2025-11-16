import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api";
import type { VerifyResetCodeRequest } from "../types";

export function useVerifyResetCode(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: (payload: VerifyResetCodeRequest) => authAPI.verifyResetCode(payload),
    onSuccess: () => {
      toast.success("Code verified");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Invalid reset code";
      toast.error(message);
    },
  });
}