import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo, Input, Button } from "./index";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

  const registerUser = async (data) => {
    console.log("Register Data", data);
    setError("");
    try {
      const session = await authService.createUser(data);
      if (session) {
        const userData = await authService.getLoggedInUser();
        if (userData) {
          dispatch(login(userData));
          navigate("/");
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign up to create account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(registerUser)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Name : "
              type="text"
              placeHolder="Enter your name"
              {...register("name", {
                required: "Name is required",
              })}
              className=""
            />
            {errors.name && (
              <p className="text-red-600 mt-1 text-center">
                {errors.name.message}
              </p>
            )}
            <Input
              label="Email : "
              type="email"
              placeHolder="Enter your email"
              {...register("password", {
                required: true,
                pattern: {
                  value: emailRegex,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-600 mt-1 text-center">
                {errors.email.message}
              </p>
            )}

            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-600 mt-1 text-center">
                {errors.password.message}
              </p>
            )}

            <Button type="submit" className="w-full">
              Register your account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
