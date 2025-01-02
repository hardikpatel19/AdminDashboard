import React, {  useState } from "react";
import { useForm } from "react-hook-form";
import {  login } from "../../apiCall";

import { useNavigate } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
// import { useQuery } from "@tanstack/react-query";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { toast } from "react-toastify";
const SignIn = () => {
  const [, dispatch] = useStateValue();
  const navigate = useNavigate();

  // ***************************************************** fetch company info end *****************************************************

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    dispatch({ type: "SET_LOADING", status: true });
    const re = await login(data);
    console.log(re);
    if (re?.status === 201) {
      
      localStorage.setItem("token", re?.data?.result?.tokens);
      localStorage.setItem("islogin","true")
      toast.success(re?.data?.message);
      navigate("/");
    } else {
      toast.error(re?.response?.data?.message);
    }
    dispatch({ type: "SET_LOADING", status: false });
  };
  const [isPassVisible, setIsPassVisible] = useState(false);

  return (
    <div className="container d-flex flex-column">
      <div
        className="row align-items-center justify-content-center g-0
        min-vh-100"
      >
        <div className="col-12 col-md-8 col-lg-6 col-xxl-4 py-8 py-xl-0">
          {/* Card */}
          <div className="card smooth-shadow-md">
            {/* Card body */}
            <div className="card-body p-6 justify-content-center">
              <div className=" d-flex justify-content-center">
                <h1>Admin Dashboard</h1>
              </div>
              <div className="mb-4 d-flex justify-content-center">
                <div className="ju">
                  {/* {loginPageDetail?.company_info?.data?.logo ? (
                    <img
                      src={loginPageDetail?.company_info?.data?.logo}
                      className="mb-2 text-inverse"
                      style={{ height: "50px" }}
                      alt="Image"
                    />
                  ) : (
                    <img
                      src="../assets/images/brand/logo/logo-2.svg"
                      className="mb-2 text-inverse"
                      style={{ height: "50px" }}
                      alt="Image"
                    />
                  )} */}
                </div>
              </div>
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Username */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    required=""
                    {...register("email", {
                      required: "email is required",
                    })}
                  />
                  {errors.email && (
                    <div className="error">{errors.email.message}</div>
                  )}
                </div>
                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="pass-input position-relative">
                    <input
                      type={`${isPassVisible ? "text" : "password"}`}
                      className="form-control"
                      placeholder="Password"
                      {...register("password", {
                        required: "Password is required",
                      })}
                    />
                    <div
                      className="input-group-append position-absolute"
                      onClick={() => setIsPassVisible(!isPassVisible)}
                      style={{
                        cursor: "pointer",
                        paddingLeft: "10px",
                        transform: "translateY(-50%)",
                        top: "50%",
                        right: "10px",
                      }}
                    >
                      {isPassVisible ? (
                        <IoMdEyeOff size={20} />
                      ) : (
                        <IoMdEye size={20} />
                      )}
                    </div>
                  </div>
                  {errors.password && (
                    <div className="error">{errors.password.message}</div>
                  )}
                </div>
                {/* Checkbox */}
                <div
                  className="d-lg-flex justify-content-between align-items-center
                  mb-4"
                ></div>
                <div>
                  {/* Button */}
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
