import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Calendar } from "lucide-react";
import { Network } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { Newspaper } from "lucide-react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { Users } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { List } from "lucide-react";
import { Bug } from "lucide-react";
import { GiConfirmed } from "react-icons/gi";
import { Settings } from "lucide-react";
import { LogOut } from "lucide-react";

const AppSidebar = () => {
  const navigate = useNavigate();
  const activeTab = window.location.pathname;
  const userType = window.localStorage.getItem("role");
  const NavigationTabs = {
    user: [
      { label: "Welcome Back!", path: "/", icon: LayoutDashboard },
      { label: "Ongoing Events", path: "/events", icon: Calendar },
      { label: "Explore Jobs", path: "/jobs", icon: Newspaper },
      { label: "Alumnae Network", path: "/network", icon: Network },
      { label: "Manage Profile", path: "/profile", icon: User },
    ],

    admin: [
      { label: "Welcome Admin!", path: "/", icon: LayoutDashboard },
      { label: "Manage Users", path: "/admin/users", icon: Users },
      { label: "Approve Events", path: "/admin/events", icon: CalendarCheck },
      { label: "Listing of Jobs", path: "/admin/jobs", icon: List },
      {
        label: "Verify Alumni",
        path: "/admin/verify-alumni",
        icon: GiConfirmed,
      },
      { label: "Report Problem", path: "/admin/reports", icon: Bug },
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
  console.log(tabs);

  return (
    <Sidebar className={"p-2"}>
      <SidebarHeader className={"flex justify-center items-center mt-2"}>
        <img src="/alumnify-logo.png" className={"w-30"} alt="" />
      </SidebarHeader>
      <SidebarMenu className={"mt-5"}>
        {tabs?.map((tab, index) => {
          return (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                onClick={() => navigate(tab.path)}
                className={`cursor-pointer h-11 hover:bg-gray-200 hover:text-gray-700 pl-3 text-sm text-gray-500 ${
                  activeTab === tab.path
                    ? "bg-gradient-to-r from-[#086498] via-[#0a7bb3] to-[#0c90ca] text-white hover:from-[#086498] hover:via-[#0a7bb3] hover:to-[#0a7bb3] hover:text-white"
                    : "text-gray-500"
                }`}
              >
                <tab.icon />
                <p className="mt-[2px]">{tab.label}</p>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
      <SidebarFooter className={"absolute bottom-0 right-[-70px]"}>
        <SidebarMenuButton className={"w-[50px] h-[50px] flex justify-center text-black border border-gray-200 hover:bg-gray-100 hover:text-black cursor-pointer bg-gray-100"}>
          <Settings />
        </SidebarMenuButton>
        <SidebarMenuButton className={"w-[50px] h-[50px] flex justify-center text-black border border-gray-200 hover:bg-gray-100 hover:text-black cursor-pointer bg-gray-100"}>
          <LogOut />
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
