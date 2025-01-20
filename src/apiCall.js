import { api, domainName, scriptDomainName } from "./Constants";
import { request } from "./utils/axios-utils";

// sign up
export const signup = (data) => {
  return request({
    url: `${domainName}${api.signup}`,
    method: "post",
    data: data,
  });
};
// get sign up detail
export const getSignupReDetail = () => {
  return request({ url: `${domainName}${api.signup}`, method: "get" });
};

// login
export const login = (data) => {
  return request({
    url: `${domainName}${api.login}`,
    method: "post",
    data: data,
  });
};

// developerlist
export const getDeveloper = (pageNumber) => {
  return request({
    url: `${scriptDomainName}${api.developer}?pageNo=${pageNumber}&limit=10`,
    method: "get",
  });
};

// get developerlist
export const getDeveloperDetail = (developerId) => {
  return request({
    url: `${scriptDomainName}${api.developerDetail}/${developerId}`,
    method: "get",
  });
};

// add developerlist
export const addDeveloperDetail = (data) => {
  // Create a FormData object
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Make the API call
  return request({
    url: `${scriptDomainName}${api.developerDetail}`,
    method: "post",
    data: formData, // Pass FormData as the payload
    headers: {
      "Content-Type": "multipart/form-data", // Ensure the correct content type
    },
  });
};

// update developerlist
export const updateDeveloperDetail = (data, developerId) => {
  // Create a FormData object
  const formData = new FormData();

  // Append each key-value pair to FormData
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // Make the API call
  return request({
    url: `${scriptDomainName}${api.developerDetail}/${developerId}`,
    method: "PUT", // HTTP PUT for updating existing data
    data: formData, // Pass FormData as the payload
    headers: {
      "Content-Type": "multipart/form-data", // Ensure the correct content type
    },
  });
};

export const deleteDeveloperDetail = (developerId) => {
  return request({
    url: `${scriptDomainName}${api.developerDetail}/${developerId}`,
    method: "delete", // HTTP DELETE method
  });
};

// scriptlist
export const getScript = (pageNumber) => {
  return request({
    url: `${scriptDomainName}${api.script}?pageNo=${pageNumber}&limit=10&sortBy=1`,
    method: "get",
  });
};

// get scriptlist
export const getScriptDetail = (scriptId) => {
  return request({
    url: `${scriptDomainName}${api.scriptDetail}/${scriptId}`,
    method: "get",
  });
};

