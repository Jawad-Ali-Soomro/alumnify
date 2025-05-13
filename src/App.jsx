/* eslint-disable no-unused-vars */
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register } from "./Providers";
import { Dashboard, Protected } from "./Layout";
import AddPost from "./Layout/Dashboards/AddPost";
import Profile from "./Pages/Profile";
import Users from "./Pages/Users";
import UserProfile from "./Pages/User.Profile";
import { CreateEventForm } from "./Providers/Form/EventRegistration";
import Events from "./Pages/Events";
import UserEvents from "./Pages/UserEvents";
import Jobs from "./Pages/Jobs";
import AddJob from "./Layout/Add.Job";
import UserJobs from "./Pages/User.Jobs";
import Network from "./Pages/Network";
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
    {
      path: "/add/post",
      element: token ? (
        <Protected>
          <AddPost />
        </Protected>
      ) : (
        <Register />
      ),
    },
    {
      path: "/profile",
      element: token ? (
        <Protected>
          <Profile />
        </Protected>
      ) : (
        <Login />
      ),
    },
    {
      path: "/admin/users",
      element: token ? (
        <Protected>
          <Users />
        </Protected>
      ) : (
        <Login />
      ),
    },
    {
      path: "/user/:userId",
      element: token ? (
        <Protected>
          <UserProfile />
        </Protected>
      ) : (
        <Login />
      ),
    },
    {
      path: "/admin/create/event",
      element: token ? (
        <Protected>
          <CreateEventForm />
        </Protected>
      ) : (
        <Login />
      ),
    },
    {
      path: "/admin/events",
      element: token ? (
        <Protected>
          <Events />
        </Protected>
      ) : (
        <Login />
      ),
    },
    {
      path: "/events",
      element: token ? (
        <Protected>
          <UserEvents />
        </Protected>
      ) : (
        <Login />
      ),
    },
    {
      path: "/admin/jobs",
      element: token ? (
        <Protected>
          <Jobs />
        </Protected>
      ) : (
        <Login />
      ),
    },
    {
      path: "/admin/create/job",
      element: token ? (
        <Protected>
          <AddJob />
        </Protected>
      ) : (
        <Login />
      ),
    },
     {
      path: "/jobs",
      element: token ? (
        <Protected>
          <UserJobs />
        </Protected>
      ) : (
        <Login />
      ),
    },
    {
      path: "/network",
      element: token ? (
        <Protected>
          <Network />
        </Protected>
      ) : (
        <Login />
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
