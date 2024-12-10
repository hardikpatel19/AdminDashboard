import { useEffect } from "react";
import { createBrowserHistory } from "history";
import { useNavigate } from "react-router-dom";

const history = createBrowserHistory();

const DisableBackButton = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const unblock = history.block((location, action) => {
      //   if (action === 'POP') {
      //     window.history.pushState(null, null, window.location.pathname);
      //     return false;
      // }
      // navigate("/");
      return true;
    });

    // Clean up the blocking on unmount
    return () => {
      unblock();
    };
  }, []);
  return<></>;
};

export default DisableBackButton;
