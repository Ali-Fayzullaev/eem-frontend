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
import { ProtectedRoute } from "./components/ProtectedRoute"


// Создаем router вне компонента App для лучшей производительности
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
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
        ) 
      },
      { 
        path: "myEvents", 
        element: (
          <ProtectedRoute>
            <MyEvents />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "my-events/change/:idEvent", 
        element: (
          <ProtectedRoute>
            <DataChanges />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "my-events/list/:userList", 
        element: (
          <ProtectedRoute>
            <SubscribersList />
          </ProtectedRoute>
        ) 
      },
      
    ],
  },
], {
  basename: import.meta.env.BASE_URL // Для корректной работы в поддиректориях
});

function App() {
  return <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />;
}

export default App;