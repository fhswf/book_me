import React, { useEffect, useState } from "react";

import { useParams, useHistory } from "react-router-dom";

import "../styles/planing.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getActiveEvents } from "../helpers/services/event_services";
import { getUserByUrl } from "../helpers/services/user_services";
const iconArrowLeft = <FontAwesomeIcon icon={faArrowLeft} />;
const iconArrowRight = <FontAwesomeIcon icon={faArrowRight} />;

const Planing = () => {
  const history = useHistory();

  let { user_url } = useParams();

  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState({
    name: "",
    welcome: "",
  });

  useEffect(() => {
    getUserByUrl(user_url)
      .then((res) => {
        if (res.data.length === 0) {
          history.push("/notfound");
        } else {
          setUser(res.data);
          if (!res.data.google_tokens.access_token) {
            setConnected(false);
          } else {
            setConnected(true);
          }
          getActiveEvents(res.data._id)
            .then((res) => {
              console.log(res.data);
              if (res.data.length === 0) {
                setUser({
                  name: [...user.name],
                  welcome: "No active Events",
                });
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
  const handleBackClick = (event) => {
    event.preventDefault();
    history.push("/app");
  };
  const renderEventlist = () => {
    if (!connected) {
      return <h4 className="noevents">No Events to book</h4>;
    } else {
      return (
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
      );
    }
  };

  return (
    <div className="planing">
      <div className="eventcontainer">
        <div className="planingborder">
          <div className="planingdetails">
            <h1>{user.name}</h1>
            <h3>{user.welcome}</h3>
          </div>
        </div>
        <div className="planinglist">{renderEventlist()}</div>
      </div>
    </div>
  );
};

export default Planing;
