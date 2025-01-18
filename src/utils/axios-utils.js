import axios from "axios";
import { domainName,scriptDomainName } from "../Constants";

const client = axios.create();
axios.defaults.withCredentials = true;

export const request = ({ ...options }) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("token");
  client.defaults.headers.common.Authorization = `Bearer ${token}`;

  const onSuccess = (response) => response;
  const onError = (error) => {
    console.log(error)
    if (error.status === 401 && window.location.hash !== "#/sign-in") {
      window.location.href = `${window.location.origin}/#/sign-in`
      localStorage.clear()
    }
    else if (localStorage.getItem("islogin") === "true" || error.response.config.url === "/login") {
      return error;
    }
  };

  return client(options).then(onSuccess).catch(onError);
};
