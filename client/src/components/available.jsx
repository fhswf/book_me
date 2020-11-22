import React from "react";

import AvailableTimes from "react-available-times";

function checkDay(start) {
  let day = "abcd";
  if (start < 1440) {
    day = "mon";
  } else if (start < 2 * 1440 && start >= 1440) {
    day = "tue";
  } else if (start < 3 * 1440 && start >= 2 * 1440) {
    day = "wen";
  } else if (start < 4 * 1440 && start >= 3 * 1440) {
    day = "thu";
  } else if (start < 5 * 1440 && start >= 4 * 1440) {
    day = "fri";
  } else if (start < 6 * 1440 && start >= 5 * 1440) {
    day = "sat";
  } else if (start < 7 * 1440 && start >= 6 * 1440) {
    day = "sun";
  }

  return day;
}

const Available = () => {
  return (
    <div>
      <AvailableTimes
        weekStartsOn="monday"
        height={400}
        recurring={true}
        availableDays={[
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ]}
        availableHourRange={{ start: 0, end: 24 }}
      />
    </div>
  );
};

export default Available;
