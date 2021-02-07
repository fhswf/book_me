import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";

import { useHistory, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";

import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";
import { getAvailableTimes } from "../helpers/services/event_services";

import { registerLocale } from "react-datepicker";
import de from "date-fns/locale/de";

const Datepicker = () => {
  registerLocale("de", de);
  // eslint-disable-next-line no-extend-native
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  const [selected, setSelected] = useState(new Date().addDays(2));
  const [timeSelected, setTimeSelected] = useState(false);
  const [slots, setSlots] = useState();
  const [timeselect, settimeselect] = useState(false);

  const history = useHistory();
  let location = useLocation();
  const event = location.state.bookingEvent;
  const user = location.state.user;

  const filterDates = (date) => {
    let day = date.getDay();
    let dayArray = [];
    if (event.calendardays === false) {
      dayArray[0] = 0;
      dayArray[6] = 6;
    }
    if (event.available.mon[0] === "" && event.available.mon[1] === "") {
      dayArray[1] = 1;
    }
    if (event.available.tue[0] === "" && event.available.tue[1] === "") {
      dayArray[2] = 2;
    }
    if (event.available.wen[0] === "" && event.available.wen[1] === "") {
      dayArray[3] = 3;
    }
    if (event.available.thu[0] === "" && event.available.thu[1] === "") {
      dayArray[4] = 4;
    }
    if (event.available.fri[0] === "" && event.available.fri[1] === "") {
      dayArray[5] = 5;
    }
    if (event.available.sat[0] === "" && event.available.sat[1] === "") {
      dayArray[6] = 6;
    }
    if (event.available.sun[0] === "" && event.available.sun[1] === "") {
      dayArray[0] = 0;
    }

    return (
      day !== dayArray[0] &&
      day !== dayArray[1] &&
      day !== dayArray[2] &&
      day !== dayArray[3] &&
      day !== dayArray[4] &&
      day !== dayArray[5] &&
      day !== dayArray[6]
    );
  };

  const onBtntest = (e) => {
    e.preventDefault();
    history.push({
      pathname: `/users/${user.user_url}/${event.url}/${selected}`,
      state: {
        userid: user._id,
        event: event,
        name: user.name,
        selected: selected,
      },
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  function setAvailableTimes(selectedDay) {
    selectedDay.setHours(6);
    getAvailableTimes(selectedDay, event.url, user._id).then((res) => {
      console.log('slots: %j', res.data);
      setSlots(res.data);
    });
  }

  const getTimes = () => {
    if (slots) {
      let times = []
      for (let slot of slots) {
        const start = new Date(slot.start);
        const end = new Date(slot.end);
        times.push(start);
        times.push(end);
      }
      return times;
    }
    else {
      return []
    }
  }

  const filterPassedTime = (time) => {
    const _time = new Date(time);
    console.log('filterPassedTime: slots=%o %s', slots, time);
    if (!slots) {
      return false;
    }
    for (let slot of slots) {
      const start = new Date(slot.start);
      const end = new Date(slot.end);
      console.log('filterPassedTime: %s %s %s', start.toTimeString(), _time.toTimeString(), end.toTimeString());
      if (start.toTimeString() <= selected.toTimeString() && _time.toTimeString() <= end.toTimeString()) {
        return true;
      }
    }
    return false;
  }

  const handleDateChange = (date) => {
    setSelected(date);
    setAvailableTimes(date);
  };

  const renderBookingButton = () => {
    if (timeSelected === true) {
      return (
        <div>
          <div className="booksubmit">
            <Button onClick={onBtntest}>Book this appointment</Button>
          </div>
        </div>
      );
    } else {
      return (
        <h4 className="firstselect">Select a Date and Time to continue</h4>
      );
    }
  };

  function getDayofWeek(day) {
    let weekday = "";
    switch (day) {
      case 0:
        weekday = "sun";
        break;
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
      default:
        weekday = "";
    }
    return weekday;
  }

  return (
    <div>
      <DatePicker
        selected={selected}
        showTimeSelect
        locale="de"
        inline
        timeFormat="HH:mm"
        timeIntervals={60}
        minDate={new Date()}
        maxDate={new Date().addDays(event.rangedays)}
        minTime={Math.min.apply(null, getTimes())}
        maxTime={Math.max.apply(null, getTimes())}
        includeTimes={getTimes()}
        onChange={handleDateChange}
        filterDate={filterDates}
      />
      {renderBookingButton()}
    </div>
  );
};

export default Datepicker;
