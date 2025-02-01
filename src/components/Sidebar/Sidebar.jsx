import React, { useState } from "react";
import "./Sidebar.scss";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaFolderPlus, FaCode } from "react-icons/fa";
// import { Collapse } from "react-bootstrap";

const Sidebar = ({ toggle }) => {
  const { pathname } = useLocation();
  // const [openScript, setOpenScript] = React.useState(false);
  // const [openData, setOpenData] = React.useState(false);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection((prevSection) => (prevSection === section ? null : section));
  };
  return (
    <div className="app-menu">
      <aside
        className="sidebar navbar-vertical navbar nav-dashboard"
        id="sidebar"
      >
        <div className="text-center mb-4">
          <img
            src="../assets/images/avatar/mainlogo.png"
            alt="BidsInfoGlobal"
            style={{
              maxWidth: "260px",
              margintop: "-10px",
              marginLeft: "-40px",
            }}
          />
        </div>
        {/* Navigation Links */}
        <ul className="nav flex-column w-100">
          {/* Dashboard */}
          <li className="nav-item mb-3 d-flex align-items-center ">
            <FaHome size={18} className="" />
            <Link
              to="/"
              className={`nav-link has-arrow${
                pathname === "/" ? "active" : ""
              } `}
              onClick={toggle}
            >
              Dashboard
            </Link>
          </li>

          {/* Script Section */}
          <li className="nav-item mb-3 d-flex align-items-center ">
            <FaFolderPlus size={18} className="" />
            <Link
              to="/script"
              className={`nav-link has-arrow${
                pathname === "/script" ? "active" : ""
              } `}
              onClick={toggle}
            >
              Script
            </Link>
          </li>
          {/* <li className="border-b-2 mb-3">
            <li className="nav-item  d-flex align-items-center ">
              <FaFolderPlus size={18} className="me-4" />
              <span
                className=" hover-pointer"
                style={{ cursor: "pointer" }}
                onClick={() => toggleSection("script")}
              >
                Script
              </span>
            </li>
            Collapsible Content
            {openSection === "script" && (
              <ul className="pl-6 mt-2">
                <li className="mb-2 nav-item">
                  <Link to="/tender" className="text-blue-600 ">
                    Tender
                  </Link>
                </li>
                <li className="mb-2 nav-item">
                  <Link to="/project" className="text-blue-600 ">
                    Project
                  </Link>
                </li>
                <li className="mb-2 nav-item">
                  <Link to="/ca" className="text-blue-600 ">
                    CA
                  </Link>
                </li>
                <li className="mb-2 nav-item">
                  <Link to="/grants" className="text-blue-600 ">
                    Grants
                  </Link>
                </li>
              </ul>
            )}
          </li> */}

          {/* Developer */}
          <li className="nav-item mb-3 d-flex align-items-center">
            <FaCode size={18} className="" />
            <Link
              to="/developer"
              className={`nav-link has-arrow${
                pathname === "/developer" ? "active" : ""
              } `}
              onClick={toggle}
            >
              Developer
            </Link>
          </li>

          {/* Data Section */}
          <li className="border-b-2 mb-3">
            <li className="nav-item  d-flex align-items-center ">
              <FaFolderPlus size={18} className="" />
              <span
                className=" hover-pointer nav-link"
                style={{ cursor: "pointer" }}
                onClick={() => toggleSection("data")}
              >
                Data
              </span>
            </li>
            {/* Collapsible Content */}
            {openSection === "data" && (
              <ul className="pl-6 mt-2">
                <li className="mb-2 nav-item">
                  <Link to="/tenderData" className="text-blue-600 ">
                    Tender
                  </Link>
                </li>
                <li className="mb-2 nav-item">
                  <Link to="/projectData" className="text-blue-600 ">
                    Project
                  </Link>
                </li>
                <li className="mb-2 nav-item">
                  <Link to="/caData" className="text-blue-600 ">
                    CA
                  </Link>
                </li>
                <li className="mb-2 nav-item">
                  <Link to="/grantsData" className="text-blue-600 ">
                    Grants
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* AdminEmail */}
          <li className="nav-item mb-3 d-flex align-items-center ">
            <FaFolderPlus size={18} />
            <Link
              to="/admin"
              className={`nav-link has-arrow${
                pathname === "/admin" ? "active" : ""
              } `}
              onClick={toggle}
            >
              Admin
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
