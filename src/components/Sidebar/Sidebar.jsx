import React from "react";
import "./Sidebar.scss";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaFolderPlus, FaCode } from "react-icons/fa";
// import { Collapse } from "react-bootstrap";

const Sidebar = ({ toggle }) => {
  const { pathname } = useLocation();
  const [openScript, setOpenScript] = React.useState(false);
  const [openData, setOpenData] = React.useState(false);
  return (
    <div className="app-menu">
    <aside className="sidebar navbar-vertical navbar nav-dashboard" id="sidebar">
    <div className="text-center mb-4">
        <img
          src="../assets/images/avatar/mainlogo.png"
          alt="BidsInfoGlobal"
          style={{ maxWidth: "260px",margintop:"-10px",marginLeft:"-40px" }}
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
                {/* <IoHomeOutline size={20} /> */}
                Dashboard
              </Link>
        </li>
        <li className="border-b-2 mb-3">
      {/* Script Section */}
      <div
        className="flex items-center   cursor-pointer hover:bg-gray-200"
        onClick={() => setOpenScript(!openScript)}
      >
        <FaFolderPlus size={18} className="me-4" />
        <span className="text-sm font-semibold ">Script</span>
        <span
          className={`ml-auto transition-transform duration-200 ${
            openScript ? "rotate-180" : ""
          }`}
        >
          
        </span>
      </div>

      {/* Collapsible Content */}
      {openScript && (
        <ul className="pl-6 mt-2">
          <li className="mb-2">
            <Link to="/tender" className="text-blue-600 ">
              Tender
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/project" className="text-blue-600 ">
              Project
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/ca" className="text-blue-600 ">
              CA
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/grants" className="text-blue-600 ">
              Grants
            </Link>
          </li>
        </ul>
      )}
    </li>

        {/* Developer */}
        <li className="nav-item mb-1 d-flex align-items-center">
          <FaCode size={18} className="" />
          <Link
                to="/developer"
                className={`nav-link has-arrow${
                  pathname === "/developer" ? "active" : ""
                } `}
                onClick={toggle}
              >
                {/* <IoHomeOutline size={20} /> */}
                Developer
              </Link>
        </li>
        <li className="border-b-2 mb-3">
        {/* Script Section */}
      <div
        className="flex items-center   cursor-pointer hover:bg-gray-200"
        onClick={() => setOpenData(!openData)}
      >
        <FaFolderPlus size={18} className="me-4" />
        <span className="text-sm font-semibold ">Data</span>
        <span
          className={`ml-auto transition-transform duration-200 ${
            openData ? "rotate-180" : ""
          }`}
        >
          
        </span>
      </div>

      {/* Collapsible Content */}
      {openData && (
        <ul className="pl-6 mt-2">
          <li className="mb-2">
            <Link to="/tenderData" className="text-blue-600 ">
              Tender
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/projectData" className="text-blue-600 ">
              Project
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/caData" className="text-blue-600 ">
              CA
            </Link>
          </li>
          <li className="mb-2">
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
                to="/"
                className={`nav-link has-arrow${
                  pathname === "/" ? "active" : ""
                } `}
                onClick={toggle}
              >
                {/* <IoHomeOutline size={20} /> */}
                Admin Email
              </Link>
        </li>
      </ul>
</aside>
</div>
  );
};

export default Sidebar;
