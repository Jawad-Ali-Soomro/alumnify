import { Login, Register } from "./Auth";
import { Dashboard, Protected } from "../Layout";
import UserDashboard from "../Layout/Dashboards/User.Dashboard";
import AddPost from "../Layout/Dashboards/AddPost";

export const routes = [
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
    path: "/add/post",
    element: token ? (
      <Protected>
        <AddPost />
      </Protected>
    ) : (
      <Login />
    ),
  },
  // ... other routes ...
]; 