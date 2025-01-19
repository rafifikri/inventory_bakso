import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TokenProvider } from "@/utils/context/tokenContext";
import { ToastProvider } from "./utils/toastify/toastProvider";
import Router from "@/routes/router";
import "@/styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TokenProvider>
      <ToastProvider>
        <Router />
      </ToastProvider>
    </TokenProvider>
  </StrictMode>
);
