import React, { useState, useEffect } from "react";
import AppNavbar from "../components/appNavbar";

import "../styles/addevent.css";
/*
import {
  Form,
  FormControl,
  FormGroup,
  InputGroup,
  Button,
  Accordion,
  Card,
} from "react-bootstrap";
*/
import { Accordion, Button, Card, FormControl, FormControlLabel, FormLabel, FormHelperText, Input, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';


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
                <form onSubmit={handleOnSubmit} className="form">

                  <FormControlLabel
                    control={<Switch
                      checked={formData.isActive}
                      onChange={handleChange}
                      name="isActive"
                    />}
                    label="Secondary"
                  />

                  <TextField
                    type="text"
                    label="Event titel"
                    onChange={handleOnChange("name")}
                    value={name}
                  />

                  <TextField
                    label="Location"
                    onChange={handleOnChange("location")}
                    value={location}
                  />

                  <TextField
                    label="Description"
                    multiline
                    onChange={handleOnChange("description")}
                    value={description}
                  />

                  <TextField
                    label="Event Slug"
                    placeholder="awesome-meeting"
                    helperText="Customizable part of the URL"
                    onChange={handleOnChange("eventurl")}
                    value={eventurl}
                  />

                  <FormControl>
                    <Input
                      id="rangedays"
                      value={rangedays}
                      type="number"
                      onChange={handleOnChange('rangedays')}
                      endAdornment={<InputAdornment position="end">Days</InputAdornment>}
                      aria-describedby="rangedays-helper-text"
                      inputProps={{
                        'aria-label': 'days',
                      }}
                    />
                    <FormHelperText id="rangedays-helper-text">How many days in advance is this event available?</FormHelperText>
                  </FormControl>

                  <FormControl>
                    <InputLabel id="weekend-label">Available on</InputLabel>
                    <Select
                      labelId="weekend-label"
                      id="weekend"
                      value={calendardays}
                      onChange={handleOnChange("calendardays")}
                    >

                      <MenuItem value={false}>Working Days</MenuItem>
                      <MenuItem value={true}>All Days</MenuItem>
                    </Select>
                    <FormHelperText>Is this event avalable on weekends?</FormHelperText>
                  </FormControl>

                  <FormControl>
                    <InputLabel id="duration-label">Duration</InputLabel>
                    <Select
                      labelId="duration-label"
                      id="duration"
                      value={duration}
                      onChange={handleOnChange("duration")}
                    >

                      <MenuItem value={15}>15 min</MenuItem>
                      <MenuItem value={30}>30 min</MenuItem>
                      <MenuItem value={45}>45 min</MenuItem>
                      <MenuItem value={60}>60 min</MenuItem>
                    </Select>
                    <FormHelperText>How long is this event?</FormHelperText>
                  </FormControl>



                  <FormControl component="fieldset">
                    <FormLabel component="legend">Add buffer before and after event</FormLabel>

                    <FormControl>
                      <InputLabel id="buffer-before-label">Buffer before</InputLabel>
                      <Select
                        labelId="buffer-before-label"
                        id="buffer-before"
                        value={bufferbefore}
                        onChange={handleOnChange("bufferbefore")}
                      >

                        <MenuItem value={0}>none</MenuItem>
                        <MenuItem value={5}>5 min</MenuItem>
                        <MenuItem value={15}>15 min</MenuItem>
                        <MenuItem value={30}>30 min</MenuItem>
                        <MenuItem value={60}>60 min</MenuItem>
                      </Select>
                      <FormHelperText>Buffer berfore this event</FormHelperText>
                    </FormControl>

                    <FormControl>
                      <InputLabel id="buffer-after-label">Buffer after</InputLabel>
                      <Select
                        labelId="buffer-after-label"
                        id="buffer-after"
                        value={bufferafter}
                        onChange={handleOnChange("bufferafter")}
                      >

                        <MenuItem value={0}>none</MenuItem>
                        <MenuItem value={5}>5 min</MenuItem>
                        <MenuItem value={15}>15 min</MenuItem>
                        <MenuItem value={30}>30 min</MenuItem>
                        <MenuItem value={60}>60 min</MenuItem>
                      </Select>
                      <FormHelperText>Buffer after this event</FormHelperText>
                    </FormControl>
                  </FormControl>

                  <FormControl component="fieldset">
                    <FormLabel component="legend">Available times</FormLabel>

                    <div>
                      <TextField
                        type="time"
                        label="Mon"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimemon")}
                        value={starttimemon}
                      />

                      <TextField
                        type="time"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimemon")}
                        value={endtimemon}
                      />
                    </div>

                    <div>
                      <TextField
                        type="time"
                        label="Tue"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimetue")}
                        value={starttimetue}
                      />

                      <TextField
                        type="endtimetue"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimetue")}
                        value={endtimetue}
                      />
                    </div>

                    <div>
                      <TextField
                        type="time"
                        label="Wed"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimewen")}
                        value={starttimewen}
                      />

                      <TextField
                        type="time"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimewen")}
                        value={endtimewen}
                      />
                    </div>

                    <div>
                      <TextField
                        type="time"
                        label="Thu"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimethu")}
                        value={starttimethu}
                      />

                      <TextField
                        type="time"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimethu")}
                        value={endtimethu}
                      />
                    </div>

                    <div>
                      <TextField
                        type="time"
                        label="Fri"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimefri")}
                        value={starttimefri}
                      />

                      <TextField
                        type="time"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimefri")}
                        value={endtimefri}
                      />
                    </div>

                    <div>
                      <TextField
                        type="time"
                        label="Sat"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimesat")}
                        value={starttimesat}
                      />

                      <TextField
                        type="time"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimesat")}
                        value={endtimesat}
                      />
                    </div>

                    <div>
                      <TextField
                        type="time"
                        label="Sun"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimesun")}
                        value={starttimesun}
                      />

                      <TextField
                        type="time"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimesun")}
                        value={endtimesun}
                      />

                    </div>
                  </FormControl>
                  <Button variant="primary" type="submit" className="save">
                    Save
                  </Button>

                </form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
    </div>
  );
};

export default EditEvent;
