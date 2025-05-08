/* eslint-disable no-unused-vars */
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./Providers";

function App() {
  const commonRoutes = [
    {
      path: "/",
      element: <Login />,
    },
  ];
  return (
    <>
      <BrowserRouter>
        <Routes>
          {commonRoutes.map((route, index) => {
            return <Route key={index} path={route.path} element={route.element} />;
          })}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
