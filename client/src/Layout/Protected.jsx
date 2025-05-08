import React from "react";
import AppSidebar from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Protected = ({ children }) => {
  const token = window.localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-2">
        <SidebarTrigger className={"cursor-pointer"} />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Protected;
