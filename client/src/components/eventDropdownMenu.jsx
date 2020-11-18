import React from "react";
import { Link } from "react-router-dom";

import { DropdownButton, Dropdown } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const iconConfig = <FontAwesomeIcon icon={faCog} />;

const EventDropdownMenu = ({ options }) => {
  const eventid = options;

  const handleOnDelete = (event) => {
    event.preventDefault();
    axios.delete(`${process.env.REACT_APP_API_URI}/events/deleteEvent`, {
      eventid,
    });
    window.location.reload(false);
  };

  return (
    <div>
      <DropdownButton
        className="mydropdown"
        variant="secondary"
        title={iconConfig}
        size="sm"
      >
        <Dropdown.Item as={Link} to={`/editevent/${eventid}`}>
          Edit
        </Dropdown.Item>
        <Dropdown.Divider></Dropdown.Divider>
        <Dropdown.Item onClick={handleOnDelete}>Delete</Dropdown.Item>
      </DropdownButton>
    </div>
  );
};

export default EventDropdownMenu;
