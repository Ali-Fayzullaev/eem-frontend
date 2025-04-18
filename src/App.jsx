//App.jsx

import "./App.css";
import Login from "./components/Login";
import Home from "./pages/Home";
import MyEvents from "./pages/MyEvents";
import CreateEvent from "./pages/CreateEvent";
import Signup from "./pages/Signup";
import SubscribersList from "./pages/SubscribersList";
import RootLayout from "./Layout/RootLayout";
import DataChanges from "./components/DataChanges";
import EventDetail from "./components/EventDetail";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminDashboard from "./Layout/AdminLayout";
import HomeAdmin from "./pages/HomeAdmin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: ":id", element: <EventDetail /> },
      
      // Защищенные маршруты
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        ),
      },
      {
        path: "myEvents",
        element: (
          <ProtectedRoute>
            <MyEvents />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
  // Отдельные админ-страницы без сайдбара
  {
    path: "admin/change/:idEvent",
    element: (
      <ProtectedRoute adminOnly={true}>
        <DataChanges fullPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "admin/list/:userList",
    element: (
      <ProtectedRoute adminOnly={true}>
        <SubscribersList fullPage />
      </ProtectedRoute>
    ),
  }
], {
  basename: import.meta.env.BASE_URL,
});

function App() {
  return <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />;
}

export default App;