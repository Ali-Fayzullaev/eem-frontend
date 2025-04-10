// import "./App.css";
// //import from pages
// import Login from "./components/Login";
// import Home from "./pages/Home";
// import MyEvents from "./pages/MyEvents";
// import CreateEvent from "./pages/CreateEvent";
// import Signup from "./pages/Signup";
// import SubscribersList from "./pages/SubscribersList";
// // import from Layout
// import RootLayout from "./Layout/RootLayout";

// //  import  components
// import DataChanges from "./components/DataChanges";
// import EventDetail from "./components/eventDetail";


// import { ProtectedRoute } from "./api/ProtectedRoute";
// import { Dashboard } from "./api/Dashboard";




// import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";

// function App() {
//   const router = createBrowserRouter([
//     {
//       path: "",
//       element: <RootLayout />,
//       children: [
//         { index: true, element: <Home /> },
//         { path: "login", element: <Login /> },
//         { path: "create", element: <CreateEvent /> },
//         { path: ":id", element: <EventDetail /> },
//         { path: "myEvents", element: <MyEvents /> },
//         { path: "myEvents/change/:idEvent", element: <DataChanges /> },
//         { path: "login/signup", element: <Signup /> },
//         { path: "myEvents/list/:userList", element: <SubscribersList /> },
//       ],
//     },
//   ]);

//   return (
//     <>
//       <RouterProvider router={router}></RouterProvider>
//     </>
//   );
// }

// export default App;


import "./App.css";
import Login from "./components/Login";
import Home from "./pages/Home";
import MyEvents from "./pages/MyEvents";
import CreateEvent from "./pages/CreateEvent";
import Signup from "./pages/Signup";
import SubscribersList from "./pages/SubscribersList";
import RootLayout from "./Layout/RootLayout";
import DataChanges from "./components/DataChanges";
import EventDetail from "./components/eventDetail";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute"; 

function App() {
  const router = createBrowserRouter([
    {
      path: "",
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
          path: "myEvents/change/:idEvent", 
          element: (
            <ProtectedRoute>
              <DataChanges />
            </ProtectedRoute>
          ) 
        },
        { 
          path: "myEvents/list/:userList", 
          element: (
            <ProtectedRoute>
              <SubscribersList />
            </ProtectedRoute>
          ) 
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;