/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { signout } from "../helpers/helpers";

/*
import {
  Form,
  FormGroup,
  InputGroup,
  Button,
  FormControl,
  Accordion,
  Card,
} from "react-bootstrap";
*/
import {
  Accordion, Box, Button, Card, Container, Divider, FormControl, FormGroup, FormLabel, FormHelperText, Grid,
  Input, InputAdornment, InputLabel, MenuItem, Select, TextField, Paper
} from '@material-ui/core';
import { spacing } from '@material-ui/system';
import { makeStyles } from '@material-ui/core/styles';

import AppNavbar from "../components/appNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import { saveUserEvent } from "../helpers/services/event_services";

const iconArrowLeft = <FontAwesomeIcon icon={faArrowLeft} />;
const calendarCheck = <FontAwesomeIcon icon={faCalendarCheck} size="1x" />;

const useStyles = makeStyles((theme) => ({
  row: {
    alignItems: 'baseline'
  },
  label: {
    fontSize: '0.7rem',
    display: 'block',
    paddingTop: '2ex',
    marginBottom: '-1ex'
  },
  sep: {
    padding: '0.8ex'
  }
}
))

const TimesForDay = (props) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({ start: props.start, end: props.end });

  const cbStartTime = (event) => {
    setFormData({ ...formData, start: event.target.value });
    props.cbStartTime(event);
  }

  const cbEndTime = (event) => {
    setFormData({ ...formData, end: event.target.value });
    props.cbEndTime(event);
  }

  return (
    <>
      <Grid item xs={6}>
        <FormLabel className={classes.label} spacing="normal">{props.day}</FormLabel>
        <FormGroup row className={classes.row} spacing="normal">
          <TextField
            type="time"
            margin="normal"
            placeholder="Starttime"
            onChange={cbStartTime}
            value={formData.start}
          />
          <span className={classes.sep}>&nbsp;–&nbsp;</span>
          <TextField
            type="time"
            margin="normal"
            placeholder="Endtime"
            onChange={cbEndTime}
            value={formData.end}
          />
        </FormGroup>
      </Grid>
    </>
  )
}


const AddEvent = () => {
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("access_token"));

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
        saveUserEvent(
          token,
          name,
          location,
          description,
          true,
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
          endtimesun
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
            toast.error(err.response.data.errors);
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

  const handleOnChange = (type) => (event) => {
    if (type === "name" && eventurl === generateSlug(name)) {
      setFormData({
        ...formData,
        name: event.target.value,
        eventurl: generateSlug(event.target.value)
      });
    } else {
      setFormData({ ...formData, [type]: event.target.value });
    }
  };

  const handleBackClick = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const generateSlug = (str) => {
    let slug = str.replace(' ', '_').toLocaleLowerCase();
    console.log('generateSlug: %s %s', str, slug);
    return slug;
  }

  const theme = {
    spacing: value => value * 2,
  }


  return (
    <>
      <AppNavbar></AppNavbar>
      <Paper>
        <Container maxWidth="md">
          <h2>Add a New Event Type</h2>
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
                    value={name}
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
                      start={starttimemon}
                      end={endtimemon}
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

                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        label="Thu"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimethu")}
                        value={starttimethu}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimethu")}
                        value={endtimethu}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        label="Fri"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimefri")}
                        value={starttimefri}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimefri")}
                        value={endtimefri}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        label="Sat"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimesat")}
                        value={starttimesat}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimesat")}
                        value={endtimesat}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        label="Sun"
                        placeholder="Starttime"
                        onChange={handleOnChange("starttimesun")}
                        value={starttimesun}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        type="time"
                        placeholder="Endtime"
                        onChange={handleOnChange("endtimesun")}
                        value={endtimesun}
                      />
                    </Grid>

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

export default AddEvent;
