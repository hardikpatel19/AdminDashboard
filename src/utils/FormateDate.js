export const FormateDate = (date) => {
  const originalDate = new Date(date);
  const day = originalDate.getDate().toString().padStart(2, "0");
  const month = (originalDate.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 because months are zero-based
  const year = originalDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
};
export const DateToYYYYMMDD = (inputDate) => {
  const date = new Date(inputDate);
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
export const formatDateTime = (isoString) => {
  const dateObj = new Date(isoString);

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');

  return `${day}-${month}-${year}, ${hours}:${minutes}`;
};


