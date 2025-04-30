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
import HomeAdmin from "./pages/HomeAdmin";
import SettingsUser from "./pages/SettingsUser";
import ChangesDataAdmin from "./pages/ChangesDataAdmin";
import MyFavourite from "../src/pages/MyFavourite";
import MyCalendar from "./pages/MyCalendar";
import MyMap from "./pages/MyMap";
import Statistics from "./pages/Statistics";

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
    errorElement: <NotFoundPage />,
     path: "*", element: <NotFoundPage /> ,
  },

  {
    path: "admin",
    element: (
      <ProtectedRoute adminOnly>
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Statistics/>},
      { path: "events", element: <HomeAdmin /> }, // Default route for /admin
      { path: "users", element: <SettingsUser /> },
      { path: "create", element: <CreateEvent /> },
      { path: "changes", element: <ChangesDataAdmin /> },
      { path: "change/:idEvent", element: <DataChanges fullPage /> },
      { path: "list/:userList", element: <SubscribersList fullPage /> },
      { path: ":id", element: <EventDetail fullPage /> }, // Event detail inside admin
      { path: "subscribed", element:  <MyEvents/>},
      { path: "favourite", element: <MyFavourite/>},
      { path: "calendar", element: <MyCalendar/>},
      { path: "map", element: <MyMap/>},
      
    ],
  },

  {
    path:"/event/:id", element:<EventDetail fullPage />
  },
  {
    path: "user",
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Statistics/>},
      { path: "events", element: <HomeAdmin /> }, // Default route for /admin
      { path: "subscribed", element:  <MyEvents/>},
      { path: "favourite", element: <MyFavourite/>},
      { path: "calendar", element: <MyCalendar/>},
      { path: "map", element: <MyMap/>},
      { path: ":id", element: <EventDetail/>},

    ]
  },
  {
    path: "login",
    element: <Login/>
  },
  { 
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