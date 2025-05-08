import { Calendar } from "lucide-react";
import { Network } from "lucide-react";
import { Newspaper } from "lucide-react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Users } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { List } from "lucide-react";
import { Bug } from "lucide-react";
import { GiConfirmed } from "react-icons/gi";
import { LogOut } from "lucide-react";
import { Settings } from "lucide-react";
import { Home } from "lucide-react";
import { Plus } from "lucide-react";
const AppSidebar = () => {
  const userType = window.localStorage.getItem("role");
  const navigate = useNavigate();
  const activeTab = window.location.pathname;
  const NavigationTabs = {
    user: [
      { path: "/", icon: Home },
      { path: "/events", icon: Calendar },
      { path: "/jobs", icon: Newspaper },
      { path: "/network", icon: Network },
      { path: "/profile", icon: User },
      { path: "/add/post", icon: Plus },
    ],

    admin: [
      { path: "/", icon: Home },
      { path: "/admin/users", icon: Users },
      { path: "/admin/events", icon: CalendarCheck },
      { path: "/admin/jobs", icon: List },
      {
        path: "/admin/verify-alumni",
        icon: GiConfirmed,
      },
      { path: "/admin/reports", icon: Bug },
    ],
  };

  const getNavigationTabs = () => {
    if (userType === "admin") {
      return NavigationTabs.admin;
    } else {
      return NavigationTabs.user;
    }
  };

  const tabs = getNavigationTabs();

  return (
    <div className="px-2 flex flex-col justify-start fixed h-[100vh] border align-center pt-2 gap-2">
      {tabs.map((tab, index) => (
        <div
          key={index}
          onClick={() => navigate(tab.path)}
          className={`w-[50px] h-[48px] flex rounded-lg justify-center items-center cursor-pointer  ${
            activeTab === tab.path
              ? "text-white bg-[#086498] hover:bg-[#086490]"
              : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
          }`}
        >
          <tab.icon className="w-5 h-5" />
        </div>
      ))}
      <div className="flex w-[50px] absolute bottom-16 h-[48px] rounded-lg justify-center items-center cursor-pointer bg-gray-200 text-black">
        <Settings size={18} />
      </div>
      <div onClick={() => window.localStorage.clear() + navigate('/') + window.location.reload()} className="flex w-[50px] absolute bottom-2 h-[48px] rounded-lg justify-center items-center cursor-pointer bg-red-500 text-white">
        <LogOut size={18} />
      </div>
    </div>
  );
};

export default AppSidebar;
