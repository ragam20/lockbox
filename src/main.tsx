import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/index";
import { TooltipProvider } from "./components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </HelmetProvider>
  </StrictMode>,
);
