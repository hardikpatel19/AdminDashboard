import "./App.scss";
import {
  BrowserRouter,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import useDisableScroll from "./utils/useDisableScroll ";
import Home from "./pages/Home/Home";


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
      className={`${isToggled ? " main-wrapper toggled" : "main-wrapper"}`}
    >
      <BrowserRouter>
        <Header toggle={toggle} />
        <Sidebar toggle={toggle} />
        <Home/>
      </BrowserRouter>
    </div>
  );
}

export default App;
