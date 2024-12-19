import React, {useRef } from "react";
import "./Header.scss";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useStateValue } from "../../StateProvider";

const Header = ({ toggle }) => {
  const searchInput = useRef(null);
  const [{ userInfo }] = useStateValue();
  
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
          <div className="d-none d-md-none d-lg-block w-15 find">
                        <input
                          ref={searchInput}
                          type="search"
                          className="form-control "
                          onChange={(e) => {
                          }}
                          placeholder="Search "
                        /></div>
          {/*Navbar nav */}
          <ul className="navbar-nav navbar-right-wrap ms-lg-auto d-flex nav-top-wrap align-items-center ms-4 ms-lg-0">
            <li className="dropdown stopevent ms-2">
            <div className="btn btn-ghost btn-icon rounded-circle notification-icon">
                <img
                    src="../assets/images/avatar/brightness.png"
                    className="img-fluid"
                    alt="Imaged"
                  />
              </div>
              <div className="btn btn-ghost btn-icon rounded-circle notification-icon">
                <IoMdNotificationsOutline size={28} />
              </div>
            </li>
            {/* List */}
            <li className="dropdown ms-2">
              <div
                className="rounded-circle"
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
                          src="./assets/images/avatar/menu.png"
                          className="rounded-circle"
                        />
                      ) :
                       (
                        <img
                          alt="avatar"
                          src="./assets/images/avatar/menu.png"
                          className="rounded-circle"
                        />
                      )
                      }
                    </>
                  )}
                </div>
              </div>
             
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
