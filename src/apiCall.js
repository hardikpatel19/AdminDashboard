import { api } from "./Constants";
import { request } from "./utils/axios-utils";

// sign up
export const signup = (data) => {
  return request({ url: api.signup, method: "post", data: data });
};
// get sign up detail
export const getSignupReDetail = () => {
  return request({ url: api.signup, method: "get" });
};

// login
export const login = (data) => {
  return request({ url: api.login, method: "post", data: data });
};

// tender
export const getTender = () => {
  return request({ url: `${api.tender}?pageNo=0&limit=10&sortBy=1&sortField=createdAt&keywords=&cpv_codes=&sectors=&regions&funding_agency`, method: "get" });
};
export const getTenderDetail = (tenderId) => {
  return request({ url: `${api.tenderDetail}?_id=${tenderId}`, method: "get" });
};
export const addTenderDetail = (data) => {
  return request({ url: `${api.tenderDetail}`, method: "post",data:data });
};
export const updateTenderDetail = (data) => {
  return request({ url: `${api.tenderDetail}`, method: "put",data:data });
};

// project
export const getProject = () => {
  return request({ url: `${api.project}?pageNo=0&limit=10&sortBy=1&sortField=createdAt&keywords=`, method: "get" });
};
// ca
export const getCa = () => {
  return request({ url: `${api.ca}?pageNo=0&limit=10&sortBy=1&sortField=createdAt&keywords=`, method: "get" });
};
// ca
export const getGrants = () => {
  return request({ url: `${api.grants}?pageNo=0&limit=10&sortBy=1&sortField=createdAt&keywords=`, method: "get" });
};
