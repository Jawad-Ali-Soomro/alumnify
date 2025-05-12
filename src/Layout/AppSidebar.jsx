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
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userType = window.localStorage.getItem("role");
  const navigate = useNavigate();
  const activeTab = window.location.pathname;
  const { theme, setTheme } = useTheme();

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
        className={`md:hidden fixed top-4 z-30 p-2 rounded-lg bg-background border cursor-pointer transition-all duration-300 ease-in-out
          ${isOpen ? 'left-[90px]' : 'left-4'}`}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div className={`fixed h-[100vh] z-20 bg-background border top-0 left-0 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        px-2 flex flex-col justify-start pt-[2vh] align-center pt-2 gap-2`}
        style={{
          borderRadius: 0
        }}
        >
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(tab.path);
              setIsOpen(false);
            }}
            className={`w-[70px] h-[48px] flex rounded-lg justify-center items-center cursor-pointer  ${
              activeTab === tab.path
                ? "text-primary-foreground bg-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <tab.icon className="w-5 h-5 icon" style={{
              scale: activeTab === tab.path ? "1" : "1",
              transition:'300ms'
            }} />
          </div>
        ))}

        {/* Theme Toggle Button */}
        <div className="flex w-[70px] absolute bottom-30 h-[48px] rounded-lg justify-center items-center cursor-pointer bg-accent hover:bg-accent/80 text-accent-foreground">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full h-full flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Settings Button */}
        <div className="flex w-[70px] absolute bottom-16 h-[48px] rounded-lg justify-center items-center cursor-pointer bg-accent hover:bg-accent/80 text-accent-foreground">
          <Settings size={18} />
        </div>

        {/* Logout Button */}
        <div 
          onClick={() => window.localStorage.clear() + navigate('/') + window.location.reload()} 
          className="flex w-[70px] absolute bottom-2 h-[48px] rounded-lg justify-center items-center cursor-pointer bg-destructive text-white"
        >
          <LogOut size={18} />
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
