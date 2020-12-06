import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import Dropdown from "./eventDropdownMenu";
import "../styles/eventlist.css";
import { Card } from "react-bootstrap";
import { getUsersEvents } from "../helpers/services/event_services";

function EventList() {
  const token = JSON.parse(localStorage.getItem("access_token"));
  const history = useHistory();

  const [events, setEvents] = useState([]);

  function changeActive(active) {
    if (active === true) {
      return true;
    } else {
      return false;
    }
  }
  useEffect(() => {
    getUsersEvents(token).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      } else {
        setEvents(res.data);
      }
    });
  }, [token, history]);

  return (
    <div>
      <div className="eventlist">
        <div className="reihe">
          {events.map((events) => (
            <div className="spalte" key={events._id}>
              <div
                className={
                  changeActive(events.isActive) ? "isactive" : "isnotactive"
                }
              ></div>
              <Card>
                <Card.Header>
                  <Dropdown className="mydropdown" options={events._id} />
                </Card.Header>
                <Card.Body>{events.name}</Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventList;
