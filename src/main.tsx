import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "main.css";
import { ThemeProvider } from "styled-components";

const theme = {
  default: "#1a1a1a",
  error: "rgb(221, 52, 6)",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
