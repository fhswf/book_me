import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import de from "date-fns/locale/de";

const Datepicker = () => {
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  const handleDateChange = (date) => {
    console.log(date);
    setSelected(date);
  };
  var heute = new Date();
  const [selected, setSelected] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  registerLocale("de", de);
  return (
    <DatePicker
      selected={selected}
      inline
      locale="de"
      minDate={startDate}
      maxDate={heute.addDays(30)}
      onChange={handleDateChange}
    />
  );
};

export default Datepicker;
