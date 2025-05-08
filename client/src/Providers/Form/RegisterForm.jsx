import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "../../components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { RiGithubLine } from "react-icons/ri";
import { FaXTwitter } from "react-icons/fa6";
import Register from "../Auth/Register";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  const onSubmit = (data) => {
    console.log(data);
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
            placeholder="Username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-600 py-2 uppercase text-[10px]">
              {errors.username.message}
            </p>
          )}
        </div>
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
        <div>
          <Input
            className={"h-10 w-90"}
            placeholder="Confirm Password"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 py-2 uppercase text-[10px]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button
          className="bg-[#086498] h-10 hover:bg-[#086490] w-90 py-2 rounded-lg text-white uppercase font-semibold text-[14px] cursor-pointer"
          type="submit"
        >
          Register
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
              window.location.href = "/";
            }}
            className={
              "bg-[#333] hover:bg-[#222] w-50 py-2 rounded-lg text-white h-10 uppercase font-semibold text-[14px] cursor-pointer"
            }
          >
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
