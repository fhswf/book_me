import React, { useState, useEffect } from "react";
import axios from "axios";

import AppNavbar from "../components/appNavbar";
import {
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  Button,
} from "react-bootstrap";
import Switch from "@material-ui/core/Switch";

const EditEvent = ({ match, history }) => {
  const eventID = match.params.id;

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    duration: "",
    isActive: false,
  });

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/events/getEventByID`, {
        params: { event: eventID },
      })
      .then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.data === null /*|| res.data.user != user*/) {
          history.push("/notfound");
        } else {
          setFormData({
            name: res.data.name,
            location: res.data.location,
            description: res.data.description,
            duration: res.data.duration,
            isActive: res.data.isActive,
          });
        }
      });
  });

  const { name, location, description, duration, isActive } = formData;

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setFormData({ ...formData });
    axios
      .post(`${process.env.REACT_APP_API_URI}/updateEvent`, {
        eventID,
        name,
        location,
        duration,
        description,
        isActive,
      })
      .then((res) => {
        return res.json("Success update");
      })
      .catch((err) => {});
  };
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.checked });
  };

  const handleOnChange = (text) => (event) => {
    setFormData({ ...formData, [text]: event.target.value });
  };

  return (
    <div>
      <AppNavbar />
      <h1>Edit Page, {match.params.id}</h1>
      <div className="addeventbox">
        <Form onSubmit={handleOnSubmit}>
          <FormGroup controlId="name">
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
            <InputGroup>
              <FormControl
                type="description"
                placeholder="Description"
                onChange={handleOnChange("description")}
                value={description}
              />
            </InputGroup>
          </FormGroup>
          <FormGroup controlId="duration">
            <InputGroup>
              <FormControl
                as="textarea"
                type="duration"
                placeholder="Duration"
                onChange={handleOnChange("duration")}
                value={duration}
              />
            </InputGroup>
          </FormGroup>
          <Switch
            checked={formData.isActive}
            onChange={handleChange}
            name="isActive"
          />

          <Button variant="primary" type="submit">
            Speichern
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditEvent;
