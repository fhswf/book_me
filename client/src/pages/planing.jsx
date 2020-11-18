import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";

import "../styles/planing.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const iconArrowRight = <FontAwesomeIcon icon={faArrowRight} />;

const Planing = () => {
  const history = useHistory();

  let { user_url } = useParams();

  const [events, setEvents] = useState([]);
  const [user, setUser] = useState({
    name: "",
  });

  useEffect(() => {
    console.log("effect");
    axios
      .get(`${process.env.REACT_APP_API_URI}/users/findUserByUrl`, {
        params: { user: user_url },
      })
      .then((res) => {
        if (res.data.length === 0) {
          history.push("/notfound");
        } else {
          setUser(res.data);
          axios
            .get(`${process.env.REACT_APP_API_URI}/events/getActiveEvents`, {
              params: { user: res.data._id },
            })
            .then((res) => {
              if (res.data.length === 0) {
                history.push("/notfound");
              } else {
                setEvents(res.data);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user_url, history]);

  function handleOnClick(bookingEvent) {
    history.push({
      pathname: `/users/${user_url}/${bookingEvent.url}`,
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
