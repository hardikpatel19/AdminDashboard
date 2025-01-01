export const domainName = "https://api.bidsinfoglobal.com";
//

export const ITEMS_PER_PAGE = 10;
export const ITEMS_PER_PAGE_MULTILINE = 10;
export const MAX_FILE_SIZE = 100;
export const DASHBOARD_NOTIFICATION_COUNT = 10;
export const TRAN_TYPE = [
  { key: "Staff", value: 2 },
  { key: "Project Template", value: 3 },
  { key: "Task Template", value: 4 },
  { key: "SubTask Template", value: 5 },
  { key: "Project", value: 6 },
  { key: "Task", value: 7 },
  { key: "SubTask", value: 8 },
];
export const ACTION_TYPE = [
  { id: "LogInSuccess", value: "Log-In Successful" },
  { id: "LogInFailure", value: "Log-In Failed" },
  { id: "LogOut", value: "Log-Out" },
  { id: "AddRecord", value: "Added Record" },
  { id: "ChangeRecord", value: "Changed Record" },
  { id: "DeleteRecord", value: "Deleted Record" },
  { id: "ExportReport", value: "Exported Report" },
  { id: "PrintReport", value: "Printed Report" }
];
export const ENTITY_TYPE = [
  { id: 1, value: "Company" },
  { id: 2, value: "Staff" },
  { id: 3, value: "Project Template" },
  { id: 4, value: "Task Template" },
  { id: 5, value: "SubTask Template" },
  { id: 6, value: "Project Transaction" },
  { id: 7, value: "Task Transaction" },
  { id: 8, value: "SubTask Transaction" },
];


export const api = {
  login: "/auth/user-login",
  tender:"/tenders/list"
 
  
};
