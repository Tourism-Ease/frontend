// src/features/user/auth/hooks/useReactivation.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api";
import { loginSchema, type LoginForm } from "../schemas/auth.schema";
import { useCallback } from "react";
import type { User } from "@/context/AuthContext";

export function useReactivation(onSuccessCallback?: (user: User) => void) {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const reactivationMutation = useMutation({
    mutationFn: (values: LoginForm) => 
      authAPI.reactivateAccount(values.email, values.password),
    onSuccess: async (user) => {
      toast.success("Account reactivated successfully!");
      if (onSuccessCallback) onSuccessCallback(user);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Reactivation failed";
      toast.error(message);
      form.setValue("password", "");
    },
  });

  const onSubmit = useCallback(() => {
    const values = form.getValues();
    if (form.formState.isValid) {
      reactivationMutation.mutate(values);
    } else {
      // Trigger validation to show errors
      form.trigger();
    }
  }, [form, reactivationMutation]);

  return {
    form,
    onSubmit,
    isLoading: reactivationMutation.isPending,
    isSuccess: reactivationMutation.isSuccess,
    error: reactivationMutation.error,
  };
}