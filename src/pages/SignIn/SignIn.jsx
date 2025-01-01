import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { checkSysConfig, getLoginPageDetail, login } from "../../apiCall";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { useQuery } from "@tanstack/react-query";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
const SignIn = () => {
  const [, dispatch] = useStateValue();
  const navigate = useNavigate();

  // ***************************************************** fetch company info start *****************************************************
  const fetchData = async () => {
    // Perform the API call to fetch company info
    try {
      const response = await getLoginPageDetail();
      if (response?.status === 200) {
        setLoginPageDetail(response.data);
        if (response?.data?.company_info?.status === "error") {
          toast.error(response?.data?.company_info?.message);
        }
      } else if (response?.response) {
        toast.error(response?.response?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error); // Log any errors that occur
      throw error;
    }
  };

  const { data } = useQuery({
    queryKey: ["staff-list"],
    queryFn: () => fetchData(),
  });

  // ***************************************************** fetch company info end *****************************************************

  const [loginPageDetail, setLoginPageDetail] = useState(
    data?.status === 200 ? data?.data : {}
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    dispatch({ type: "SET_LOADING", status: true });

    const re = await login(data);
    console.log(re);
    if (re?.status === 200) {
      localStorage.setItem("token", re?.data?.session_data?.access_token);
      dispatch({
        type: "SET_USER_INFO",
        data: {
          user_loginid: re?.data?.session_data?.user_loginid,
          user_name: re?.data?.session_data?.user_name,
          user_type: re?.data?.session_data?.user_type,
          user_profile_img: re?.data?.session_data?.user_profile_img,
          user_gender: re?.data?.session_data?.user_gender,
          user_code: re?.data?.session_data?.user_code,
        },
      });
      if (re?.data?.session_data?.access_token) {

        try {
          const checkSysConfigRe = await checkSysConfig();
          if (checkSysConfigRe?.status === 200) {
            dispatch({ type: "SET_SYS_CONFIG", data: checkSysConfigRe?.data });

            if (re?.data?.session_data?.reset_password_token) {
              navigate(
                `/change-password?resetToken=${re?.data?.session_data?.reset_password_token}&LoginId=${data?.LoginId}`
              );
            } else {
              toast.success("Login Successful.");

              dispatch({ type: "SET_LOGIN_STATUS", status: true });
              navigate("/");
            }
          } else if (checkSysConfigRe?.response) {
            toast.error(checkSysConfigRe.response.data.message);
          }
        } catch { }
      }
    } else if (re?.response) {
      if (re?.response?.data?.company_info?.message) {
        toast.error(re?.response?.data?.company_info?.message);
      } else {
        toast.error(re?.response?.data?.message);
      }
    }
    dispatch({ type: "SET_LOADING", status: false });
  };
  const [isPassVisible, setIsPassVisible] = useState(false)

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
                    Login Id
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Login id"
                    required=""
                    {...register("LoginId", {
                      required: "Login id is required",
                    })}
                  />
                  {errors.LoginId && (
                    <div className="error">{errors.LoginId.message}</div>
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
                      {...register("Pswd", { required: "Password is required" })}
                    />
                    <div
                      className="input-group-append position-absolute"
                      onClick={() => setIsPassVisible(!isPassVisible)}
                      style={{ cursor: "pointer", paddingLeft: "10px", transform: "translateY(-50%)", top: "50%",right:"10px" }}
                    >
                      {isPassVisible ? (
                        <IoMdEyeOff size={20} />
                      ) : (
                        <IoMdEye size={20} />
                      )}
                    </div>
                  </div>
                  {errors.Pswd && (
                    <div className="error">{errors.Pswd.message}</div>
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
                  {loginPageDetail?.system_admin?.status === "error" && (
                    <h4 className="mt-3 text-center text-danger ">
                      {loginPageDetail?.system_admin?.message}{" "}
                    </h4>
                  )}
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
