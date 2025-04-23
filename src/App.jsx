// // //App.jsx
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
import NotFoundPage from "./pages/NotFoundPage";
import UserDashboard from "./Layout/UserLayout";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: ":id", element: <EventDetail /> },
      { path: "*", element: <NotFoundPage /> },
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
      <ProtectedRoute adminOnly>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "change/:idEvent",
        element: <DataChanges fullPage />,
      },
      {
        path: "list/:userList",
        element: <SubscribersList fullPage />,
      },
    ],
  },
  {
    path: ":id",  // Remove the leading slash
    element: <EventDetail fullPage />,
  },
  {
    path: "user",
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "login",
    element: <Login/>
  },{ 
    path: "signup",
     element: <Signup />
   },
], {
  basename: import.meta.env.BASE_URL,
});

function App() {
  return <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />;
}

export default App;