import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import Datepicker from "../components/datepicker";

import "../styles/booking.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMapMarkerAlt,
  faHourglass,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

import { getUserByUrl } from "../helpers/services/user_services";
import { getEventByUrlAndUser } from "../helpers/services/event_services";
const iconArrowLeft = <FontAwesomeIcon icon={faArrowLeft} />;
const iconLocation = <FontAwesomeIcon icon={faMapMarkerAlt} />;
const iconTime = <FontAwesomeIcon icon={faHourglass} />;
const iconCal = <FontAwesomeIcon icon={faCalendar} />;

const Booking = () => {
  const data = useParams();
  const history = useHistory();

  const [user, setUser] = useState({
    name: "No User under that Link",
  });
  const [event, setEvent] = useState({
    name: "",
    location: "",
    duration: "",
  });

  useEffect(() => {
    getUserByUrl(data.user_url)
      .then((res) => {
        if (res.data.length === 0) {
          history.push("/notfound");
        } else {
          setUser(res.data);
          getEventByUrlAndUser(res.data._id, data.url)
            .then((res) => {
              if (res.data == null) {
                history.push("/notfound");
              }
              if (res.data.isActive === false) {
                history.push("/notfound");
              } else {
                setEvent(res.data);
              }
            })
            .catch((err) => {
              return err;
            });
        }
      })
      .catch((err) => {
        return err;
      });
  }, []);

  const handleBackClick = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div>
      <div className="booking">
        <div className="bookingwrapper">
          <div className="booking-header">
            <h1>{iconCal} Bookme</h1>
          </div>
          <div className="booking-container">
            <div className="leftpanel">
              <div className="leftpanelcontent">
                <a className="btn-back" onClick={handleBackClick}>
                  {iconArrowLeft}
                </a>
                <div className="profileinfo">
                  <img alt="profile" src={user.picture_url}/>
                  <h4 className="username">{user.name}</h4>
                  <h1 className="eventname">{event.name}</h1>
                </div>
                <div className="eventinfo">
                  <p className="eventdata">
                    {iconTime} {event.duration} Minutes
                  </p>
                  <p className="eventdata">
                    {iconLocation} {event.location}
                  </p>
                </div>
              </div>
            </div>
            <div className="panel">
              <div className="wrappanel">
                <h2 className="pickertitel">Choose a date</h2>
                <Datepicker options={(data.url, event, user)}></Datepicker>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
