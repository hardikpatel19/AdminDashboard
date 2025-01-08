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

// tenderlist
export const getTender = (pageNumber) => {
  return request({ url: `${api.tender}?pageNo=${pageNumber}&limit=10&sortBy=1&sortField=createdAt&keywords=&cpv_codes=&sectors=&regions&funding_agency`, method: "get" });
};

// get tenderlist
export const getTenderDetail = (tenderId) => {
  return request({ url: `${api.tenderDetail}?_id=${tenderId}`, method: "get" });
};

// add tenderlist
export const addTenderDetail = (data) => {
  return request({ url: `${api.tenderDetail}`, method: "post",data:data });
};

// update tenderlist
export const updateTenderDetail = (data) => {
  return request({ url: `${api.tenderDetail}`, method: "put",data:data });
};

// delete tenderlist
export const deleteTenderDetail = (tenderId) => {
  return request({ url: `${api.tenderDetail}?_id=${tenderId}`, method: "delete" });
};

// projectlist
export const getProject = () => {
  return request({ url: `${api.project}?pageNo=0&limit=10&sortBy=1&sortField=createdAt&keywords=`, method: "get" });
};

// get projectlist
export const getProjectDetail = (projectId) => {
  return request({ url: `${api.projectDetail}?_id=${projectId}`, method: "get" });
};

// add projectlist
export const addProjectDetail = (data) => {
  return request({ url: `${api.projectDetail}`, method: "post",data:data });
};

// update projectlist
export const updateProjectDetail = (data) => {
  return request({ url: `${api.projectDetail}`, method: "put",data:data });
};

// delete projectlist
export const deleteProjectDetail = (projectId) => {
  return request({ url: `${api.projectDetail}?_id=${projectId}`, method: "delete" });
};

// calist
export const getCa = () => {
  return request({ url: `${api.ca}?pageNo=0&limit=10&sortBy=1&sortField=createdAt&keywords=`, method: "get" });
};

// get calist
export const getCaDetail = (caId) => {
  return request({ url: `${api.caDetail}?_id=${caId}`, method: "get" });
};

// add calist
export const addCaDetail = (data) => {
  return request({ url: `${api.caDetail}`, method: "post",data:data });
};

// update calist
export const updateCaDetail = (data) => {
  return request({ url: `${api.caDetails}`, method: "put",data:data });
};

// delete calist
export const deleteCaDetail = (caId) => {
  return request({ url: `${api.caDetail}?_id=${caId}`, method: "delete" });
};

// grantslist
export const getGrants = () => {
  return request({ url: `${api.grants}?pageNo=0&limit=10&sortBy=1&sortField=createdAt&keywords=`, method: "get" });
};

// get grantslist
export const getGrantsDetail = (grantsId) => {
  return request({ url: `${api.grantsDetail}?_id=${grantsId}`, method: "get" });
};

// add grantslist
export const addGrantsDetail = (data) => {
  return request({ url: `${api.grantsDetail}`, method: "post",data:data });
};

// update grantslist
export const updateGrantsDetail = (data) => {
  return request({ url: `${api.grantsDetails}`, method: "put",data:data });
};

// delete grantslist
export const deleteGrantsDetail = (grantsId) => {
  return request({ url: `${api.grantsDetail}?_id=${grantsId}`, method: "delete" });
};
