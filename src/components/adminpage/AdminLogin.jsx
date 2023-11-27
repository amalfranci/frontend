import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AdminLogin } from "../../redux/adminSlice";

import { useForm } from "react-hook-form"; // Import useForm
import { apiRequest } from "../../utils";

function AdminLoginData() {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);

    try {
      const response = await apiRequest({
        url: "/auth/adminlogin",
        method: "POST",
        data,
      });

      if (response?.token) {
        setErrMsg("");
        dispatch(AdminLogin(response.token));
        window.location.replace("/adminHome");
      } else {
        setErrMsg("Invalid admin credentials");
      }
    } catch (error) {
      console.error(error);
      setErrMsg("An error occurred");
    }

    setIsSubmitting(false);
  });

  return (
    <div className="min-h-screen   flex items-center justify-center border-b bg-[#287ec445]">
      <div className="bg-blue p-8 rounded shadow-md w-full max-w-md ">
        <h2 className="text-2xl font-semibold mb-4 text-center">Admin Login</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2 text-white"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              {...register("username", { required: "Username is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2 text-white"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {errMsg && <p className="text-red-500 text-sm mb-4">{errMsg}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border "
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginData;
