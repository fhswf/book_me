import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory, Redirect } from "react-router-dom";

import "../styles/planing.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const iconArrowRight = <FontAwesomeIcon icon={faArrowRight} />;

const Planing = () => {
  const history = useHistory();

  let { url } = useParams();

  const [events, setEvents] = useState([]);
  const [user, setUser] = useState({
    name: "No User under that Link",
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/findUserByUrl`, {
        params: { user: url },
      })
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
        if (res.data.length === 0) {
          history.push("/notfound");
        } else {
          axios
            .get(`${process.env.REACT_APP_API_URI}/getActiveEvents`, {
              params: { user: res.data._id },
            })
            .then((res) => {
              setEvents(res.data);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user._id]);

  function handleOnClick(bookingEvent) {
    history.push({
      pathname: `/${url}/${bookingEvent.name}`,
      state: { bookingEvent, user },
    });
  }

  return (
    <div className="planing">
      <div className="eventcontainer">
        <div className="planingdetails">
          <h1>{user.name}</h1>
          <h3>{user.welcome}</h3>
        </div>
        <div className="eventlist">
          <ul>
            {events.map((events) => (
              <li
                key={events._id}
                onClick={function (event) {
                  event.preventDefault();
                  handleOnClick(events);
                }}
              >
                {events.name} {iconArrowRight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Planing;
