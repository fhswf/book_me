import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import "../styles/details.css";
import { Form, InputGroup, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faArrowLeft,
  faMapMarkerAlt,
  faHourglass,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { insertIntoGoogle } from "../helpers/services/google_services";
import { toast, ToastContainer } from "react-toastify";

const iconEmail = <FontAwesomeIcon icon={faEnvelope} />;
const iconUser = <FontAwesomeIcon icon={faUser} />;
const iconArrowLeft = <FontAwesomeIcon icon={faArrowLeft} />;
const iconLocation = <FontAwesomeIcon icon={faMapMarkerAlt} />;
const iconTime = <FontAwesomeIcon icon={faHourglass} />;
const iconCal = <FontAwesomeIcon icon={faCalendar} />;

const Bookdetails = () => {
  const history = useHistory();
  const location = useLocation();
  const username = location.state.name;
  const userid = location.state.userid;
  const event = location.state.event;
  let time = location.state.selected.toString().split("G")[0];
  time = time.slice(0, -4);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
  });

  const { name, email, description } = formData;
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      insertIntoGoogle(userid, event, time, name, email, description).then(
        () => {
          toast.success("Event successfully booked!");
          history.push({
            pathname: `/booked`,
            state: { username, event, time },
          });
        }
      );
    } else {
      toast.error("Please fill in your name and email!");
    }
  };
  const handleChangeEvent = (text) => (event) => {
    setFormData({ ...formData, [text]: event.target.value });
  };
  const handleBackClick = (event) => {
    event.preventDefault();
    history.goBack();
  };
  return (
    <div className="details">
      <ToastContainer> </ToastContainer>
      <div className="detailswrapper">
        <div className="detailscontainer">
          <div className="detailsleft">
            <div className="leftpanelcontent">
              <a className="btn-back" onClick={handleBackClick}>
                {iconArrowLeft}
              </a>
              <div className="profileinfo">
                <h4 className="username">{username}</h4>
                <h1 className="eventname">{event.name}</h1>
              </div>
              <div className="eventinfo">
                <p className="eventdata">
                  {iconTime} {event.duration} Minutes
                </p>
                <p className="eventdata">
                  {iconLocation} {event.location}
                </p>
                <p className="time">{time}</p>
              </div>
            </div>
          </div>
          <div className="detailsright">
            <div>
              <h4>{iconCal} Bookme</h4>
            </div>
            <div className="wrapform">
              <Form onSubmit={handleOnSubmit}>
                <Form.Group controlId="name">
                  <Form.Label>Name*</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>{iconUser}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="name"
                      placeholder="Name"
                      onChange={handleChangeEvent("name")}
                      value={name}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>E-Mail*</Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>{iconEmail}</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      onChange={handleChangeEvent("email")}
                      value={email}
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Description</Form.Label>
                  <InputGroup>
                    <Form.Control
                      as="textarea"
                      type="description"
                      placeholder="Anything that could be helpful for me"
                      onChange={handleChangeEvent("description")}
                      value={description}
                    />
                  </InputGroup>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Confirm
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookdetails;
