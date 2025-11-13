import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { authAPI } from "../api/auth.api";
import { registerSchema, type RegisterForm } from "../schemas/auth.schema";
import { useNavigate } from "react-router";
import { useAuth } from "../../../../hooks/useAuth";

export function useRegister() {
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (values: RegisterForm) => authAPI.register(values),
    onSuccess: async (user) => {
      loginContext(user);
      toast.success(`Welcome, ${user.firstName}!`);
      navigate("/");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    },
  });

  const onSubmit = (values: RegisterForm) => registerMutation.mutate(values);

  return {
    form,
    onSubmit,
    isLoading: registerMutation.isPending,
  };
}
