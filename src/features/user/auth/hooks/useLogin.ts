// src/features/user/auth/hooks/useLogin.ts
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

export function useLogin(onSuccess?: (user: User) => void) {
  const { login: loginContext } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginForm) => authAPI.login(values),
    onSuccess: async (user) => {
      loginContext(user);
      toast.success(`Welcome${user.firstName ? `, ${user.firstName}` : ""}!`);
      
      // Handle redirection based on user role
      setTimeout(() => {
        switch (user.role) {
          case 'admin':
            navigate('/admin', { replace: true });
            toast.success('Redirecting to admin dashboard');
            break;
          case 'employee':
            // Redirect employees to home or employee dashboard
            navigate('/', { replace: true });
            toast.success('Welcome back!');
            break;
          case 'user':
          default:
            navigate('/', { replace: true });
            toast.success('Welcome back!');
            break;
        }
      }, 1000);
      
      if (onSuccess) onSuccess(user);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
      form.setValue("password", "");
    },
  });

  const onSubmit = useCallback((values: LoginForm) => {
    loginMutation.mutate(values);
  }, [loginMutation]);

  return { 
    form, 
    onSubmit, 
    isLoading: loginMutation.isPending, 
    isSuccess: loginMutation.isSuccess,
    error: loginMutation.error 
  };
}