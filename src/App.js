import "./App.scss";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
// import Home from "./pages/Home/Home";
import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";

// import { ProtectRoute } from "./utils/ProtectRoutes";
// import { LoadingSpinner } from "./components/LoadingSpinner/LoadingSpinner";
// import toast, { Toaster } from "react-hot-toast";
import { useStateValue } from "./StateProvider";

// import DisableBackButton from "./utils/DisableBackButton";
import useDisableScroll from "./utils/useDisableScroll ";
// import SignIn from "./pages/SignIn/SignIn";
import Home from "./pages/Home/Home";
// import PatientList from "./pages/Patient/components/PatientList/PatientList";
// import AddUpdatePateientDetail from "./pages/Patient/components/AddUpdatePatientDetail/AddUpdatePatientDetail";
// import AddUpdatePatientDetail from "./pages/Patient/components/AddUpdatePatientDetail/AddUpdatePatientDetail";

function App() {
  const [{ userLoggedIn, isLoading }, dispatch] = useStateValue();
  const [isToggled, setIsToggle] = useState(true);
  useDisableScroll();
  // DisableBackButton()

  // ************************************ toggle fun start ************************************
  const toggle = () => {
    setIsToggle(!isToggled);
  };
  // ************************************ toggle fun end ************************************

  useEffect(() => {
    if (window.innerWidth < 600) {
      setIsToggle(true);
    }
  }, []);

  return (
    <div
      id="main-wrapper"
      className={`${isToggled ? " main-wrapper toggled" : "main-wrapper"}`}
    >
      <BrowserRouter>
        {/* {isLoading && <LoadingSpinner />} */}
        {/* <Toaster /> */}
        <Header toggle={toggle} />
        <Sidebar toggle={toggle} />
        <Home/>
        {/* <DisableBackButton /> */}
        {/* <Routes>
          <Route path="/sign-in" element={<SignIn />}></Route>
          <Route
            path="/"
            element={
              <ProtectRoute>
                <Header toggle={toggle} />
                <Sidebar toggle={toggle} />
                <Outlet />
              </ProtectRoute>
            }
          >
            <Route index element={<Home />} /> */}
            {/* <Route path="/patient" element={<PatientList />} />
            <Route path="/add/patient" element={<AddUpdatePatientDetail />} />
            <Route path="/update/patient/:patientId" element={<AddUpdatePatientDetail />} /> */}
          {/* </Route>
        </Routes> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
