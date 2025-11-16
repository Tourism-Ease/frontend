// src/features/user/auth/hooks/useRegister.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api";
import { registerSchema, type RegisterForm } from "../schemas/auth.schema";
import { useCallback, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";

export function useRegister(onSuccessCallback?: () => void) {
  const { login } = useAuth();
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const registerMutation = useMutation({
    mutationFn: (values: RegisterForm) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...apiValues } = values;
      return authAPI.register(apiValues);
    },
    onSuccess: (_response, variables) => {
      setRegisteredEmail(variables.email);
      setNeedsEmailVerification(true);
      toast.success("Registration successful — check your email for OTP.");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
      form.setValue("password", "");
      form.setValue("confirmPassword", "");
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: ({ email, verifyCode }: { email: string; verifyCode: string }) =>
      authAPI.verifyEmail(email, verifyCode),
    onSuccess: (user) => {
      login(user);
      setNeedsEmailVerification(false);
      toast.success("Email verified — welcome!");
      if (onSuccessCallback) onSuccessCallback();
      // reload to pickup auth state if needed
      // navigate(0);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Verification failed";
      toast.error(message);
    },
  });

  const onSubmit = useCallback((values: RegisterForm) => {
    registerMutation.mutate(values);
  }, [registerMutation]);

  const onVerifyEmail = useCallback((verifyCode: string) => {
    verifyEmailMutation.mutate({ email: registeredEmail, verifyCode });
  }, [verifyEmailMutation, registeredEmail]);

  const resetVerification = useCallback(() => {
    setNeedsEmailVerification(false);
    setRegisteredEmail("");
    form.reset();
  }, [form]);

  return {
    form,
    onSubmit,
    onVerifyEmail,
    isLoading: registerMutation.isPending || verifyEmailMutation.isPending,
    error: registerMutation.error || verifyEmailMutation.error,
    needsEmailVerification,
    registeredEmail,
    resetVerification,
    isSuccess: verifyEmailMutation.isSuccess,
  };
}
