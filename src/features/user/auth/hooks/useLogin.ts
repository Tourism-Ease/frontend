import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api";
import { loginSchema, type LoginForm } from "../schemas/auth.schema";
import { useCallback, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import type { ReactivationState } from "../types";

export function useLogin(onSuccessCallback?: () => void) {
  const { login: loginContext } = useAuth();

  const [reactivationState, setReactivationState] = useState<ReactivationState>({
    isOpen: false,
    userEmail: "",
  });

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginForm) => authAPI.login(values),
    onSuccess: async (user) => {
      // call your context login (which probably stores user + cookie is handled by backend token cookie)
      loginContext(user);
      toast.success(`Welcome${user.firstName ? `, ${user.firstName}` : ""}!`);
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : "Login failed";

      // Detect deactivated account message from backend.
      // Your backend returns a 401 with message 'User account is deactivated, please activate it'
      // We'll check message contents to decide to open reactivation modal.
      const msg = err instanceof Error ? err.message : "";
      if (typeof msg === "string" && /deactivated|activate/i.test(msg)) {
        // open reactivation modal and keep entered email
        setReactivationState({
          isOpen: true,
          userEmail: form.getValues("email"),
        });

        toast.error("Your account is deactivated. Enter your password to reactivate.");
        return;
      }

      toast.error(errorMessage);
      form.setValue("password", "");
    },
  });

  // mutation to call reactivate endpoint
  const reactivateMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.reactivateAccount({ email, password }),
    onSuccess: (res) => {
      // backend returns user + token; after reactivate we consider user logged in
      loginContext(res.user);
      toast.success("Account reactivated and logged in!");
      setReactivationState({ isOpen: false, userEmail: "" });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Failed to reactivate account";
      toast.error(message);
      // keep modal open so user can retry
    },
  });

  const onSubmit = useCallback(
    (values: LoginForm) => {
      loginMutation.mutate(values);
    },
    [loginMutation]
  );

  const handleReactivationConfirm = useCallback(
    (password: string) => {
      if (!reactivationState.userEmail) return;
      reactivateMutation.mutate({ email: reactivationState.userEmail, password });
    },
    [reactivationState.userEmail, reactivateMutation]
  );

  const handleReactivationCancel = useCallback(() => {
    setReactivationState({ isOpen: false, userEmail: "" });
    form.setValue("password", "");
    toast.error("Reactivation cancelled");
  }, [form]);

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending || reactivateMutation.isPending,
    isSuccess: loginMutation.isSuccess,
    error: loginMutation.error,
    reactivationState,
    handleReactivationConfirm,
    handleReactivationCancel,
  };
}
