/**
 * Application Entry Point
 * Main React application setup with StrictMode
 * Initializes the root React component
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Create root React element and render the application
// StrictMode helps identify potential problems during development
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
