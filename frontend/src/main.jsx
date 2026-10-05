import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <App />

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 2500,
            style: {
              background: "#172033",
              color: "#FFFFFF",
              fontSize: "13px",
              fontWeight: "600",
              borderRadius: "0px",
              padding: "14px 18px",
              border: "1px solid #334155",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.15)",
            },
            success: {
              iconTheme: {
                primary: "#15803D",
                secondary: "#FFFFFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#DC2626",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
