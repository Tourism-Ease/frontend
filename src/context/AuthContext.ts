import { createContext } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin' | 'employee';
  avatarUrl?: string;
  isEmailVerified: boolean;
  active: boolean;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setUser: (user: User | null) => void;
  updatedUser: User | null;
  setUpdatedUser: (user: User | null) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  isCodeVerified: boolean;
  setIsCodeVerified: (verified: boolean) => void;
  // Modal authentication
  authModal: {
    isOpen: boolean;
    view: 'login' | 'register' | 'forgot-password' | 'verify-reset-code' | 'reset-password' | 'reactivate-account';
    redirectPath: string | null;
  };
  openAuthModal: (view?: AuthState['authModal']['view'], redirectPath?: string | null) => void;
  closeAuthModal: () => void;
  // Account management
  deactivateAccount: () => Promise<void>;
  reactivateAccount: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);
