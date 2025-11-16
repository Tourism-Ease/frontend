// src/features/user/auth/hooks/useAuthModal.ts
import { useState, useCallback } from "react";
import { useLogin } from "./useLogin";
import { useRegister } from "./useRegister";
import { useForgotPassword } from "./useForgotPassword";
import { useVerifyResetCode } from "./useVerifyResetCode";
import { useResetPassword } from "./useResetPassword";
import toast from "react-hot-toast";

export type AuthView =
  | "login"
  | "register"
  | "forgot-password"
  | "verify-reset-code"
  | "reset-password";

export function useAuthModal({
  defaultView = "login",
  onClose,
}: { defaultView?: AuthView; onClose?: () => void } = {}) {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Auth hooks - pass local success callbacks so modal can be closed from hooks
  const loginHook = useLogin(() => closeModal());
  const registerHook = useRegister(() => closeModal());
  const forgotPasswordHook = useForgotPassword();
  const verifyResetCodeHook = useVerifyResetCode(() =>
    setCurrentView("reset-password")
  );
  const resetPasswordHook = useResetPassword(() => closeModal());

  const closeModal = useCallback(() => {
    if (onClose) onClose();
    // small delay to let animation run
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
  const goBack = useCallback(() => {
    if (
      currentView === "forgot-password" ||
      currentView === "verify-reset-code" ||
      currentView === "reset-password"
    )
      setCurrentView("login");
    else if (registerHook.needsEmailVerification) setCurrentView("register");
  }, [currentView, registerHook]);

  const handleGoogleSuccess = useCallback(() => {
    closeModal();
    toast.success("Signed in with Google");
  }, [closeModal]);

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
    goBack,
    isLoading:
      loginHook.isLoading ||
      registerHook.isLoading ||
      forgotPasswordHook.isPending ||
      verifyResetCodeHook.isPending ||
      resetPasswordHook.isPending,
    handleGoogleSuccess,
  };
}
