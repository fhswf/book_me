import React, { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";

import {
  Form,
  FormGroup,
  InputGroup,
  Button,
  FormControl,
  Table,
  Accordion,
  Card,
} from "react-bootstrap";

import "../styles/addevent.css";

import AppNavbar from "../components/appNavbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
const iconArrowLeft = <FontAwesomeIcon icon={faArrowLeft} />;
const calendarCheck = <FontAwesomeIcon icon={faCalendarCheck} />;

const AddEvent = () => {
  const history = useHistory();

  const test = localStorage.getItem("user");
  var result = JSON.parse(test);
  var user = result._id;

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    duration: "10",
    eventurl: "",
    isActive: false,
  });
  const { name, location, description, eventurl } = formData;

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setFormData({ ...formData });
    axios
      .post(`${process.env.REACT_APP_API_URI}/events/addEvent`, {
        user,
        name,
        location,
        description,
        isActive: true,
        eventurl,
      })
      .then((res) => {
        toast.success(res.data.msg);
      })
      .catch((err) => {
        toast.error(err.response.data.errors);
      });
  };

  const handleOnChange = (text) => (event) => {
    if (text === "name") {
      setFormData({
        ...formData,
        name: event.target.value,
        eventurl: event.target.value,
      });

      //  setFormData({ ...formData, url: name });
    } else {
      setFormData({ ...formData, [text]: event.target.value });
    }
  };
  const handleBackClick = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div className="addevent">
      <AppNavbar></AppNavbar>
      <div className="mywrapper">
        <div className="header">
          <div className="subheader">
            <div className="header-back">
              <a className="btn-back" onClick={handleBackClick}>
                {iconArrowLeft}
              </a>
            </div>
            <div className="headertitel">
              <h2>Create a new event</h2>
            </div>
          </div>
        </div>

        <Accordion defaultActiveKey="0" className="addeventaccordion">
          <Card>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
              Event Details {calendarCheck}
            </Accordion.Toggle>

            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Form onSubmit={handleOnSubmit} className="form">
                  <FormGroup controlId="name">
                    <Form.Label>Eventname*</Form.Label>
                    <InputGroup>
                      <FormControl
                        type="name"
                        placeholder="Event titel"
                        onChange={handleOnChange("name")}
                        value={name}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup controlId="locaiton">
                    <Form.Label>Location</Form.Label>
                    <InputGroup>
                      <FormControl
                        type="location"
                        placeholder="Location"
                        onChange={handleOnChange("location")}
                        value={location}
                      />
                    </InputGroup>
                  </FormGroup>

                  <FormGroup controlId="description">
                    <Form.Label>Description</Form.Label>
                    <InputGroup>
                      <FormControl
                        as="textarea"
                        type="description"
                        placeholder="Description"
                        onChange={handleOnChange("description")}
                        value={description}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup controlId="eventurl">
                    <Form.Label>Eventlink*</Form.Label>
                    <InputGroup>
                      <FormControl
                        type="eventurl"
                        placeholder="Eventlink"
                        onChange={handleOnChange("eventurl")}
                        value={eventurl}
                      />
                    </InputGroup>
                  </FormGroup>
                  <Button variant="primary" type="submit">
                    Speichern
                  </Button>
                </Form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    </div>
  );
};

export default AddEvent;
