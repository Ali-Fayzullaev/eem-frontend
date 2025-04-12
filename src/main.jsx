import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import App from "./App.jsx";
import { ThemeProvider } from "./components/ThemeContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <Toaster />
      <App />
  </React.StrictMode>
);
