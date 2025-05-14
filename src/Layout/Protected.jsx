import React, { useEffect, useRef, useState } from "react";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Verified } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Protected = ({ children }) => {
  const token = window.localStorage.getItem("token");
  const userInfo = window.localStorage.getItem("user");
  const user = JSON.parse(userInfo);
  const [showInfo, setShowInfo] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [pin, setPin] = useState("");
  const infoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (infoRef.current && !infoRef.current.contains(event.target)) {
        setShowInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!token) {
    window.location.href = "/";
    return null;
  }

  const renderPinPrompt = () => (
    <div className="flex flex-col items-center justify-center min-h-screen w-full gap-6">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm">
        <h2 className="text-l font-semibold text-black text-center mb-4 uppercase ">Enter Admin PIN</h2>
        <InputOTP
          maxLength={6}
          value={pin}
          onChange={setPin}
        >
          <InputOTPGroup className={"ml-5"}>
            {[0, 1, 2].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="rounded-lg border-gray-300 focus:ring-2 text-black ring-blue-500 w-[40px] h-[40px]"
                style={{
                  borderRadius: '10px'
                }}
              />
            ))}
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            {[3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                 className="rounded-lg border-gray-300 focus:ring-2 ring-blue-500 text-black w-[40px] h-[40px]"
                style={{
                  borderRadius: '10px'
                }}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <button
          onClick={() => {
            if (pin === "529232") {
              setPinVerified(true);
            } else {
              alert("Incorrect PIN");
            }
          }}
          className="mt-6 w-full bg-black uppercase text-[15px] hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition"
        >
          Submit
        </button>
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar />

      {/* Top Bar */}
      <div className="flex h-20 fixed top-0 left-0 right-0 border-b z-10 bg-white dark:bg-background/90 backdrop-blur-sm justify-end items-center px-4">
        <div className="relative" ref={infoRef}>
          <div
            className="relative cursor-pointer"
            onClick={() => setShowInfo(!showInfo)}
          >
            <img
              src={user?.avatar || "/avatar.avif"}
              alt="avatar"
              className="w-[50px] h-[50px] rounded-full border object-cover"
            />
            {user?.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                <Verified className="text-green-500 w-4 h-4" />
              </span>
            )}
          </div>

          {/* Info Dropdown */}
          {showInfo && (
            <div className="absolute top-14 right-0 w-64 bg-background border rounded-lg shadow-md p-4 z-50">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={user?.avatar || "/avatar.avif"}
                  className="w-12 h-12 rounded-full border object-cover"
                  alt="avatar"
                />
                <div>
                  <h2 className="text-sm font-semibold ">{user?.username}</h2>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded-lg uppercase transition"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    window.localStorage.removeItem("token");
                    window.localStorage.removeItem("user");
                    window.location.href = "/";
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg uppercase transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="px-4 w-full">
        {user?.role === "admin" ? (pinVerified ? children : renderPinPrompt()) : children}
      </main>
    </SidebarProvider>
  );
};

export default Protected;
