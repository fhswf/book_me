import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Datepicker from "../components/datepicker";

import "../styles/booking.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMapMarkerAlt,
  faHourglass,
} from "@fortawesome/free-solid-svg-icons";
const iconArrowLeft = <FontAwesomeIcon icon={faArrowLeft} />;
const iconLocation = <FontAwesomeIcon icon={faMapMarkerAlt} />;
const iconTime = <FontAwesomeIcon icon={faHourglass} />;

const Booking = () => {
  const data = useLocation();
  console.log(data);
  const history = useHistory();

  const handleBackClick = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div>
      <div className="booking">
        <div className="bookingwrapper">
          <div className="booking-container">
            <div className="leftpanel">
              <div className="leftpanelcontent">
                <a className="btn-back" onClick={handleBackClick}>
                  {iconArrowLeft}
                </a>
                <div className="profileinfo">
                  <h4 className="username">{data.state.user.name}</h4>
                  <h1 className="eventname">{data.state.bookingEvent.name}</h1>
                </div>
                <div className="eventinfo">
                  <p className="eventdata">
                    {iconTime} {data.state.bookingEvent.duration}
                  </p>
                  <p className="eventdata">
                    {iconLocation} {data.state.bookingEvent.location}
                  </p>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="wrappanel">
                <h2 className="pickertitel">Datum wählen</h2>
                <Datepicker></Datepicker>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
