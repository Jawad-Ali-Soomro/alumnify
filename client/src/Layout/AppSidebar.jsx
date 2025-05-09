import { Calendar } from "lucide-react";
import { Network } from "lucide-react";
import { Newspaper } from "lucide-react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Users } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { List } from "lucide-react";
import { Bug } from "lucide-react";
import { GiConfirmed } from "react-icons/gi";
import { LogOut } from "lucide-react";
import { Settings } from "lucide-react";
import { Home } from "lucide-react";
import { Plus } from "lucide-react";
import { Menu } from "lucide-react";

const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`md:hidden fixed top-4 z-30 p-2 rounded-lg bg-white cursor-pointer transition-all duration-300 ease-in-out
          ${isOpen ? 'left-[70px]' : 'left-4'}`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={`fixed h-[100vh] z-20 bg-white border  top-0 left-0 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        px-2 flex flex-col justify-start pt-[2vh] align-center pt-2 gap-2`}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(tab.path);
              setIsOpen(false);
            }}
            className={`w-[70px] h-[48px] flex rounded-lg justify-center items-center cursor-pointer  ${
              activeTab === tab.path
                ? "text-white bg-black"
                : "text-gray-500 hover:bg-gray-200 hover:text-gray-900"
            }`}
          >
            <tab.icon className="w-5 h-5" style={{
              scale: activeTab === tab.path ? "1.2" : "1",
              transition:'300ms'
            }} />
          </div>
        ))}
        <div className="flex w-[70px] absolute bottom-16 h-[48px] rounded-lg justify-center items-center cursor-pointer bg-gray-200 text-black">
          <Settings size={18} />
        </div>
        <div onClick={() => window.localStorage.clear() + navigate('/') + window.location.reload()} className="flex w-[70px] absolute bottom-2 h-[48px] rounded-lg justify-center items-center cursor-pointer bg-red-500 text-white">
          <LogOut size={18} />
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