// add scriptlist
export const addScriptDetail = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    const fileInput = document.querySelector('#fileInput');
    if (fileInput.files[0]) {
      formData.append('file', fileInput.files[0]);
    }
    if (key === "file" && value instanceof File) {
      // If a single file is provided, append it
      formData.append(key, value, value.name);
    } else if (typeof value === "boolean") {
      // Convert boolean values to strings if needed
      formData.append(key, value.toString());
    } else if (key === "script_status") {
      // Convert "Active"/"Inactive" to "true"/"false"
      const booleanValue =
        value === "Active" ? "true" : value === "Inactive" ? "false" : String(value);
      formData.append(key, booleanValue);
    } else {
      // Append other fields as-is
      formData.append(key, value);
    }
  });

  return request({
    url: `${scriptDomainName}${api.scriptDetail}`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};



// update scriptlist
export const updateScriptDetail = (data, scriptId) => {
  // Create a FormData object
  const formData = new FormData();

  // Append all key-value pairs to FormData
  Object.entries(data).forEach(([key, value]) => {
    const fileInput = document.querySelector('#fileInput');
    if (fileInput.files[0]) {
      formData.append('file', fileInput.files[0]);
    }
    if (key === "file" && value instanceof File) {
      // Handle file input if provided
      formData.append(key, value, value.name);
    } else if (key === "script_status") {
      // Convert "Active"/"Inactive" to boolean
      const booleanValue = value === "Active" ? true : value === "Inactive" ? false : value;
      formData.append(key, booleanValue);
    } else if (typeof value === "boolean") {
      // Append boolean values directly
      formData.append(key, value);
    } else {
      formData.append(key, value);
    }
  });

  // Make the API call
  return request({
    url: `${scriptDomainName}${api.scriptDetail}/${scriptId}`, // Append script ID to the endpoint
    method: "PUT", // HTTP PUT for updating data
    data: formData, // Pass FormData as the payload
    headers: {
      "Content-Type": "multipart/form-data", // Ensure the correct content type
    },
  });
};


// delete scriptlist
export const deleteScriptDetail = (scriptId) => {
  return request({
    url: `${scriptDomainName}${api.scriptDetail}/${scriptId}`,
    method: "delete",
  });
};

// adminlist
export const getAdmin = (pageNumber) => {
  return request({
    url: `${scriptDomainName}${api.admin}?pageNo=${pageNumber}&limit=10`,
    method: "get",
  });
};

// get adminlist
export const getAdminDetail = (adminId) => {
  return request({
    url: `${scriptDomainName}${api.adminDetail}/${adminId}`,
    method: "get",
  });
};

// add adminlist
export const addAdminDetail = (data) => {
  return request({
    url: `${scriptDomainName}${api.adminDetail}`,
    method: "post",
    data: JSON.stringify({
      ...data,
      status: data.status === "Active" ? true : false, // Convert "Active"/"Inactive" to boolean
    }), // Directly prepare the payload inline
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};


// update adminlist
export const updateAdminDetail = (data,adminId) => {
  const payload = {
    ...data,
    status: data.status === "Active" ? true : false,
  };
  return request({
    url: `${scriptDomainName}${api.adminDetail}/${adminId}`,
    method: "put",
    data: JSON.stringify(payload), // Send JSON payload
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
};

// delete adminlist
export const deleteAdminDetail = (adminId) => {
  return request({
    url: `${scriptDomainName}${api.adminDetail}/${adminId}`,
    method: "delete",
  });
};

// tenderlist
export const getTender = (pageNumber) => {
  return request({
    url: `${domainName}${api.tender}?pageNo=${pageNumber}&limit=10&sortBy=1&sortField=createdAt&keywords=&cpv_codes=&sectors=&regions&funding_agency`,
    method: "get",
  });
};

// get tenderlist
export const getTenderDetail = (tenderId) => {
  return request({
    url: `${domainName}${api.tenderDetail}?_id=${tenderId}`,
    method: "get",
  });
};

// add tenderlist
export const addTenderDetail = (data) => {
  return request({
    url: `${domainName}${api.tenderDetail}`,
    method: "post",
    data: data,
  });
};

// update tenderlist
export const updateTenderDetail = (data) => {
  return request({
    url: `${domainName}${api.tenderDetail}`,
    method: "put",
    data: data,
  });
};

// delete tenderlist
export const deleteTenderDetail = (tenderId) => {
  return request({
    url: `${domainName}${api.tenderDetail}?_id=${tenderId}`,
    method: "delete",
  });
};

// projectlist
export const getProject = () => {
  return request({
    url: `${domainName}${api.project}?pageNo=0&limit=10&sortBy=1&sortField=createdAt&keywords=`,
    method: "get",
  });
};

// get projectlist
export const getProjectDetail = (projectId) => {
  return request({
    url: `${domainName}${api.projectDetail}?_id=${projectId}`,
    method: "get",
  });
};

// add projectlist
export const addProjectDetail = (data) => {
  return request({
    url: `${domainName}${api.projectDetail}`,
    method: "post",
    data: data,
  });
};

// update projectlist
export const updateProjectDetail = (data) => {
  return request({
    url: `${domainName}${api.projectDetail}`,
    method: "put",
    data: data,
  });
};

// delete projectlist
export const deleteProjectDetail = (projectId) => {
  return request({
    url: `${domainName}${api.projectDetail}?_id=${projectId}`,
    method: "delete",
  });
};

// calist
export const getCa = (pageNumber) => {
  return request({
    url: `${domainName}${api.ca}?pageNo=${pageNumber}&limit=10&sortBy=1&sortField=createdAt&keywords=`,
    method: "get",
  });
};

// get calist
export const getCaDetail = (caId) => {
  return request({
    url: `${domainName}${api.caDetail}?_id=${caId}`,
    method: "get",
  });
};

// add calist
export const addCaDetail = (data) => {
  return request({
    url: `${domainName}${api.caDetail}`,
    method: "post",
    data: data,
  });
};

// update calist
export const updateCaDetail = (data) => {
  return request({
    url: `${domainName}${api.caDetails}`,
    method: "put",
    data: data,
  });
};

// delete calist
export const deleteCaDetail = (caId) => {
  return request({
    url: `${domainName}${api.caDetail}?_id=${caId}`,
    method: "delete",
  });
};

// grantslist
export const getGrants = (pageNumber) => {
  return request({
    url: `${domainName}${api.grants}?pageNo=${pageNumber}&limit=10&sortBy=1&sortField=createdAt&keywords=`,
    method: "get",
  });
};

// get grantslist
export const getGrantsDetail = (grantsId) => {
  return request({
    url: `${domainName}${api.grantsDetail}?_id=${grantsId}`,
    method: "get",
  });
};

// add grantslist
export const addGrantsDetail = (data) => {
  return request({
    url: `${domainName}${api.grantsDetail}`,
    method: "post",
    data: data,
  });
};

// update grantslist
export const updateGrantsDetail = (data) => {
  return request({
    url: `${domainName}${api.grantsDetails}`,
    method: "put",
    data: data,
  });
};

// delete grantslist
export const deleteGrantsDetail = (grantsId) => {
  return request({
    url: `${domainName}${api.grantsDetail}?_id=${grantsId}`,
    method: "delete",
  });
};
export const downloadLog = (fileName) => {
  return request({
    url: `${scriptDomainName}${api.downloadLog}/${fileName}`,
    method: "get",
    responseType: "blob"
  });
};
