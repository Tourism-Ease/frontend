// src/features/user/auth/hooks/useAuthModal.ts
import { useState, useCallback } from 'react';
import { useLogin } from './useLogin';
import { useRegister } from './useRegister';
import { useForgotPassword } from './useForgotPassword';
import { useVerifyResetCode } from './useVerifyResetCode';
import { useResetPassword } from './useResetPassword';

export type AuthView =
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'verify-reset-code'
  | 'reset-password';

export function useAuthModal({
  defaultView = 'login',
  onClose,
}: { defaultView?: AuthView; onClose?: () => void } = {}) {
  const [currentView, setCurrentView] = useState<AuthView>(defaultView);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Hooks
  const loginHook = useLogin(() => closeModal());
  const registerHook = useRegister(() => closeModal());
  const forgotPasswordHook = useForgotPassword();
  const verifyResetCodeHook = useVerifyResetCode(() =>
    setCurrentView('reset-password')
  );
  const resetPasswordHook = useResetPassword(() => closeModal());

  const clearErrors = () => {
    setErrors({});
    loginHook.clearError();
    registerHook.clearError();
    forgotPasswordHook.clearError();
    verifyResetCodeHook.clearError();
    resetPasswordHook.clearError();
  };

  const closeModal = useCallback(() => {
    if (onClose) onClose();
    setTimeout(() => {
      setCurrentView(defaultView);
      setEmail('');
      setResetCode('');
      setNewPassword('');
      setConfirmPassword('');
      clearErrors();
    }, 200);
  }, [defaultView, onClose]);

  const handleForgotPassword = useCallback(() => {
    clearErrors();
    
    if (!email) {
      setErrors({ email: 'Please enter your email' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    forgotPasswordHook.mutate(
      { email },
      {
        onSuccess: () => {
          setCurrentView('verify-reset-code');
        },
        onError: () => {
          // Error is handled in the hook
        },
      }
    );
  }, [email, forgotPasswordHook]);

  const handleVerifyCode = useCallback(() => {
    clearErrors();
    
    if (!resetCode || resetCode.length !== 6) {
      setErrors({ resetCode: 'Enter a valid 6-digit code' });
      return;
    }

    verifyResetCodeHook.mutate({ email, resetCode });
  }, [resetCode, email, verifyResetCodeHook]);

  const handlePasswordReset = useCallback(() => {
    clearErrors();
    
    if (!newPassword || !confirmPassword) {
      setErrors({ general: 'Please fill all fields' });
      return;
    }

    if (newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    resetPasswordHook.mutate({ email, newPassword });
  }, [newPassword, confirmPassword, email, resetPasswordHook]);

  const handleEmailVerification = useCallback(
    (verifyCode: string) => {
      clearErrors();
      
      if (verifyCode.length !== 6) {
        setErrors({ verifyCode: 'Enter a valid 6-digit code' });
        return;
      }

      registerHook.onVerifyEmail(verifyCode);
    },
    [registerHook]
  );

  const goToLogin = useCallback(() => {
    clearErrors();
    setCurrentView('login');
  }, []);

  const goToRegister = useCallback(() => {
    clearErrors();
    setCurrentView('register');
  }, []);

  const goToForgotPassword = useCallback(() => {
    clearErrors();
    setCurrentView('forgot-password');
  }, []);

  // Get the current error from the active hook
  const getCurrentError = () => {
    switch (currentView) {
      case 'login':
        return loginHook.error;
      case 'register':
        return registerHook.error;
      case 'forgot-password':
        return forgotPasswordHook.error;
      case 'verify-reset-code':
        return verifyResetCodeHook.error;
      case 'reset-password':
        return resetPasswordHook.error;
      default:
        return '';
    }
  };

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
    errors,
    clearErrors,
    closeModal,
    handleForgotPassword,
    handleVerifyCode,
    handlePasswordReset,
    handleEmailVerification,
    goToLogin,
    goToRegister,
    goToForgotPassword,
    currentError: getCurrentError(),
    isLoading:
      loginHook.isLoading ||
      registerHook.isLoading ||
      forgotPasswordHook.isPending ||
      verifyResetCodeHook.isPending ||
      resetPasswordHook.isPending,
  };
}