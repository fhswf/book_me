import React from "react";
import { useLocation, Link } from "react-router-dom";
import "../styles/finished.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
/*
import { Button } from "react-bootstrap";
*/
import { Button } from '@material-ui/core';
const iconCal = <FontAwesomeIcon icon={faCalendar} />;

const Finished = () => {
  const location = useLocation();
  console.log(location.state);
  const time = location.state.time;
  const event = location.state.event;
  const time1 = location.state.time.toString().split("G")[0];
  return (
    <div className="finished">
      <div className="wrapper">
        <div className="finishedbox">
          <p className="icon">{iconCal} Bookme</p>
          <h2 className="title">
            You booked the appointment "{event.name}" on
          </h2>
          <br></br>
          <p className="timestring">{time1}</p>
          <br></br>
          <Button className="finishedbtn" as={Link} to="/landing">
            Thank you for using Bookme!
          </Button>
          <br></br>

          <br></br>
        </div>
      </div>
    </div>
  );
};
export default Finished;
