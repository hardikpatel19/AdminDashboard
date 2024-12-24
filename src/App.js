import "./App.scss";
import {
  BrowserRouter,
  Navigate,
  // Router,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
// import { ProtectRoute } from "./utils/ProtectRoutes";

import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import useDisableScroll from "./utils/useDisableScroll ";
import Home from "./pages/Home/Home";
import ScriptList from "./pages/Script/components/ScriptList/ScriptList";
import AddUpdateScriptDetail from "./pages/Script/components/AddUpdateScriptDetail/AddUpdateScriptDetail";
import Tender from "./pages/Script/components/Tender/Tender";
import Project from "./pages/Script/components/Project/Project";
import Ca from "./pages/Script/components/CA/Ca";
import Grants from "./pages/Script/components/Grants/Grants";
import Developer from "./pages/Script/components/Developer/Developer";
import AddUpdateDeveloperdetail from "./pages/Script/components/AddUpdateDeveloperDetail/AddUpdateDeveloperdetail";
// import AddUpdateScriptDetail from "./pages/Script/components/AddUpdateScriptDetail/AddUpdateScriptDetail";


function App() {
  const [isToggled, setIsToggle] = useState(true);
  useDisableScroll();

  const toggle = () => {
    setIsToggle(!isToggled);
  };

  useEffect(() => {
    if (window.innerWidth < 600) {
      setIsToggle(true);
    }
  }, []);

  return (
    <div
      id="main-wrapper"
      className={`${isToggled ? "main-wrapper toggled" : "main-wrapper"}`}
    >
      <BrowserRouter>
        {/* {isLoading && <LoadingSpinner />}
        <Toaster /> */}
        {/* Main application routes */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header toggle={toggle} />
                <Sidebar toggle={toggle} />
                <Outlet />
              </>
            }
          >
            <Route index element={<Home />} />
            <Route path="/script" element={<ScriptList />} />
            <Route path="/add/script" element={<AddUpdateScriptDetail />} />
            <Route path="/update/script/:scriptId" element={<AddUpdateScriptDetail />} />
            <Route path="/tender" element={<Tender />} />
            <Route path="/project" element={<Project />} />
            <Route path="/ca" element={<Ca />} />
            <Route path="/grants" element={<Grants />} />
            <Route path="/developer" element={<Developer />} />
            <Route path="/add/developer" element={<AddUpdateDeveloperdetail />} />
            <Route path="/update/script/:scriptId" element={<AddUpdateScriptDetail />} />

            {/* <Route path="/patient" element={<PatientList />} />
            <Route path="/add/patient" element={<AddUpdatePatientDetail />} />
            <Route path="/update/patient/:patientId" element={<AddUpdatePatientDetail />} /> */}
          </Route>

          {/* Redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
