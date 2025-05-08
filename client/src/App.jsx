/* eslint-disable no-unused-vars */
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register } from "./Providers";
import { Dashboard, Protected } from "./Layout";

function App() {
  const token = window.localStorage.getItem("token");

  const commonRoutes = [
    {
      path: "/",
      element: token ? (
        <Protected>
          <Dashboard />
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
  ];

  return (
    <>
      <BrowserRouter>
        <Routes>
          {commonRoutes.map((route, index) => {
            return (
              <Route key={index} path={route.path} element={route.element} />
            );
          })}
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
