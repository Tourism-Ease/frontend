// main.tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.tsx";
import "./index.css";
import AuthProvider from "../context/AuthProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import AppThemeProvider from '../theme/ThemeProvider.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* <AppThemeProvider>   */}
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: "8px",
                background: "#333",
                color: "#fff",
              },
              success: {
                iconTheme: {
                  primary: "#4CAF50",
                  secondary: "#fff",
                },
              },
            }}
          />
          <App />
        </GoogleOAuthProvider>

        {/* </AppThemeProvider> */}
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
