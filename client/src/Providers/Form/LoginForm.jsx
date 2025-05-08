import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { RiErrorWarningLine, RiGithubLine } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";
import { toast } from "sonner";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormContext();

  const onSubmit = async (data) => {
    try {
      const api = await axios.post(`http://localhost:8080/api/user/login`, {
        email: data.email,
        password: data.password,
      });
      window.localStorage.setItem("token", api.data.token);
      window.localStorage.setItem("role", api.data.role);
      window.localStorage.setItem("user", JSON.stringify(api.data.user));
      window.location.href = "/"; 
      console.log(api.data);
    } catch (error) {
      return toast(error?.response?.data?.message, {
        action: {
          label: "RESET",
          onClick: () => {
            setValue("email", "");
            setValue("password", "");
          },
        },
        duration: 5000,
        icon: <RiErrorWarningLine />,
        style: {
          backgroundColor: "#f44336",
          color: "#fff",
        },
      });
    
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[100vh] items-center justify-center">
      <form
        className="w-[420px] shadow-lg border border-top rounded-lg px-5 py-10 relative gap-3 flex flex-col items-center align-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <img
          src="/alumnify-logo.png"
          className="w-40 top-[-100px] left-[-100px] p-2"
          alt=""
        />
        <div>
          <Input
            className={"h-10 w-90"}
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-600 py-2 uppercase text-[10px]">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Input
            className={"h-10 w-90"}
            placeholder="Password"
            type="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-600 py-2 uppercase text-[10px]">
              {errors.password.message}
            </p>
          )}
        </div>
        <a
          className="flex w-90 align-end justify-end text-[#1E3A8A]"
          href="/forgot"
        >
          Forgot Password?
        </a>
        <Button
          className="bg-[#086498] h-10 hover:bg-[#086490] w-90 py-2 rounded-lg text-white uppercase font-semibold text-[14px] cursor-pointer"
          type="submit"
        >
          Login
        </Button>
        <div className="w-90 border h-1/8 bg-[#086498]"></div>
        <div className="flex justify-between w-90">
          <div className="w-10 flex justify-center items-center h-10 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 ease-in-out">
            <FcGoogle />
          </div>
          <div className="w-10 flex justify-center items-center h-10 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 ease-in-out">
            <RiGithubLine />
          </div>
          <div className="w-10 flex justify-center items-center h-10 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 ease-in-out">
            <FaXTwitter />
          </div>
          <Button
           onClick={(e) => {
            e.preventDefault();
            window.location.href = "/register";
          }}
            className={
              "bg-[#333] hover:bg-[#222] w-50 py-2 rounded-lg text-white h-10 uppercase font-semibold text-[14px] cursor-pointer"
            }
          >
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
