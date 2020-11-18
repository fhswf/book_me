import React, { useState, useEffect } from "react";
import axios from "axios";
import Dropdown from "./eventDropdownMenu";
import "../styles/eventlist.css";
import { Card } from "react-bootstrap";

function EventList() {
  const localuser = localStorage.getItem("user");
  var result = JSON.parse(localuser);
  var userid = result._id;
  const [events, setEvents] = useState([]);

  function changeActive(active) {
    if (active === true) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/events/getEvents`, {
        params: { user: userid },
      })
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userid]);

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
