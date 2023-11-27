import React from "react";
import { TbSocial } from "react-icons/tb";
import { CustomButton, Loading, TextInput } from "../components";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { BgImage } from "../assets";
import { apiRequest } from "../utils";

function Register() {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest({
        url: "/auth/register",
        data: data,
        method: "POST",
      });

      console.log(res);
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        setTimeout(() => {
          window.location.replace("/login");
        }, 5000);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bgColor w-full h-[100vh] flex items-center justify-center p-6">
      <div className="w-full md:w-2/3 h-fit lg:h-full 2xl:h-5/6 py-8 lg:py-0 flex flex-row-reverse bg-primary rounded-xl overflow-hidden shadow-xl">
        {/* {left} */}

        <div className="w-full lg:w-1/2 h-full p-10 2xl:px-20 flex flex-col justify-center">
          <div className="w-full flex gap-2 items-center mb-6">
            <div className="p-2 bg-[#065ad8] rounded text-white">
              <TbSocial />
            </div>
            <span className="text-2xl text-[#065ad8] font-semibold">
              LookUp
            </span>
          </div>

          <p className="text-ascent-1 text-base font-semibold">
            Create your account
          </p>

          <form
            className="py-6 flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="firstName"
                placeholder="First Name"
                label="First Name"
                type="text"
                register={register("firstName", {
                  required: "First name is required",
                })}
                styles="w-full "
                error={errors.firstName ? errors.firstName.message : ""}
              />
              <TextInput
                name="lastName"
                placeholder="Last Name"
                label="Last Name"
                type="text"
                register={register("lastName", {
                  required: "Last name is required",
                })}
                styles="w-full "
                error={errors.lastName ? errors.lastName.message : ""}
              />
            </div>

            <TextInput
              name="email"
              placeholder="email@example.com"
              label="Email Adress"
              type="email"
              register={register("email", {
                required: "Email Address is required",
              })}
              styles="w-full "
              error={errors.email ? errors.email.message : ""}
            />

            <div className="w-full flex flex-col lg:flex-row gap-1 md:gap-2">
              <TextInput
                name="password"
                placeholder="password"
                label="password"
                type="password"
                register={register("password", {
                  required: "passwword  is required",
                  minLength: {
                    value: 6,
                    message:"Password must be at least 6 characters long",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    message:"Password must contain at least one letter and one number"
                  }
                })}
                styles="w-full "
                error={errors.password ? errors.password.message : ""}
              />
              <TextInput
                placeholder="Confirm Password"
                label="Confirm Password"
                type="password"
                register={register("cPassword", {
                  validate: (value) => {
                    const { password } = getValues();
                    if (password !== value) {
                      return "Password do no match";
                    }
                  },
                })}
                styles="w-full "
                error={
                  errors.cPassword && errors.cPassword.type === "validate"
                    ? errors.cPassword?.message
                    : ""
                }
              />
            </div>

            {errMsg?.message && (
              <span
                className={`text-sm ${
                  errMsg?.status === "failed"
                    ? "text-[#f64949fe]"
                    : "text-[#2ba150fe]"
                } mt-0.5`}
              >
                {errMsg?.message}{" "}
              </span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type="submit"
                containerStyles={`inline-flex justify-center rounded-md 
                        bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                title="Create Account"
              />
            )}
          </form>
          <p className="text-ascent-2 text-sm text-center">
            Already have an account?
            <Link
              to="/login"
              className="text-[#065ad8] font-semibold ml-2 cursor-pointer"
            >
              Login
            </Link>
          </p>
        </div>

        {/* {right} */}
        <div className="hidden w-1/2 h-full lg:flex flex-col items-center justify-center bg-blue">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={BgImage}
              alt="Bg Image"
              className="w-48 2xl:w-64 h-48 2xl:h-64 rounded-full object-cover"
            />
          </div>
          <div className="mt-16 text-center">
            <p className="text-white text-base">
              Connect with friends & have share for fun
            </p>
            <span className="text-sm text-white/80">
              Share memories with friends and the world
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
