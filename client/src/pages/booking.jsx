import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import StaticDatePicker from '@material-ui/lab/StaticDatePicker';
import Datepicker from "../components/datepicker";

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Button, Container, Link, Paper, Stepper, Step, StepLabel, TextField, Typography } from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { EventAvailable, HourglassFull, Room, Schedule } from '@material-ui/icons';

import { getUserByUrl } from "../helpers/services/user_services";
import { getEventByUrlAndUser } from "../helpers/services/event_services";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    padding: '16px 0 0',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  spacer: {
    flex: '1 1 auto',
  },
  instructions: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1.5em 1fr',
    gridGap: theme.spacing(1),
    alignItems: "center",
    verticalAlign: "center",
    paddingBottom: "16px",
  }
}));

const Booking = () => {
  const data = useParams();
  const history = useHistory();
  const classes = useStyles();


  const [user, setUser] = useState({
    name: "No User under that Link",
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [event, setEvent] = useState({
    name: "",
    location: "",
    duration: "",
  });
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    getUserByUrl(data.user_url)
      .then((res) => {
        if (res.data.length === 0) {
          history.push("/notfound");
        } else {
          setUser(res.data);
          getEventByUrlAndUser(res.data._id, data.url)
            .then((res) => {
              if (res.data == null) {
                history.push("/notfound");
              }
              if (res.data.isActive === false) {
                history.push("/notfound");
              } else {
                setEvent(res.data);
              }
            })
            .catch((err) => {
              return err;
            });
        }
      })
      .catch((err) => {
        return err;
      });
  }, [data.user_url, date.url]);

  const handleBackClick = (event) => {
    event.preventDefault();
    history.goBack();
  };

  const isStepOptional = (step) => {
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  const steps = ['Choose date', 'Choose time', 'Provide details'];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Typography variant="h3" gutterBottom>Schedule an appointment</Typography>
        <Avatar alt={user.name} src={user.picture_url} /> <Typography variant="h4" gutterBottom>{event.name}</Typography>
        <div className={classes.container}>

          <div className={classes.item}>
            <HourglassFull />
          </div>
          <div className={classes.item}>
            {event.duration + " minutes"}
          </div>

          <div className={classes.item}>
            <Room />
          </div>
          <div className={classes.item}>
            {event.location}
          </div>
        </div>


        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
          </Typography>
            <div className={classes.buttonWrapper}>
              <div className={classes.spacer} />
              <Button onClick={handleReset}>Reset</Button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography className={classes.instructions}>
              Step {activeStep + 1}
            </Typography>
            <div className={classes.buttonWrapper}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
            </Button>
              <div className={classes.spacer} />
              {isStepOptional(activeStep) && (
                <Button
                  color="inherit"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </React.Fragment>
        )}

        <Paper>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            value={date}
            onChange={(newValue) => {
              setDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} variant="standard" />}
          />
        </Paper>

        <div className="booking">
          <div className="bookingwrapper">
            <div className="booking-header">
              <h1><EventAvailable style={{ fontSize: 40 }} color="primary" /> Bookme</h1>
            </div>
            <div className="booking-container">
              <div className="leftpanel">
                <div className="leftpanelcontent">
                  <Link onClick={handleBackClick}>
                    back
                </Link>
                  <div className="profileinfo">
                    <Avatar alt={user.name} src={user.picture_url} />
                    <h4 className="username">{user.name}</h4>
                    <h1 className="eventname">{event.name}</h1>
                  </div>
                  <div className="eventinfo">
                    <p className="eventdata">
                      <HourglassFull /> {event.duration} Minutes
                  </p>
                    <p className="eventdata">
                      <Room /> {event.location}
                    </p>
                  </div>
                </div>
              </div>
              <div className="panel">
                <div className="wrappanel">
                  <h2 className="pickertitel">Choose a date</h2>
                  <Datepicker options={(data.url, event, user)}></Datepicker>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </LocalizationProvider>
  );
};

export default Booking;
