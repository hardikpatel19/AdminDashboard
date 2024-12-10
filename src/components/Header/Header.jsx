import React, { useState,useRef } from "react";
import "./Header.scss";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import { useStateValue } from "../../StateProvider";
import { MdLogout } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";

const Header = ({ toggle }) => {
  const searchInput = useRef(null);
  const [{ userInfo }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    dispatch({ type: "SET_USER_INFO", data: {} });
    dispatch({ type: "SET_LOGIN_STATUS", status: false });
    navigate("/sign-in");
  };
  return (
    <div className="header">
      {/* navbar */}
      <div className="navbar-custom navbar navbar-expand-lg">
        <div className="container-fluid px-0">
          <div className="d-flex justify-content-center align-items-center">
               
            <div
              id="nav-toggle"
              className="ms-auto ms-md-0 me-0 me-lg-3 "
              style={{ cursor: "pointer" }}
              onClick={toggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={28}
                height={28}
                fill="currentColor"
                className="bi bi-text-indent-left text-muted"
                viewBox="0 0 16 16"
              >
                <path d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm.646 2.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L4.293 8 2.646 6.354a.5.5 0 0 1 0-.708zM7 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
              </svg>
            </div>
          </div>
          <div className="d-none d-md-none d-lg-block w-15">
                        <input
                          ref={searchInput}
                          type="search"
                          className="form-control "
                          // value={searchQuery}
                          onChange={(e) => {
                          }}
                          placeholder="Search "
                        /></div>
          {/*Navbar nav */}
          <ul className="navbar-nav navbar-right-wrap ms-lg-auto d-flex nav-top-wrap align-items-center ms-4 ms-lg-0">
            <li className="dropdown stopevent ms-2">
            <div className="btn btn-ghost btn-icon rounded-circle notification-icon">
                <IoMdNotificationsOutline size={28} />
                {/* <div className="notification-count">24</div> */}
              </div>
              <div className="btn btn-ghost btn-icon rounded-circle notification-icon">
                <IoMdNotificationsOutline size={28} />
                {/* <div className="notification-count">24</div> */}
              </div>
              {/* <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-end"
                aria-labelledby="dropdownNotification"
              >
                <div>
                  <div
                    className="border-bottom px-3 pt-2 pb-3 d-flex
        justify-content-between align-items-center"
                  >
                    <p className="mb-0 text-dark fw-medium fs-4">
                      Notifications
                    </p>
                    <div className="text-muted">
                      <span>
                        <i className="me-1 icon-xs" data-feather="settings" />
                      </span>
                    </div>
                  </div>
                  <div data-simplebar="" style={{ height: 250 }}>
                    List group
                  </div>
                  <div className="border-top px-3 py-2 text-center">
                    <a href="#!" className="text-inherit ">
                      View all Notifications
                    </a>
                  </div>
                </div>
              </div> */}
            </li>
            {/* List */}
            <li className="dropdown ms-2">
              <div
                className="rounded-circle"
                // href="#!"
                role="button"
                id="dropdownUser"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="avatar avatar-md avatar-indicators avatar-online">
                  {userInfo?.user_profile_img ? (
                    <img
                      alt="avatar"
                      src={userInfo?.user_profile_img}
                      className="rounded-circle"
                    />
                  ) : (
                    <>
                      {userInfo?.user_gender === "Male" ? (
                        <img
                          alt="avatar"
                          src="./assets/images/avatar/male.jpg"
                          className="rounded-circle"
                        />
                      ) : (
                        <img
                          alt="avatar"
                          src="./assets/images/avatar/female.jpg"
                          className="rounded-circle"
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
              {/* <div
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownUser"
              >
                <div className="px-4 pb-0 pt-2">
                  <div className="lh-1 ">
                    <h5 className="mb-1">{userInfo?.user_name}</h5>
                    <a href="#!" className="text-inherit fs-6">
                        View my profile
                      </a>
                  </div>
                  <div className=" dropdown-divider mt-3 mb-2" />
                </div>
                <ul className="list-unstyled">
                  {userInfo.user_type === "SysAdm" && (
                    <li>
                      <Link
                        style={{ cursor: "pointer" }}
                        to={`/setting`}
                        className="dropdown-item d-flex flex-row"
                      >
                        {" "}
                        <div className="me-2">
                          <IoSettingsOutline size={20} />
                        </div>
                        Setting
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      to={`/change-password?LoginId=${userInfo?.user_loginid}`}
                      className="dropdown-item  d-flex flex-row"
                    >
                      <div className="me-2">
                        <RiLockPasswordLine size={20} />
                      </div>
                      Change Password
                    </Link>
                  </li>

                  <li>
                    <div
                      className="dropdown-item d-flex flex-row "
                      style={{ cursor: "pointer" }}
                      onClick={() => handleLogout()}
                    >
                      <div className="me-2">
                        <MdLogout size={20} />
                      </div>
                      Sign Out
                    </div>
                  </li>
                </ul>
              </div> */}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
