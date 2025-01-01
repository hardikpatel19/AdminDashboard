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

// logout
export const getTender = () => {
  return request({ url: `${api.tender}?pageNo=0&limit=10&sortBy=1&sortField=createdAt&keywords=&cpv_codes=&sectors=&regions&funding_agency`, method: "get" });
};

// get login detail
export const getLoginPageDetail = () => {
  return request({ url: api.login, method: "get" });
};

// list of staff
export const listStaff = () => {
  return request({ url: api.listStaff, method: "get" });
};

// get user detail
export const getUser = (uuid) => {
  return request({ url: `${api.listStaff}/${uuid}`, method: "get" });
};
export const getUserDetail = (uuid) => {
  return request({ url: `${api.editeUser}/${uuid}`, method: "get" });
};
// edit user detail
export const editeUser = (id, data) => {
  return request({ url: `${api.editeUser}/${id}`, method: "post", data: data });
};
// edit user detail
export const changePassword = (id, data) => {
  return request({
    url: `${api.changePassword}/${id}`,
    method: "post",
    data: data,
  });
};
// delete user detail
export const deleteStaff = (id) => {
  return request({ url: `${api.deleteStaff}/${id}`, method: "post" });
};
// deactivateUser user detail
export const DeactivateUser = (id) => {
  return request({ url: `${api.deactivateUser}/${id}`, method: "post" });
};
// active user detail
export const ActivateUser = (id) => {
  return request({ url: `${api.activateUser}/${id}`, method: "post" });
};

// add company info
export const addCompanyInfo = (data) => {
  return request({ url: `${api.addCompanyInfo}`, method: "post", data: data });
};

// update company info
export const updateCompanyInfo = (data) => {
  return request({ url: `${api.companyInfo}`, method: "post", data: data });
};

// get company info
export const getCompanyInfo = () => {
  return request({ url: `${api.companyInfo}`, method: "get" });
};
// reset password
export const UserResetPassword = (id) => {
  return request({ url: `${api.userResetPassword}/${id}`, method: "post" });
};

// set new password
export const setNewPassword = (data) => {
  return request({ url: `${api.setNewPassword}/`, method: "post", data: data });
};

// get task template list
export const getTaskTempList = (ID) => {
  return request({
    url: `${api.taskTempList}${ID ? `/${ID}` : ""}`,
    method: "get",
  });
};

// add task template
export const addTaskTemp = (data) => {
  return request({ url: `${api.addTaskTemp}`, method: "post", data: data });
};
export const getTaskTempOrderNo = (id) => {
  return request({ url: `${api.addTaskTemp}/${id}`, method: "get" });
};

// add task template
export const editeTaskTemplate = (ID, data) => {
  return request({
    url: `${api.taskTemplate}/${ID}`,
    method: "post",
    data: data,
  });
};
// add task template
export const getTaskTemplateDetail = (ID) => {
  return request({ url: `${api.taskTemplate}/${ID}`, method: "get" });
};

// get project template  list
export const getProjectTempList = () => {
  return request({ url: `${api.projectTempList}`, method: "get" });
};

//add project template
export const addProjectTemp = (data) => {
  return request({ url: `${api.addProjectTemp}`, method: "post", data: data });
};

//get sub task list
export const getSubTaskTempList = (ID) => {
  return request({ url: `${api.subTaskTempList}/${ID}`, method: "get" });
};

//add sub task
export const addSubTask = (data) => {
  return request({ url: `${api.addSubTaskTemp}`, method: "post", data: data });
};
export const getSubTaskOrdNo = (taskId) => {
  return request({ url: `${api.addSubTaskTemp}/${taskId}`, method: "get" });
};
export const getSubTask = (ID) => {
  return request({ url: `${api.subTaskTemp}/${ID}`, method: "get" });
};
export const updateSubTask = (ID, data) => {
  return request({
    url: `${api.subTaskTemp}/${ID}`,
    method: "post",
    data: data,
  });
};
export const deleteSubTask = (ID) => {
  return request({ url: `${api.deleteSubTaskTemp}/${ID}`, method: "post" });
};
export const deleteTaskTemp = (ID) => {
  return request({ url: `${api.deleteTaskTemp}/${ID}`, method: "post" });
};
export const deleteProjectTemp = (ID) => {
  return request({ url: `${api.deleteProjectTemp}/${ID}`, method: "post" });
};
export const updateProjectTemp = (ID, data) => {
  return request({
    url: `${api.projectTemp}/${ID}`,
    method: "post",
    data: data,
  });
};
export const getProjectTemp = () => {
  return request({ url: `${api.projectTemp}`, method: "get" });
};

