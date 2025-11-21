import type { User } from "../../../../context/AuthContext";
import http from "../../../../lib/axios";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  AuthResponse,
  ApiSuccess,
} from "../types";

http.defaults.withCredentials = true;

function formatError(e: unknown): Error {
  if (typeof e === "object" && e && "response" in e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = e as any;
    const message =
      err.response?.data?.message ??
      err.response?.data?.error ??
      err.response?.data?.msg ??
      err.message ??
      "Something went wrong";
    return new Error(message);
  }
  return new Error("Network error");
}

// ✅ Register
export async function registerApi(
  payload: RegisterRequest
): Promise<ApiSuccess> {
  try {
    const { data } = await http.post<ApiSuccess>("/auth/signup", payload);
    return data;
  } catch (err) {
    throw formatError(err);
  }
}

// ✅ Verify Email
export async function verifyEmailApi(
  email: string,
  verifyCode: string
): Promise<User> {
  try {
    const { data } = await http.post<AuthResponse>("/auth/verify-email", {
      email,
      verifyCode,
    });
    return data.data!;
  } catch (err) {
    throw formatError(err);
  }
}

// ✅ Login
export async function loginApi(credentials: LoginRequest): Promise<User> {
  try {
    const { data } = await http.post<AuthResponse>("/auth/login", credentials);
    return data.data!;
  } catch (err) {
    throw formatError(err);
  }
}

// ✅ Logout
export async function logoutApi(): Promise<void> {
  try {
    await http.post("/auth/logout");
  } catch (err) {
    throw formatError(err);
  }
}

// ✅ Get Current User
export async function meApi(): Promise<User> {
  try {
    const { data } = await http.get<AuthResponse>("/users/profile");
    return data.data!;
  } catch (err) {
    throw formatError(err);
  }
}

// ✅ Forgot password
export async function forgotPasswordApi(
  payload: ForgotPasswordRequest
): Promise<ApiSuccess> {
  try {
    const { data } = await http.post<ApiSuccess>(
      "/auth/forgotPassword",
      payload
    );
    return data;
  } catch (err) {
    throw formatError(err);
  }
}

// ✅ Verify reset code
export async function verifyResetCodeApi(
  payload: VerifyResetCodeRequest
): Promise<ApiSuccess> {
  try {
    const { data } = await http.post<ApiSuccess>(
      "/auth/verifyResetCode",
      payload
    );
    return data;
  } catch (err) {
    throw formatError(err);
  }
}

// ✅ Reset password
export async function resetPasswordApi(
  payload: ResetPasswordRequest
): Promise<User> {
  try {
    const { data } = await http.patch<AuthResponse>(
      "/auth/resetPassword",
      payload
    );
    return data.data!;
  } catch (err) {
    throw formatError(err);
  }
}

export async function reactivateAccountApi(
  email: string,
  password: string
): Promise<User> {
  try {
    const { data } = await http.post<AuthResponse>("/users/activateAccount", {
      email,
      password,
    });
    return data.data!;
  } catch (err) {
    throw formatError(err);
  }
}

export async function googleLogin() {
  try {
    const { data } = await http.get("/auth/google");
    console.log(data);
    return data.data;
  } catch (err) {
    throw formatError(err);
  }
}

// ✅ Check if user is authenticated
export async function checkAuthStatus(): Promise<User | null> {
  try {
    const user = await meApi();
    return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null;
  }
}

// ✅ Handle Google OAuth with credential
export async function googleLoginWithCredential(
  credential: string
): Promise<User> {
  try {
    const { data } = await http.post<AuthResponse>("/auth/google/callback", {
      credential,
    });
    return data.data!;
  } catch (err) {
    throw formatError(err);
  }
}

// ✅ Handle Google OAuth callback - check if user is authenticated
export async function handleGoogleCallback(): Promise<User> {
  try {
    // After Google OAuth redirect, check if user is authenticated
    const user = await meApi();
    return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new Error("Google authentication failed");
  }
}

export const authAPI = {
  register: registerApi,
  verifyEmail: verifyEmailApi,
  login: loginApi,
  googleLogin,
  logout: logoutApi,
  me: meApi,
  forgotPassword: forgotPasswordApi,
  reactivateAccount: reactivateAccountApi,
  verifyResetCode: verifyResetCodeApi,
  resetPassword: resetPasswordApi,
  googleLoginWithCredential,
  checkAuthStatus,
  handleGoogleCallback,
};
