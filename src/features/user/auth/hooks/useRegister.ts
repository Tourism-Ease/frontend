// src/features/user/auth/hooks/useRegister.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../api/auth.api";
import { registerSchema, type RegisterForm } from "../schemas/auth.schema";
import { useCallback, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { getFriendlyErrorMessage } from "@/lib/errorUtils";

export function useRegister(onSuccessCallback?: () => void) {
  const { login } = useAuth();
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [error, setError] = useState<string>('');

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
      const { confirmPassword, ...apiValues } = values;
      return authAPI.register(apiValues);
    },
    onSuccess: (_response, variables) => {
      setRegisteredEmail(variables.email);
      setNeedsEmailVerification(true);
      setError('');
    },
    onError: (err: unknown) => {
      const friendlyError = getFriendlyErrorMessage(err);
      setError(friendlyError);
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
      setError('');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err: unknown) => {
      const friendlyError = getFriendlyErrorMessage(err);
      setError(friendlyError);
    },
  });

  const onSubmit = useCallback((values: RegisterForm) => {
    setError('');
    registerMutation.mutate(values);
  }, [registerMutation]);

  const onVerifyEmail = useCallback((verifyCode: string) => {
    setError('');
    verifyEmailMutation.mutate({ email: registeredEmail, verifyCode });
  }, [verifyEmailMutation, registeredEmail]);

  const resetVerification = useCallback(() => {
    setNeedsEmailVerification(false);
    setRegisteredEmail("");
    setError('');
    form.reset();
  }, [form]);

  return {
    form,
    onSubmit,
    onVerifyEmail,
    isLoading: registerMutation.isPending || verifyEmailMutation.isPending,
    error,
    needsEmailVerification,
    registeredEmail,
    resetVerification,
    isSuccess: verifyEmailMutation.isSuccess,
    clearError: () => setError(''),
  };
}