// src/context/AuthModalContext.tsx
import { createContext, useContext, useState,type ReactNode } from "react";

interface AuthModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModalContext = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModalContext must be used within AuthModalProvider");
  return ctx;
};
