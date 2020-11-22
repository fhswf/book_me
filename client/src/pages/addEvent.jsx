import React, { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import {
  Form,
  FormGroup,
  InputGroup,
  Button,
  FormControl,
  Accordion,
  Card,
} from "react-bootstrap";

import "../styles/addevent.css";

import AppNavbar from "../components/appNavbar";

import Available from "../components/available";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

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
    calendardays: "true",
    duration: "15",
    rangedays: "30",
    eventurl: "",
    isActive: "false",
    bufferafter: 0,
    bufferbefore: 0,
    starttimemon: "",
    starttimefri: "",
    endtimesun: "",
  });
  const {
    name,
    location,
    description,
    eventurl,
    rangedays,
    duration,
    calendardays,
    bufferafter,
    bufferbefore,
    starttimemon,
    endtimemon,
    starttimetue,
    endtimetue,
    starttimewen,
    endtimewen,
    starttimethu,
    endtimethu,
    starttimefri,
    endtimefri,
    starttimesat,
    endtimesat,
    starttimesun,
    endtimesun,
  } = formData;

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setFormData({ ...formData });
    console.log({ ...formData });

    axios
      .post(`${process.env.REACT_APP_API_URI}/events/addEvent`, {
        user,
        name,
        location,
        description,
        isActive: true,
        eventurl,
        rangedays,
        calendardays,
        bufferbefore,
        bufferafter,
        duration,
        starttimemon,
        endtimemon,
        starttimetue,
        endtimetue,
        starttimewen,
        endtimewen,
        starttimethu,
        endtimethu,
        starttimefri,
        endtimefri,
        starttimesat,
        endtimesat,
        starttimesun,
        endtimesun,
      })
      .then((res) => {
        toast.success(res.data.msg);
        history.push("/app");
      })
      .catch((err) => {
        toast.error(err.response.data.errors);
      });
  };

  const handleOnChange = (type) => (event) => {
    if (type === "name") {
      setFormData({
        ...formData,
        name: event.target.value,
        eventurl: event.target.value,
      });
    } else {
      setFormData({ ...formData, [type]: event.target.value });
      console.log(starttimemon);
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
              Add a new Event {calendarCheck}
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
                    <Form.Text className="text-muted">
                      The displayed name of the event.
                    </Form.Text>
                  </FormGroup>
                  <FormGroup>
                    <Form.Label>Location</Form.Label>
                    <InputGroup>
                      <FormControl
                        placeholder="Location"
                        onChange={handleOnChange("location")}
                        value={location}
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Where does this event happen.
                    </Form.Text>
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
                    <Form.Text className="text-muted">
                      The link where you can book this event.
                    </Form.Text>
                  </FormGroup>
                  <FormGroup controlId="rangedays">
                    <Form.Label>Daterange</Form.Label>
                    <div className="displayrow">
                      <InputGroup className="rangedays">
                        <FormControl
                          type="rangedays"
                          onChange={handleOnChange("rangedays")}
                          value={rangedays}
                        />
                      </InputGroup>
                      <InputGroup>
                        <Form.Control
                          as="select"
                          type="calendardays"
                          onChange={handleOnChange("calendardays")}
                          value={calendardays}
                        >
                          <option value={true}>Calendar days</option>
                          <option value={false}>Workingdays</option>
                        </Form.Control>
                      </InputGroup>
                    </div>

                    <Form.Text className="text-muted">
                      Set a daterange for the event.
                    </Form.Text>
                  </FormGroup>
                  <FormGroup controlId="duration">
                    <Form.Label>Duration</Form.Label>
                    <div className="displayrow">
                      <InputGroup className="minutes">
                        <FormControl
                          type="duration"
                          onChange={handleOnChange("duration")}
                          value={duration}
                        />
                      </InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text>Minutes</InputGroup.Text>
                      </InputGroup.Prepend>
                    </div>
                    <Form.Text className="text-muted">
                      How long does this event go.
                    </Form.Text>
                  </FormGroup>
                  <FormGroup controlId="buffer">
                    <Form.Label>Buffer Before</Form.Label>
                    <Form.Label className="labelbuffer">
                      Buffer After
                    </Form.Label>

                    <div className="displayrow">
                      <InputGroup>
                        <FormControl
                          as="select"
                          type="buffer before"
                          onChange={handleOnChange("bufferbefore")}
                          value={bufferbefore}
                        >
                          <option value="0">0 Min</option>
                          <option value="5">5 Min</option>
                          <option value="10">10 Min</option>
                          <option value="15">15 Min</option>
                          <option value="30">30 Min</option>
                          <option value="45">45 Min</option>
                          <option value="60">1 h</option>
                          <option value="90">1h 30min</option>
                          <option value="120">2h</option>
                        </FormControl>
                      </InputGroup>
                      <InputGroup className="bufferafter">
                        <FormControl
                          as="select"
                          type="duration"
                          onChange={handleOnChange("bufferafter")}
                          value={bufferafter}
                        >
                          <option value="0">0 Min</option>
                          <option value="5">5 Min</option>
                          <option value="10">10 Min</option>
                          <option value="15">15 Min</option>
                          <option value="30">30 Min</option>
                          <option value="45">45 Min</option>
                          <option value="60">1 h</option>
                          <option value="90">1h 30min</option>
                          <option value="120">2h</option>
                        </FormControl>
                      </InputGroup>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Form.Label>available</Form.Label>

                    <ul>
                      <li>
                        Set ur availabillty for this Event. In the Format: HH:mm
                        or H:mm
                      </li>
                      <li className="listrow">
                        <InputGroup>
                          <InputGroup.Prepend className="availableprep">
                            <InputGroup.Text id="basic-addon3">
                              Mon
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            type="starttimemon"
                            placeholder="Starttime"
                            onChange={handleOnChange("starttimemon")}
                            value={starttimemon}
                          />
                        </InputGroup>
                        <InputGroup>
                          <FormControl
                            type="endtimemon"
                            placeholder="Endtime"
                            onChange={handleOnChange("endtimemon")}
                            value={endtimemon}
                          />
                        </InputGroup>
                      </li>
                      <li className="listrow">
                        <InputGroup>
                          <InputGroup.Prepend className="availableprep">
                            <InputGroup.Text id="basic-addon3">
                              Tue
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            type="starttimetue"
                            placeholder="Starttime"
                            onChange={handleOnChange("starttimetue")}
                            value={starttimetue}
                          />
                        </InputGroup>
                        <InputGroup>
                          <FormControl
                            type="endtimetue"
                            placeholder="Endtime"
                            onChange={handleOnChange("endtimetue")}
                            value={endtimetue}
                          />
                        </InputGroup>
                      </li>
                      <li className="listrow">
                        <InputGroup>
                          <InputGroup.Prepend className="availableprep">
                            <InputGroup.Text id="basic-addon3">
                              Wen
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            type="starttimewen"
                            placeholder="Starttime"
                            onChange={handleOnChange("starttimewen")}
                            value={starttimewen}
                          />
                        </InputGroup>
                        <InputGroup>
                          <FormControl
                            type="endtimewen"
                            placeholder="Endtime"
                            onChange={handleOnChange("endtimewen")}
                            value={endtimewen}
                          />
                        </InputGroup>
                      </li>
                      <li className="listrow">
                        {" "}
                        <InputGroup>
                          <InputGroup.Prepend className="availableprep">
                            <InputGroup.Text id="basic-addon3">
                              Thu
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            type="starttimethu"
                            placeholder="Starttime"
                            onChange={handleOnChange("starttimethu")}
                            value={starttimethu}
                          />
                        </InputGroup>
                        <InputGroup>
                          <FormControl
                            type="endtimethu"
                            placeholder="Endtime"
                            onChange={handleOnChange("endtimethu")}
                            value={endtimethu}
                          />
                        </InputGroup>
                      </li>
                      <li className="listrow">
                        {" "}
                        <InputGroup>
                          <InputGroup.Prepend className="availableprep">
                            <InputGroup.Text id="basic-addon3">
                              Fri
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            type="starttimefri"
                            placeholder="Starttime"
                            onChange={handleOnChange("starttimefri")}
                            value={starttimefri}
                          />
                        </InputGroup>
                        <InputGroup>
                          <FormControl
                            type="endtimefri"
                            placeholder="Endtime"
                            onChange={handleOnChange("endtimefri")}
                            value={endtimefri}
                          />
                        </InputGroup>
                      </li>
                      <li className="listrow">
                        {" "}
                        <InputGroup>
                          <InputGroup.Prepend className="availableprep">
                            <InputGroup.Text id="basic-addon3">
                              Sat
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            type="starttimesat"
                            placeholder="Starttime"
                            onChange={handleOnChange("starttimesat")}
                            value={starttimesat}
                          />
                        </InputGroup>
                        <InputGroup>
                          <FormControl
                            type="endtimesat"
                            placeholder="Endtime"
                            onChange={handleOnChange("endtimesat")}
                            value={endtimesat}
                          />
                        </InputGroup>
                      </li>
                      <li className="listrow">
                        <InputGroup>
                          <InputGroup.Prepend className="availableprep">
                            <InputGroup.Text id="basic-addon3">
                              Sun
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            type="starttimesun"
                            placeholder="Starttime"
                            onChange={handleOnChange("starttimesun")}
                            value={starttimesun}
                          />
                        </InputGroup>
                        <InputGroup>
                          <FormControl
                            type="endtimesun"
                            placeholder="Endtime"
                            onChange={handleOnChange("endtimesun")}
                            value={endtimesun}
                          />
                        </InputGroup>
                      </li>
                    </ul>
                  </FormGroup>

                  <Available />

                  <Button variant="primary" type="submit">
                    Save
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
