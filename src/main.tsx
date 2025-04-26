import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RouterRoot from "./routes";
import AuthContextProvider from "./context/auth.context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterRoot />
    </AuthContextProvider>
  </StrictMode>
);
