import React from "react";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Protected = ({ children }) => {
  const token = window.localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-2 w-[100%] overflow-scroll bg-gray-200">
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Protected;