export const getProjectTemplateDetail = (ID) => {
  return request({ url: `${api.projectTemp}/${ID}`, method: "get" });
};
export const addNewTask = (data, ID = null) => {
  return request({
    url: `${api.addNewTask}${ID ? `/${ID}` : ""}`,
    method: "post",
    data: data,
  });
};
export const getAddNewTaskDetail = (projectId = "") => {
  return request({ url: `${api.addNewTask}${projectId ? `?project_id=${projectId}` : ""}`, method: "get" });
};
export const getUserInfo = () => {
  return request({ url: `${api.getUserInfo}`, method: "get" });
};
export const getTaskList = () => {
  return request({ url: `${api.taskList}`, method: "get" });
};
export const getTaskDetail = (id) => {
  return request({ url: `${api.task}/${id}`, method: "get" });
};
export const updateTaskDetail = (id, data) => {
  return request({ url: `${api.task}/${id}`, method: "post", data: data });
};
export const removeTask = (id) => {
  return request({ url: `${api.removeTask}/${id}`, method: "post" });
};
export const getSubTaskFormDetail = (taskId) => {
  return request({ url: `${api.addTaskSubTask}/${taskId}`, method: "get" });
};
export const addTaskSubTask = (taskId, data) => {
  return request({
    url: `${api.addTaskSubTask}/${taskId}`,
    method: "post",
    data: data,
  });
};
export const getTaksSubTask = (subtaskId) => {
  return request({ url: `${api.subTask}/${subtaskId}`, method: "get" });
};
export const getSubTaskList = (taskId) => {
  return request({ url: `${api.subTaskList}/${taskId}`, method: "get" });
};
export const updateTaksSubTask = (subtaskId, data) => {
  return request({
    url: `${api.subTask}/${subtaskId}`,
    method: "post",
    data: data,
  });
};
export const removeTaksSubTask = (subtaskId) => {
  return request({ url: `${api.removeSubTask}/${subtaskId}`, method: "post" });
};
export const doneSubTask = (subtaskId) => {
  return request({ url: `${api.doneSubTask}/${subtaskId}`, method: "post" });
};
export const checkSubtaskStatus = (taskId) => {
  return request({
    url: `${api.checkSubtaskStatus}/${taskId}`,
    method: "post",
  });
};
export const incompleteSubTask = (subtaskId) => {
  return request({
    url: `${api.incompleteSubTask}/${subtaskId}`,
    method: "post",
  });
};
export const StartTask = (taskId) => {
  return request({ url: `${api.startTask}/${taskId}`, method: "post" });
};
export const DoneTask = (taskId, data) => {
  return request({
    url: `${api.doneTask}/${taskId}`,
    method: "post",
    data: data,
  });
};
export const AcceptTask = (taskId, data) => {
  return request({
    url: `${api.acceptTask}/${taskId}`,
    method: "post",
    data: data,
  });
};
export const RejectTask = (taskId, data) => {
  return request({
    url: `${api.rejectTask}/${taskId}`,
    method: "post",
    data: data,
  });
};
export const CancelTask = (taskId, data) => {
  return request({
    url: `${api.cancelTask}/${taskId}`,
    method: "post",
    data: data,
  });
};
export const CancelProject = (projectId, data) => {
  return request({
    url: `${api.cancelProject}/${projectId}`,
    method: "post",
    data: data,
  });
};

export const getAllTaskTempList = () => {
  return request({ url: `${api.taskTempList}_all`, method: "get" });
};
export const getDashboardCounts = (userCode, loginUserCode) => {
  return request({
    url: `${api.dashboardCount}/${userCode === "All" ? `${loginUserCode}?all=true` : `${userCode}`
      }`,
    method: "get",
  });
};

