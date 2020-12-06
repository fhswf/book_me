import React, { useState, useEffect } from "react";
import AppNavbar from "../components/appNavbar";

import "../styles/addevent.css";
import {
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  Button,
  Accordion,
  Card,
} from "react-bootstrap";
import Switch from "@material-ui/core/Switch";
import { toast } from "react-toastify";
import { getEventByID, updateEvent } from "../helpers/services/event_services";
import { useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

const iconArrowLeft = <FontAwesomeIcon icon={faArrowLeft} />;

const EditEvent = ({ match }) => {
  const eventID = match.params.id;
  const token = JSON.parse(localStorage.getItem("access_token"));
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    duration: "",
    isActive: false,
    eventurl: "",
    rangedays: 0,
    calendardays: "",
    bufferafter: "",
    bufferbefore: "",
    starttimemon: "",
    starttimetue: "",
    starttimewen: "",
    starttimethu: "",
    starttimefri: "",
    starttimesat: "",
    starttimesun: "",
    endtimemon: "",
    endtimetue: "",
    endtimewen: "",
    endtimethu: "",
    endtimefri: "",
    endtimesat: "",
    endtimesun: "",
  });

  useEffect(() => {
    getEventByID(token, eventID).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      } else {
        setFormData({
          name: res.data.name,
          location: res.data.location,
          description: res.data.description,
          duration: res.data.duration,
          isActive: res.data.isActive,
          eventurl: res.data.url,
          rangedays: res.data.rangedays,
          bufferafter: res.data.bufferafter,
          bufferbefore: res.data.bufferbefore,
          calendardays: res.data.calendardays,
          starttimemon: res.data.available.mon[0],
          starttimetue: res.data.available.tue[0],
          starttimewen: res.data.available.wen[0],
          starttimethu: res.data.available.thu[0],
          starttimefri: res.data.available.fri[0],
          starttimesat: res.data.available.sat[0],
          starttimesun: res.data.available.sun[0],
          endtimemon: res.data.available.mon[1],
          endtimetue: res.data.available.tue[1],
          endtimewen: res.data.available.wen[1],
          endtimethu: res.data.available.thu[1],
          endtimefri: res.data.available.fri[1],
          endtimesat: res.data.available.sat[1],
          endtimesun: res.data.available.sun[1],
        });
      }
    });
  }, []);

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
    isActive,
  } = formData;

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setFormData({ ...formData });
    if (name && eventurl) {
      if (
        compareTimes(starttimefri, endtimefri) &&
        compareTimes(starttimesat, endtimesat) &&
        compareTimes(starttimesun, endtimesun) &&
        compareTimes(starttimemon, endtimemon) &&
        compareTimes(starttimetue, endtimetue) &&
        compareTimes(starttimewen, endtimewen) &&
        compareTimes(starttimethu, endtimethu)
      ) {
        updateEvent(
          token,
          eventID,
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
          isActive
        )
          .then((res) => {
            if (res.data.success === false) {
              signout();
              history.push("/landing");
            } else {
              toast.success(res.data.msg);
              history.push("/app");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        toast.error("Starttime cant be later than endtime");
      }
    } else {
      toast.error("Please fill in all required fields!");
    }
  };
  const compareTimes = (start, end) => {
    if (Date.parse("01/01/2011 " + start) > Date.parse("01/01/2011 " + end)) {
      return false;
    } else {
      return true;
    }
  };
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.checked });
  };

  const handleOnChange = (type) => (event) => {
    setFormData({ ...formData, [type]: event.target.value });
  };
  const handleBackClick = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <div className="addevent">
      <AppNavbar />
      <div className="mywrapper">
        <div className="header">
          <div className="subheader">
            <div className="header-back">
              <a className="btn-back" onClick={handleBackClick}>
                {iconArrowLeft}
              </a>
            </div>
            <div className="headertitel">
              <h2>Edit this event</h2>
            </div>
          </div>
        </div>
        <Accordion defaultActiveKey="0" className="addeventaccordion">
          <Card>
            <Accordion.Toggle as={Card.Header} variant="link" eventKey="0">
              Edit Event: {name}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Form onSubmit={handleOnSubmit} className="form">
                  <Form.Label>Active</Form.Label>
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange}
                    name="isActive"
                  />
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
                    </div>
                    <Form.Text className="text-muted">
                      How many days in the future is this event bookable
                    </Form.Text>
                  </FormGroup>
                  <Form.Group controlId="daterange">
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
                    <Form.Text className="text-muted">
                      Available on weekends?
                    </Form.Text>
                  </Form.Group>
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
                          <option value={0}>0m</option>
                          <option value={5}>5m</option>
                          <option value={10}>10m</option>
                          <option value={15}>15m</option>
                          <option value={30}>30m</option>
                          <option value={45}>45m</option>
                          <option value={60}>1H</option>
                          <option value={90}>1H 30m</option>
                          <option value={120}>2H</option>
                        </FormControl>
                      </InputGroup>
                      <InputGroup className="bufferafter">
                        <FormControl
                          as="select"
                          type="duration"
                          onChange={handleOnChange("bufferafter")}
                          value={bufferafter}
                        >
                          <option value={0}>0m</option>
                          <option value={5}>5m</option>
                          <option value={10}>10m</option>
                          <option value={15}>15m</option>
                          <option value={30}>30m</option>
                          <option value={45}>45m</option>
                          <option value={60}>1H</option>
                          <option value={90}>1H 30m</option>
                          <option value={120}>2H</option>
                        </FormControl>
                      </InputGroup>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Form.Label>Available times</Form.Label>
                    <ul className="availabletimes">
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
                        <InputGroup className="endinput">
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
                        <InputGroup className="endinput">
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
                        <InputGroup className="endinput">
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
                        <InputGroup className="endinput">
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
                        <InputGroup className="endinput">
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
                        <InputGroup className="endinput">
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
                        <InputGroup className="endinput">
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
                  <Button variant="primary" type="submit" className="save">
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

export default EditEvent;
