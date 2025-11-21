// src/features/user/auth/components/AuthModal.tsx
import { useState } from "react";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import loginCover from "../../../../assets/images/login-cover.jpg";
import registerCover from "../../../../assets/images/register-cover.jpg";
import { useAuthModal } from "../hooks/useAuthModal";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Spinner } from "../../../../components/ui/Spinner";
import GoogleLoginButton from "./GoogleLoginButton";

interface AuthModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AuthModal({ isOpen, setIsOpen }: AuthModalProps) {
  const {
    currentView,
    loginHook,
    registerHook,
    isLoading,
    email,
    resetCode,
    newPassword,
    confirmPassword,
    setEmail,
    setResetCode,
    setNewPassword,
    setConfirmPassword,
    handleForgotPassword,
    handleVerifyCode,
    handlePasswordReset,
    handleEmailVerification,
    goToLogin,
    goToRegister,
    goToForgotPassword,
    closeModal,
  } = useAuthModal({
    defaultView: "login",
    onClose: () => setIsOpen(false),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState("");

  const isLogin = currentView === "login";
  const isRegister =
    currentView === "register" && !registerHook.needsEmailVerification;
  const isVerifyEmail =
    currentView === "register" && registerHook.needsEmailVerification;
  const isForgot = currentView === "forgot-password";
  const isVerifyReset = currentView === "verify-reset-code";
  const isReset = currentView === "reset-password";

  function handleClose() {
    setIsOpen(false);
    closeModal();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className={`w-full max-w-4xl h-auto max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-xl flex flex-col md:flex-row ${
            isForgot || isVerifyReset || isReset || isVerifyEmail
              ? "max-w-md mx-auto"
              : ""
          }`}
        >
          {(isLogin || isRegister) && (
            <motion.div
              key={isLogin ? "left-login" : "left-register"}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              className="hidden md:flex w-1/2 bg-cover bg-center rounded-l-2xl"
              style={{
                backgroundImage: `url(${isLogin ? loginCover : registerCover})`,
              }}
            />
          )}

          <div
            className={`w-full ${
              isLogin || isRegister ? "md:w-1/2" : "md:w-full"
            } p-6 md:p-12 flex flex-col justify-center relative`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="absolute top-4 right-4"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </Button>

            <AnimatePresence mode="wait">
              {/* LOGIN */}
              {isLogin && (
                <motion.div
                  key="login"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Welcome Back</h2>
                  <p className="text-sm text-muted-foreground">
                    Sign in to your account
                  </p>

                  <form
                    onSubmit={loginHook.form.handleSubmit(loginHook.onSubmit)}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="Email"
                        {...loginHook.form.register("email")}
                        disabled={isLoading}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...loginHook.form.register("password")}
                        disabled={isLoading}
                        className="pl-10 pr-10"
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? <Spinner size="sm" /> : "Sign In"}
                    </Button>
                  </form>

                  <div className="text-center space-y-2">
                    <Button
                      variant="link"
                      onClick={goToRegister}
                      className="text-sm"
                    >
                      Don't have an account? Register
                    </Button>
                    <Button
                      variant="link"
                      onClick={goToForgotPassword}
                      className="text-sm"
                    >
                      Forgot password?
                    </Button>
                  </div>

                  <div className="text-center">
                    <GoogleLoginButton />
                  </div>
                </motion.div>
              )}

              {/* REGISTER */}
              {isRegister && (
                <motion.div
                  key="register"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Create Account</h2>
                  <form
                    onSubmit={registerHook.form.handleSubmit(
                      registerHook.onSubmit
                    )}
                    className="space-y-4"
                  >
                    <Input
                      placeholder="First Name"
                      {...registerHook.form.register("firstName")}
                      disabled={isLoading}
                    />
                    <Input
                      placeholder="Last Name"
                      {...registerHook.form.register("lastName")}
                      disabled={isLoading}
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      {...registerHook.form.register("email")}
                      disabled={isLoading}
                    />
                    <Input
                      type="password"
                      placeholder="Password"
                      {...registerHook.form.register("password")}
                      disabled={isLoading}
                    />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...registerHook.form.register("confirmPassword")}
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? <Spinner size="sm" /> : "Create Account"}
                    </Button>
                  </form>

                  <div className="text-center space-y-2">
                    <Button
                      variant="link"
                      onClick={goToLogin}
                      className="text-sm"
                    >
                      Already have an account? Sign in
                    </Button>
                  </div>

                  <div className="text-center">
                    <GoogleLoginButton />
                  </div>
                </motion.div>
              )}

              {/* VERIFY EMAIL (after register) */}
              {isVerifyEmail && (
                <motion.div
                  key="verify-email"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Verify Your Email</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code we sent to{" "}
                    {registerHook.registeredEmail}
                  </p>

                  <Input
                    placeholder="6-digit code"
                    value={emailVerificationCode}
                    onChange={(e) =>
                      setEmailVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    maxLength={6}
                    disabled={isLoading}
                  />
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleEmailVerification(emailVerificationCode)
                    }
                    disabled={isLoading || emailVerificationCode.length !== 6}
                  >
                    {isLoading ? <Spinner size="sm" /> : "Verify Email"}
                  </Button>

                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={() => {
                        registerHook.resetVerification();
                        goToRegister();
                      }}
                      className="text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
              {/* FORGOT / VERIFY RESET / RESET */}
              {isForgot && (
                <motion.div
                  key="forgot-password"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Forgot Password</h2>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    className="w-full"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>
                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={goToLogin}
                      className="text-sm"
                    >
                      Back to login
                    </Button>
                  </div>
                </motion.div>
              )}

              {isVerifyReset && (
                <motion.div
                  key="verify-reset"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Verify Code</h2>
                  <Input
                    placeholder="6-digit code"
                    value={resetCode}
                    onChange={(e) =>
                      setResetCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    disabled={isLoading}
                  />
                  <Button
                    className="w-full"
                    onClick={handleVerifyCode}
                    disabled={isLoading || resetCode.length !== 6}
                  >
                    {isLoading ? <Spinner size="sm" /> : "Verify Code"}
                  </Button>
                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={goToForgotPassword}
                      className="text-sm"
                    >
                      Back
                    </Button>
                  </div>
                </motion.div>
              )}

              {isReset && (
                <motion.div
                  key="reset-password"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold">Reset Password</h2>
                  <Input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button
                    className="w-full"
                    onClick={handlePasswordReset}
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner size="sm" /> : "Reset Password"}
                  </Button>
                  <div className="text-center">
                    <Button
                      variant="link"
                      onClick={goToLogin}
                      className="text-sm"
                    >
                      Back to login
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
