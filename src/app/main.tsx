// main.tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";

import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { queryClient } from "./queryClient.ts";
import { AuthProvider } from "@/context/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
