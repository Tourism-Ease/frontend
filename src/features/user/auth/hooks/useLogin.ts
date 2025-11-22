import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api";
import { loginSchema, type LoginForm } from "../schemas/auth.schema";
import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import type { User } from "@/context/AuthContext";

export function useLogin(onSuccess?: () => void) {
  const { login: loginContext } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginForm) => {
      // First, perform the login
      const user = await authAPI.login(values);
      
      // Then, wait a brief moment to ensure cookies/session are set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Finally, get the fresh user data to ensure all data is loaded
      const freshUser = await authAPI.me();
      return freshUser;
    },
    onSuccess: async (user: User) => {
      // Update context with complete user data
      loginContext(user);
      
      // Show success message
      toast.success(`Welcome${user.firstName ? `, ${user.firstName}` : ''}!`);
      
      // Wait a bit more to ensure everything is settled
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Handle redirection based on user role
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
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
      form.setValue('password', '');
    },
  });

  const onSubmit = useCallback(
    (values: LoginForm) => {
      loginMutation.mutate(values);
    },
    [loginMutation]
  );

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isPending,
    isSuccess: loginMutation.isSuccess,
    error: loginMutation.error,
  };
}
