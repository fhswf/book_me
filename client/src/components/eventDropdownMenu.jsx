import React from "react";
import { Link, useHistory } from "react-router-dom";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { signout } from "../helpers/helpers";

import { deleteEvent } from "../helpers/services/event_services";
const iconConfig = <FontAwesomeIcon icon={faCog} />;

const EventDropdownMenu = ({ options }) => {
  const token = JSON.parse(localStorage.getItem("access_token"));
  const eventid = options;
  const history = useHistory();

  const handleOnDelete = (event) => {
    event.preventDefault();
    deleteEvent(token, eventid).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      }
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
