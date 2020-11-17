import React, { useState, useEffect } from "react";
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

const AddEvent = () => {
  const history = useHistory();

  const test = localStorage.getItem("user");
  var result = JSON.parse(test);
  var user = result._id;

  function compareTimes(array1, array2) {
    if (array1.starttime < array2.starttime) {
      return 1;
    }
    if (array1.starttime > array2.starttime) {
      return -1;
    }
    return 0;
  }
  const [times, setTimes] = useState({
    mon: [{ starttime: 800, endtime: 1700 }],
    tue: [{ starttime: 800, endtime: 1700 }],
    wen: [{ starttime: 800, endtime: 1700 }],
    thu: [{ starttime: 800, endtime: 1700 }],
    fri: [{ starttime: 800, endtime: 1700 }],
    sat: [{ starttime: 800, endtime: 1700 }],
    sun: [{ starttime: 800, endtime: 1700 }],
  });
  console.log(times);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    duration: "",
    user_url: "",
    isActive: false,
  });
  const { name, location, description, duration } = formData;
  const { mon, tue, wen, thu, fri, sat, sun } = times;

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setFormData({ ...formData });
    setTimes({
      mon: [
        { starttime: 900, endtime: 1000 },
        { starttime: 1000, endtime: 1100 },
      ],
    });
    axios
      .post(`${process.env.REACT_APP_API_URI}/addEvent`, {
        user,
        name,
        location,
        duration,
        description,
        isActive: true,
        mon,
        tue,
        wen,
        thu,
        fri,
        sat,
        sun,
      })
      .then((res) => {
        history.push("/app");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnChange = (text) => (event) => {
    setFormData({ ...formData, [text]: event.target.value });
  };

  return (
    <div>
      <AppNavbar></AppNavbar>
      <h1>Add event Page</h1>
      <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Click me!
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
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
                <FormGroup>
                  <div className="available">
                    <label>Verfügbar</label>
                    <Table>
                      <tbody>
                        <tr>
                          <th>Mo.</th>
                          <th>Di.</th>
                          <th>Mi.</th>
                          <th>Do.</th>
                          <th>Fr.</th>
                          <th>Sa.</th>
                          <th>So.</th>
                        </tr>
                        <tr>
                          <td>a</td>
                          <td>a</td>
                          <td>a</td>
                          <td>a</td>
                          <td>a</td>
                          <td>a</td>
                          <td>a</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
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
  );
};

export default AddEvent;
