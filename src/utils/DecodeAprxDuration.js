import React from "react";

const DecodeAprxDuration = (timeString) => {
  console.timeLog(timeString)
        
  const [daysPart, text,timePart] = timeString.split(" ");
  console.log(timePart)

  // Extract the number of days
  const days = parseInt(daysPart, 10);

  // Split the time part by ":" to get hours, minutes, and seconds
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  return [days, hours, minutes]
};

export default DecodeAprxDuration;
