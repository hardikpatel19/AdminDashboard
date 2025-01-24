export const domainName = "https://api.bidsinfoglobal.com";
export const scriptDomainName = "https://api.script.bidsinfoglobal.com";
// export const scriptDomainName = "http://82.112.234.182:4444";
//

export const ITEMS_PER_PAGE = 10;
export const ITEMS_PER_PAGE_MULTILINE = 10;
export const MAX_FILE_SIZE = 100;
export const DASHBOARD_NOTIFICATION_COUNT = 10;
   
export const api = {
  login: "/auth/user-login",
  logout: "/logout",
  script: "/script",
  scriptDetail: "/script",
  developer: "/developer",
  developerDetail: "/developer",
  admin: "/admin",
  adminDetail: "/admin",
  tender: "/tenders/list",
  tenderDetail: "/tenders",
  project: "/projects/list",
  projectDetail: "/projects",
  ca: "/contract-award/list",
  caDetail: "/contract-award",
  caDetails: "/grants",
  grants: "/grants/list",
  grantsDetail: "/grants",
  downloadLog: "/script/download-log",
};
