import React from 'react';

const EncodeAprxDuration = (daysInput,hoursInput,minutesInput) => {
        const totalDays = parseFloat(daysInput) + (parseFloat(hoursInput) / 24) + (parseFloat(minutesInput) / 1440);
        return totalDays
};

export default EncodeAprxDuration;