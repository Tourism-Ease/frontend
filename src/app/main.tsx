import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";

import App from "./App.tsx";
import "./index.css";
import AuthProvider from "../context/AuthProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthModalProvider } from "../context/AuthModalContext.tsx";
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
        <AuthModalProvider>
          {/* <AppThemeProvider>   */}
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <App />
            <Toaster
              position="bottom-right"
              richColors
              toastOptions={{
                success: { className: "bg-green-500 text-white" },
                error: { className: "bg-red-500 text-white" },
                info: { className: "bg-yellow-500 text-black" },
              }}
            />
          </GoogleOAuthProvider>
        </AuthModalProvider>
        {/* </AppThemeProvider> */}
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
