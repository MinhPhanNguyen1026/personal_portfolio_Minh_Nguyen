import React from "react";
import ReactDOM from "react-dom/client";

import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./styles/tokens.css";
import "./styles/base.css";

import App from "./App";

// Enables the print-on-scroll styling only where it can complete.
if (typeof IntersectionObserver !== "undefined") {
  document.documentElement.classList.add("js");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
