// src/features/user/auth/hooks/useAuthModal.ts
import { useState, useCallback } from "react";
import { useLogin } from "./useLogin";
import { useRegister } from "./useRegister";
import { useForgotPassword } from "./useForgotPassword";
import { useVerifyResetCode } from "./useVerifyResetCode";
import { useResetPassword } from "./useResetPassword";
import toast from "react-hot-toast";
import type { User } from "@/context/AuthContext";

export type AuthView =
  | "login"
  | "register"
  | "forgot-password"
  | "verify-reset-code"
  | "reset-password";

interface UseAuthModalProps {
  defaultView?: AuthView;
  onClose?: () => void;
}

export function useAuthModal({
  defaultView = "login",
  onClose,
}: UseAuthModalProps = {}) {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Success callback that closes the modal
  const handleSuccess = useCallback((user: User) => {
    toast.success(`Welcome${user.firstName ? `, ${user.firstName}` : ""}!`);
    closeModal();
  }, []);

  // Auth hooks with success callback
  const loginHook = useLogin(handleSuccess);
  const registerHook = useRegister(handleSuccess);
  const forgotPasswordHook = useForgotPassword();
  const verifyResetCodeHook = useVerifyResetCode(() =>
    setCurrentView("reset-password")
  );
  const resetPasswordHook = useResetPassword(handleSuccess);

  const closeModal = useCallback(() => {
    if (onClose) onClose();
    setTimeout(() => {
      setCurrentView(defaultView);
      setEmail("");
      setResetCode("");
      setNewPassword("");
      setConfirmPassword("");
    }, 200);
  }, [defaultView, onClose]);

  const handleForgotPassword = useCallback(() => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    forgotPasswordHook.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success("Reset code sent to your email");
          setCurrentView("verify-reset-code");
        },
        onError: (err: any) => {
          const message =
            err instanceof Error ? err.message : "Failed to send reset code";
          toast.error(message);
        },
      }
    );
  }, [email, forgotPasswordHook]);

  const handleVerifyCode = useCallback(() => {
    if (!resetCode || resetCode.length !== 6)
      return toast.error("Enter a valid 6-digit code");
    verifyResetCodeHook.mutate({ email, resetCode });
  }, [resetCode, email, verifyResetCodeHook]);

  const handlePasswordReset = useCallback(() => {
    if (!newPassword || !confirmPassword) return toast.error("Fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords don't match");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    resetPasswordHook.mutate({ email, newPassword });
  }, [newPassword, confirmPassword, email, resetPasswordHook]);

  const handleEmailVerification = useCallback(
    (verifyCode: string) => {
      if (verifyCode.length !== 6)
        return toast.error("Enter a valid 6-digit code");
      registerHook.onVerifyEmail(verifyCode);
    },
    [registerHook]
  );

  const goToLogin = useCallback(() => setCurrentView("login"), []);
  const goToRegister = useCallback(() => setCurrentView("register"), []);
  const goToForgotPassword = useCallback(
    () => setCurrentView("forgot-password"),
    []
  );

  return {
    currentView,
    email,
    resetCode,
    newPassword,
    confirmPassword,
    setEmail,
    setResetCode,
    setNewPassword,
    setConfirmPassword,
    loginHook,
    registerHook,
    forgotPasswordHook,
    verifyResetCodeHook,
    resetPasswordHook,
    closeModal,
    handleForgotPassword,
    handleVerifyCode,
    handlePasswordReset,
    handleEmailVerification,
    goToLogin,
    goToRegister,
    goToForgotPassword,
    isLoading:
      loginHook.isLoading ||
      registerHook.isLoading ||
      forgotPasswordHook.isPending ||
      verifyResetCodeHook.isPending ||
      resetPasswordHook.isPending,
  };
}