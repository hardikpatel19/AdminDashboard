import axios from "axios";
import { domainName } from "../Constants";

const client = axios.create({ baseURL: domainName });
axios.defaults.withCredentials = true;

export const request = async ({ ...options }) => {
  const token =
    sessionStorage.getItem("token") || localStorage.getItem("token");
  client.defaults.headers.common.Authorization = `Bearer ${token}`;

  const onSuccess = (response) => response;
  const onError = (error) => {
    return error;
  };

  try {
        const response = await client(options);
        return onSuccess(response);
    } catch (error) {
        return onError(error);
    }
};
