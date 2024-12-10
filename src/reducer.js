export const initialState = {
  userLoggedIn: sessionStorage?.getItem("islogin") === "true" ? true : false,
  isLoading: false,
  userInfo: sessionStorage?.getItem("user_info")
    ? JSON.parse(sessionStorage.getItem("user_info"))
    : {},
};

function reducer(state, action) {
  // console.log(action);
  switch (action.type) {
    case "SET_LOGIN_STATUS":
      sessionStorage.setItem("islogin", action.status);

      return {
        ...state,
        userLoggedIn: action.status,
      };

    case "SET_USER_INFO":
      sessionStorage.setItem("user_info", JSON.stringify(action.data));

      return {
        ...state,
        userInfo: action.data,
      };

    case "SET_LOADING":
      if (action.status) {
        window.scrollTo(0, 0);
        document.body.style.overflow = "hidden";
      } else {
        window.scrollTo(0, 0);

        document.body.style.overflow = "unset";
      }
      return {
        ...state,
        isLoading: action.status,
      };

    default:
      return state;
  }
}

export default reducer;
