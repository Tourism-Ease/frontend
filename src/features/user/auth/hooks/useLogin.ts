import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api";
import { loginSchema, type LoginForm } from "../schemas/auth.schema";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../hooks/useAuth";

export function useLogin() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginForm) => authAPI.login(values),
    onSuccess: async () => {
      const user = await authAPI.me();
      loginContext(user);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate("/");
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Login failed"),
  });

  const onSubmit = (values: LoginForm) => loginMutation.mutate(values);

  return { form, onSubmit, isLoading: loginMutation.isPending };
}
