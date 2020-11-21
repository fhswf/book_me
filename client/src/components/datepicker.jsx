import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import { useHistory, useLocation } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";

import { registerLocale } from "react-datepicker";
import de from "date-fns/locale/de";
import Axios from "axios";
import { Button } from "react-bootstrap";

const Datepicker = () => {
  const history = useHistory;
  const [selected, setSelected] = useState(new Date());

  let location = useLocation();

  const event = location.state.bookingEvent;

  registerLocale("de", de);

  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  function getDayofWeek(day) {
    let weekday = "";
    switch (day) {
      case 1:
        weekday = "mon";
        break;
      case 2:
        weekday = "tue";
        break;
      case 3:
        weekday = "wen";
        break;
      case 4:
        weekday = "thu";
        break;
      case 5:
        weekday = "fri";
        break;
      case 6:
        weekday = "sat";
        break;
      case 0:
        weekday = "sun";
        break;
      default:
        weekday = "";
    }
    return weekday;
  }
  function freeBusy(date) {
    Axios.get(`${process.env.REACT_APP_API_URI}/google/freebusy`, {
      params: {
        date: date,
      },
    }).then((res) => {});
  }
  function getAvailableTimes(selectedDay) {
    let weekday = getDayofWeek(selectedDay.getDay());

    Axios.get(`${process.env.REACT_APP_API_URI}/events/getavailable`, {
      params: {
        day: weekday,
        eventurl: event.url,
      },
    }).then((res) => {
      console.log(res.data);
    });
  }

  function ISODateString(d) {
    function pad(n) {
      return n < 10 ? "0" + n : n;
    }
    return (
      d.getUTCFullYear() +
      "-" +
      pad(d.getUTCMonth() + 1) +
      "-" +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      ":" +
      pad(d.getUTCMinutes()) +
      ":" +
      pad(d.getUTCSeconds()) +
      "Z"
    );
  }

  const handleDateChange = (date) => {
    setSelected(date);
    getAvailableTimes(selected);
  };

  return (
    <div>
      <DatePicker
        selected={selected}
        inline
        locale="de"
        showTimeSelect
        minDate={new Date()}
        maxDate={new Date().addDays(event.rangedays)}
        onChange={handleDateChange}
        dateFormat="eee d, MM, yyyy"
        timeFormat="HH:mm"
      />
    </div>
  );
};

export default Datepicker;
