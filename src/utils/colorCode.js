function parseDuration(durationStr) {
  try{

    const [daysPart, timePart] = durationStr.split(" days, ");
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    const days = Number(daysPart);
  
    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
  }
  catch{
    const [daysPart, timePart] = durationStr.split(" days ");
    const [hours, minutes, seconds] = timePart.split(":").map(Number);
    const days = Number(daysPart);
  
    return days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60 + seconds;
    
  }
}

function compareDurations(
  actualStartdateStr,
  plannedDurationStr,
  actualEnddateStr = null
) {
  const actualStartdate = new Date(actualStartdateStr);
  const actualEnddate = actualEnddateStr
  ? new Date(actualEnddateStr)
  : new Date();
  console.log(actualStartdate,actualEnddate)

  const actualDuration = (actualEnddate - actualStartdate) / 1000; // in seconds
  const plannedDuration = parseDuration(plannedDurationStr);

  if (actualDuration > plannedDuration) {
    return true;
  } else {
    return false;
  }
}

function isStartDateGreater(aDate, pDate) {
  // Convert the date strings to Date objects
  const now = new Date();
  const actualDate = new Date(aDate);
  const plannedDate = new Date(pDate);

  // Compare the dates

  if (aDate) {
    return actualDate >= plannedDate;
  }
  return now >= plannedDate;
}
export const getClassNamesOfStartDate = (date1, date2, status) => {
  if (isStartDateGreater(date1, date2) && status === "Pending") {
    return "bg-danger-light text-white   ps-2 pe-2 rounded";
  } else if (!isStartDateGreater(date1, date2) && status === "Pending") {
    return "bg-light text-dark ps-2 pe-2 rounded";
  } else {
    return "bg-success-light text-white ps-2 pe-2 rounded";
  }
};
export const getClassNamesOfEndDate = (date1, date2, status) => {
  if (isStartDateGreater(date1, date2)) {
    return "bg-danger-light text-white   ps-2 pe-2 rounded mb-2 bg-opacity-50";
  } else if (!isStartDateGreater(date1, date2) && status === "In Process") {
    return "bg-warning-light text-dark  ps-2 pe-2 rounded mb-2 bg-opacity-50";
  } else if (!isStartDateGreater(date1, date2) && status === "Pending") {
    return "bg-light text-dark  ps-2 pe-2 rounded mb-2 bg-opacity-50";
  } else {
    return "bg-success-light text-white ps-2 pe-2 rounded mb-2 bg-opacity-50";
  }
};
export const getClassNamesOfDuration = (
  ActualStDtTm,
  ActualEndDtTm,
  planned_duration,
  status
) => {
  console.log(ActualStDtTm,ActualEndDtTm,planned_duration, status);
  if (!ActualStDtTm) {
    return "bg-light text-dark  ps-2 pe-2 rounded text-center";
  } else if (compareDurations(ActualStDtTm, planned_duration, ActualEndDtTm)) {
    return "bg-danger-light text-white   ps-2 pe-2 rounded text-center";
  } else if (
    !compareDurations(ActualStDtTm, planned_duration, ActualEndDtTm) &&
    status === "In Process"
  ) {
    return "bg-warning-light text-dark  ps-2 pe-2 rounded text-center";
  } else if (
    !isStartDateGreater(ActualStDtTm, ActualEndDtTm) &&
    status === "Pending"
  ) {
    return "bg-light text-dark  ps-2 pe-2 rounded text-center";
  } else {
    return "bg-success-light text-white ps-2 pe-2 rounded text-center";
  }
};
export const getClassNamesOfStatus = (status) => {
  if (status === "Cancel") {
    return "bg-danger-light text-white   ps-2 pe-2 rounded fw-bold";
  } else if (status === "In Process") {
    return "bg-white text-dark  ps-2 pe-2 rounded fw-bold";
  } else if (status === "Pending") {
    return "bg-light text-dark  ps-2 pe-2 rounded fw-bold";
  } else {
    return "bg-success-light text-white ps-2 pe-2 rounded fw-bold";
  }
};