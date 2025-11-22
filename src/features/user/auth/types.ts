import type { User } from '../../../context/AuthContext';

/**
 * ---------------------------
 * 🔹 REQUEST PAYLOADS
 * ---------------------------
 */

//  Login
export type LoginRequest = {
  email: string;
  password: string;
};

//  Register (Signup)
export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

//  Verify Email
export type VerifyEmailRequest = {
  email: string;
  verifyCode: string;
};

//  Forgot Password
export type ForgotPasswordRequest = {
  email: string;
};

//  Verify Reset Code
export type VerifyResetCodeRequest = {
  email: string;
  resetCode: string;
};

//  Reset Password
export type ResetPasswordRequest = {
  email: string;
  newPassword: string;
};

/**
 * ---------------------------
 *  RESPONSE TYPES
 * ---------------------------
 */

//  Backend response format
export type ApiSuccess<T = unknown> = {
  status: string;
  message?: string;
  data?: T;
};

//  Auth response with user data
export type AuthResponse = ApiSuccess<User>;


export interface ReactivatePayload {
  email: string;
  password: string;
}

export type ReactivationState = {
  isOpen: boolean;
  userEmail: string;
};
