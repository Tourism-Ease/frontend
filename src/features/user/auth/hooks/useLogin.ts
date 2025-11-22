// src/features/user/auth/hooks/useLogin.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../api/auth.api";
import { loginSchema, type LoginForm } from "../schemas/auth.schema";
import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import type { User } from "@/context/AuthContext";
import { getFriendlyErrorMessage } from "@/lib/errorUtils";

export function useLogin(onSuccess?: () => void) {
  const { login: loginContext } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginForm) => {
      const user = await authAPI.login(values);
      await new Promise(resolve => setTimeout(resolve, 100));
      const freshUser = await authAPI.me();
      return freshUser;
    },
    onSuccess: async (user: User) => {
      loginContext(user);
      setError('');
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      switch (user.role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'employee':
          navigate('/', { replace: true });
          break;
        case 'user':
        default:
          navigate('/', { replace: true });
          break;
      }
      
      if (onSuccess) onSuccess();
    },
    onError: (err: unknown) => {
      const friendlyError = getFriendlyErrorMessage(err);
      setError(friendlyError);
      form.setValue('password', '');
    },
  });

  const onSubmit = useCallback(
    (values: LoginForm) => {
      setError('');
      loginMutation.mutate(values);
    },
    [loginMutation]
  );

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending,
    isSuccess: loginMutation.isSuccess,
    error,
    clearError: () => setError(''),
  };
}