export const getAttachmets = (tranType, tranMID, attchType) => {
  return request({
    url: `${api.getAttachmets}?TranType=${tranType}&TranMID=${tranMID}&AttchType=${attchType}`,
    method: "get",
  });
};
export const deleteAttachmet = (id) => {
  return request({ url: `${api.deleteAttachmets}/${id}`, method: "post" });
};
export const editeAttachments = (id, data) => {
  return request({
    url: `${api.editeAttachments}/${id}`,
    method: "post",
    data: data,
  });
};
export const getEditeAttachmentsData = (id) => {
  return request({ url: `${api.editeAttachments}/${id}`, method: "get" });
};
export const uploadAttachmets = (data) => {
  return request({
    url: `${api.uploadAttachmets}`,
    method: "post",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getOverDueTask = (userCode, loginUserCode) => {
  return request({
    url: `${api.overDueTask}/${userCode === "All" ? `${loginUserCode}?all=true` : `${userCode}`
      }`,
    method: "get",
  });
};
export const getOnGoingTask = (userCode, loginUserCode) => {
  return request({
    url: `${api.onGoingTask}/${userCode === "All" ? `${loginUserCode}?all=true` : `${userCode}`
      }`,
    method: "get",
  });
};
export const getUnderReviewTask = (userCode, loginUserCode) => {
  return request({
    url: `${api.underReviewTask}/${userCode === "All" ? `${loginUserCode}?all=true` : `${userCode}`
      }`,
    method: "get",
  });
};
export const getUpComingTask = (userCode, loginUserCode) => {
  return request({
    url: `${api.upComingTask}/${userCode === "All" ? `${loginUserCode}?all=true` : `${userCode}`
      }`,
    method: "get",
  });
};
export const checkSysConfig = () => {
  return request({ url: `${api.checkSysConfig}`, method: "post" });
};
export const updateSysConfig = (data) => {
  return request({ url: `${api.updateSysConfig}`, method: "post", data: data });
};
export const listSysconfigs = () => {
  return request({ url: `${api.listSysconfigs}`, method: "get" });
};
export const getAddProjectData = () => {
  return request({ url: `${api.addProject}`, method: "get" });
};

export const addProject = (data, ID = null) => {
  return request({
    url: `${api.addProject}${ID ? `/${ID}` : ""}`,
    method: "post",
    data: data,
  });
};
export const listOfProjectTemp = () => {
  return request({ url: `${api.listOfProjectTemp}`, method: "get" });
};
export const listOfProject = (userFilter) => {
  return request({
    url: `${api.listOfProject}?user_code=${!(userFilter === "All" ||userFilter ==="") ? userFilter : ""}&all=${!(userFilter === "All" ||userFilter ==="") ? false : true
      }`,
    method: "get",
  });
};
export const updateProject = (id, data) => {
  return request({ url: `${api.project}/${id}`, method: "post", data: data });
};
export const getProject = (id) => {
  return request({ url: `${api.project}/${id}`, method: "get" });
};
export const deleteProject = (id) => {
  return request({ url: `${api.deleteProject}/${id}`, method: "post" });
};
export const AcceptProject = (id, data) => {
  return request({
    url: `${api.acceptProject}/${id}`,
    method: "post",
    data: data,
  });
};
export const RejectProject = (id, data) => {
  return request({
    url: `${api.rejectProject}/${id}`,
    method: "post",
    data: data,
  });
};
export const getProjectTask = (id) => {
  return request({ url: `${api.taskList}/${id}`, method: "get" });
};
export const getNotificationList = (
  all = true,
  tranMID = null,
  tranType = null,
  limit = null
) => {
  return request({
    url: `${api.getNotificationList}?all=${all}&TranMID=${tranMID}&TranType=${tranType}&${limit ? `limit=${limit}` : ""}`,
    method: "get",
  });
};
export const getNotification = (id) => {
  return request({
    url: `${api.getNotification}/${id}`,
    method: "get",
  });
};
export const getAddNotificationData = () => {
  return request({
    url: `${api.addNotification}`,
    method: "get",
  });
};
export const addNotification = (data) => {
  return request({
    url: `${api.addNotification}`,
    method: "post",
    data: data,
  });
};

export const getTableData = (type) => {
  return request({
    url: `${api.getTableData}/${type}`,
    method: "get",
  });
};
export const getNotificationCount = () => {
  return request({
    url: `${api.getNotificationCount}`,
    method: "get",
  });
};
export const getUserActivity = (data) => {
  return request({
    url: `${api.getUserActivity}?staff_code=${data?.userFilter}&action_type=${data?.actionType}&entity_type=${data?.entityType}&entity_id=${data?.entityId ? data?.entityId : 0}&period=${`${data?.startDate},${data.endDate}`}`,
    method: "get",
  });
};
export const getReports = (data) => {
  return request({
    url: `${api.getReports}?entity=${data?.entity}&status=${data?.reportStatus}&period=${`${data?.startDate},${data.endDate}`}&user=${data?.userFilter}&task_status=${data?.taskStatus}&by_or_to_me=${data?.byOrToMe}`,
    method: "get",
  });
};

export const createUserActivityReports = (data, actionTypeArg) => {
  return request({
    url: `${api.createUserActivityReports}?action_type=${actionTypeArg}&report_name=${data?.entity}&status=${data?.reportStatus}&start_date=${`${data?.startDate}&end_date=${data.endDate}`}&user=${data?.userFilter}&task_status=${data?.taskStatus}&by_or_to_me=${data?.byOrToMe}`,
    method: "post",

  });
};