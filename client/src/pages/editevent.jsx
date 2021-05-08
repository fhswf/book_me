import React, { useState, useEffect } from "react";
import AppNavbar from "../components/appNavbar";

import "../styles/addevent.css";
import {
  Box, Button, Card, Container, Divider, FilledInput, FormControl, FormGroup, FormLabel, FormHelperText, Grid,
  Input, InputAdornment, InputLabel, MenuItem, Select, TextField, Paper
} from '@material-ui/core';

import Switch from "@material-ui/core/Switch";
import { toast } from "react-toastify";
import { getEventByID, updateEvent } from "../helpers/services/event_services";
import { useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { TimesForDay } from "../components/timesForDay";



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
        console.log('editEvent: getEventById returned %o', res.data);
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

  console.log('render: formData=%o', formData);
  return (
    <>
      <AppNavbar />

      <Paper>
        <Container maxWidth="md">
          <h2>Edit Event Type</h2>
          <form onSubmit={handleOnSubmit}>
            <Paper>
              <Box p="2em">
                <h3>Basic Information</h3>
                <div>
                  <TextField
                    id="event-title"
                    type="text"
                    label="Event title"
                    required
                    fullWidth
                    margin="normal"
                    onChange={handleOnChange("name")}
                    value={formData.name}
                  />
                </div>

                <div>
                  <TextField
                    label="Description"
                    helperText="What is the purpose of this appointment type?"
                    multiline
                    fullWidth
                    margin="normal"
                    onChange={handleOnChange("description")}
                    value={description}
                  />
                </div>

                <div>
                  <TextField
                    label="Location"
                    placeholder="Zoom Meeting"
                    helperText="Where does the meeting take place?"
                    defaultValue="Online via Zoom"
                    margin="normal"
                    onChange={handleOnChange("location")}
                    value={location}
                  />
                </div>

                <div>
                  <TextField
                    label="Event Slug"
                    margin="normal"
                    placeholder="awesome-meeting"
                    helperText="Customizable part of the URL"
                    onChange={handleOnChange("eventurl")}
                    value={eventurl}
                  />
                </div>
              </Box>

              <Divider variant="middle" />

              <Box pt="1em" m="2em">
                <h3>Duration</h3>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl margin="normal">
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
                  </Grid>

                  <Grid item container xs={12} md={8}>

                    <Grid item xs={12} sm={6}>
                      <FormControl component="span" margin="normal">
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
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl component="span" margin="normal">
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
                    </Grid>
                  </Grid>

                  <Divider variant="middle" />

                  <Grid item xs={12}>
                    <h3>Availability</h3>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl margin="normal">
                      <FilledInput
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
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
                  </Grid>



                  <Grid item container xs={12} spacing={3}>

                    <TimesForDay
                      day="Mon"
                      start={formData.starttimemon}
                      end={formData.endtimemon}
                      cbStartTime={handleOnChange("starttimemon")}
                      cbEndTime={handleOnChange("endtimemon")}
                    />

                    <TimesForDay
                      day="Tue"
                      start={starttimetue}
                      end={endtimetue}
                      cbStartTime={handleOnChange("starttimetue")}
                      cbEndTime={handleOnChange("endtimetue")}
                    />

                    <TimesForDay
                      day="Wed"
                      start={starttimewen}
                      end={endtimewen}
                      cbStartTime={handleOnChange("starttimewen")}
                      cbEndTime={handleOnChange("endtimewen")}
                    />

                    <TimesForDay
                      day="Thu"
                      start={starttimethu}
                      end={endtimethu}
                      cbStartTime={handleOnChange("starttimethu")}
                      cbEndTime={handleOnChange("endtimethu")}
                    />

                    <TimesForDay
                      day="Fri"
                      start={starttimefri}
                      end={endtimefri}
                      cbStartTime={handleOnChange("starttimefri")}
                      cbEndTime={handleOnChange("endtimefri")}
                    />

                    <TimesForDay
                      day="Sat"
                      start={starttimesat}
                      end={endtimesat}
                      cbStartTime={handleOnChange("starttimesat")}
                      cbEndTime={handleOnChange("endtimesat")}
                    />

                    <TimesForDay
                      day="Sun"
                      start={starttimesun}
                      end={endtimesun}
                      cbStartTime={handleOnChange("starttimesun")}
                      cbEndTime={handleOnChange("endtimesun")}
                    />

                  </Grid>
                </Grid>
              </Box>
            </Paper>
            <Button variant="primary" type="submit" className="save">Save</Button>
          </form>
        </Container>
      </Paper>
    </>
  );
};

export default EditEvent;
