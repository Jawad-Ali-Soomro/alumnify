/* eslint-disable no-unused-vars */
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register } from "./Providers";
import { Dashboard, Protected } from "./Layout";
import UserDashboard from "./Layout/Dashboards/User.Dashboard";
import AddPost from "./Layout/Dashboards/AddPost";
import PostDetails from "./Layout/Dashboards/PostDetails";
import { Toaster } from "sonner";

function App() {
  const token = window.localStorage.getItem("token");

  const commonRoutes = [
    {
      path: "/",
      element: token ? (
        <Protected>
          <UserDashboard />
        </Protected>
      ) : (
        <Login />
      ),
    },
    {
      path: "/register",
      element: token ? (
        <Protected>
          <Dashboard />
        </Protected>
      ) : (
        <Register />
      ),
    },
    {
      path: "/add/post",
      element: token ? (
        <Protected>
          <AddPost />
        </Protected>
      ) : (
        <Login />
      ),
    },
  ];

  return (
    <BrowserRouter>
        <Routes>
          {commonRoutes.map((route, index) => {
            return (
              <Route key={index} path={route.path} element={route.element} />
            );
          })}
          <Route path="/post/:id" element={<PostDetails />} />
        </Routes>
        <Toaster />
    </BrowserRouter>
  );
}

export default App;
