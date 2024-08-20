import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/providers/theme-provider";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthGuard from "./guard/authGuard";
import Protected from "./pages/protected";
import Home from "./pages/home";
import Login from "./pages/login";
import IdPage from "./pages/IdPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <AuthGuard children={<Protected />} />,
    children: [
      {
        path: "/",
        element: <AuthGuard children={<Home />} />,
      },
      {
        path: "/idPage/:id",
        element: <AuthGuard children={<IdPage />} />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster/>
    </ThemeProvider>
  </React.StrictMode>
);
