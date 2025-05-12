import React, { useEffect, useRef } from "react";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {useNavigate} from 'react-router-dom'

const Protected = ({ children }) => {
  const token = window.localStorage.getItem("token");
  const userInfo = window.localStorage.getItem("user");
  const user = JSON.parse(userInfo);
  const [showInfo, setShowInfo] = React.useState(false);
  const infoRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setShowInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!token) {
    window.location.href = "/";
  }

  const navigate = useNavigate()


  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-20 fixed top-0 border  z-10 w-[100%] justify-end bg-background/100 items-center px-4" style={{
        borderRadius: 0
      }}>
        <div className="flex" ref={infoRef}>
          {user?.avatar ? (
            <img
              src={user.avatar}
              className="w-[50px] image h-[50px] border rounded-full cursor-pointer"
              alt=""
              onClick={() => setShowInfo(!showInfo)}
            />
          ) : (
            <img
              src="/avatar.avif"
              className="w-[50px] h-[50px] border rounded-full cursor-pointer"
              alt=""
              onClick={() => setShowInfo(!showInfo)}
            />
          )}
          {showInfo && (
            <div className="absolute top-18 right-5 bg-background border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-[50px] h-[50px] border rounded-full"
                    alt=""
                  />
                ) : (
                  <img
                    src="/avatar.avif"
                    className="w-[50px] h-[50px] border rounded-full"
                    alt=""
                  />
                )}
                <div>
                  <h2 className="text-sm font-semibold">{user?.username}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="line w-[100%] border mt-4 h-[1px]"></div>
              <button
              onClick={() => navigate('/profile')}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg w-[100%] hover:bg-blue-600 transition duration-200 cursor-pointer uppercase text-sm"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  window.localStorage.removeItem("token");
                  window.localStorage.removeItem("user");
                  window.location.href = "/";
                }}
                className="mt-1 bg-red-500 text-white px-4 py-2 rounded-lg w-[100%] hover:bg-red-600 transition duration-200 cursor-pointer uppercase text-sm"
              >
                Logout
              </button>
             
            </div>
          )}
        </div>
      </div>
      <main className="p-2 w-[100%]">{children}</main>
    </SidebarProvider>
  );
};

export default Protected;
