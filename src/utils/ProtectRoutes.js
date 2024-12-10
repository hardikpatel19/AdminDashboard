import { Navigate, useLocation } from "react-router-dom";
import { useStateValue } from "../StateProvider";

function isStringInListOrMatch(string, stringList) {
  if (stringList.includes(string)) {
    return true;
  }
  // for (let item of stringList) {
  //   console.log
  //   console.log(string.startsWith(item))
  //   // if (string.startsWith(item)) {
  //   //   return true;
  //   // }
  // }
  return false;
}

export const ProtectRoute = ({ children }) => {
  const [{ userLoggedIn, userInfo }, dispatch] = useStateValue();
  let location = useLocation();
  const protectRouteList = [
    "/",
    
  ];
  // const protectRouteList = ["/", "/staff", "/company-info", "task-template","project-template","/change-password"];
  const adminRouts = [
    "/staff",
    "/company-info",
    "/task-template",
    "/project-template",
  ];

  const routeList = ["/sign-in"];
  
  if (!userLoggedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }
  // if (
  //   !userLoggedIn &&
  //   isStringInListOrMatch(location.pathname, protectRouteList)
  // ) {
  //   return <Navigate to="/sign-in" state={{ from: location }} replace />;
  // }
  // if (userLoggedIn && isStringInListOrMatch(location.pathname, routeList)) {
  //   return <Navigate to="/" state={{ from: location }} replace />;
  // }
  // if (
  //   userLoggedIn &&
  //   userInfo?.user_type === "staff" &&
  //   isStringInListOrMatch(location.pathname, adminRouts)
  // ) {
  //   return <Navigate to="/" state={{ from: location }} replace />;
  // }

  return children;
};
