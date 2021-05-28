import React, { useState, useEffect, FormEvent } from "react";
import { useHistory, useParams } from "react-router-dom";
import { StaticDatePicker, PickersDay } from "@material-ui/lab";

import {
  createMuiTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
} from "@material-ui/core";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import { HourglassFull, Room } from "@material-ui/icons";

import { getUserByUrl } from "../helpers/services/user_services";
import { getEventByUrlAndUser } from "../helpers/services/event_services";
import { getAvailableTimes } from "../helpers/services/event_services";
import clsx from "clsx";
import { addMonths, addMinutes, format } from "date-fns";
import BookDetails from "../components/BookDetails";
import { insertIntoGoogle } from "../helpers/services/google_services";
import { EMPTY_EVENT, Event, Slot } from "@fhswf/bookme-common";
import { UserDocument } from "../helpers/UserDocument";

const theme = createMuiTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          width: "100%",
        },
      },
    },
    /*
    MuiPickersDay: {
      styleOverrides: {
        root: {
          borderRadius: "50%",
        },
      },
    },*/
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: "h3",
          h2: "h4",
          h3: "h5",
          h4: "h5",
          h5: "h6",
          h6: "h6",
        },
      },
    },
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    //fontSize: 12,
  },
});

const useStyles = makeStyles((theme) => ({
  picker: {
    "& button": {
      borderRadius: "50%",
      "&.highlight": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover, &:focus": {
          backgroundColor: theme.palette.primary.light,
        },
      },
    },
  },

  date: {
    borderRadius: "50%",
  },
  header: {
    "&.MuiTypography-root": {
      marginTop: "16px",
      marginBottom: "8px",
    },
  },
  root: {
    width: "100%",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    padding: "16px 0 0",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  spacer: {
    flex: "1 1 auto",
  },
  instructions: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1.5em 1fr",
    gridGap: theme.spacing(1),
    alignItems: "center",
    paddingBottom: "16px",
  },
  item: {},
  slots: {
    maxHeight: "300px",
  },
}));

const Booking = (props: any) => {
  const data = useParams<{ user_url: string; url: string }>();
  const history = useHistory();
  const classes = useStyles();

  type Details = { name: string; email: string; description: string };

  const [user, setUser] = useState<UserDocument>();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [event, setEvent] = useState<Event>(EMPTY_EVENT);
  const [selectedDate, setDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedTime, setTime] = useState<Date>();
  const [details, setDetails] = useState<Details>();

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
  }, [data.url, data.user_url, history, selectedDate]);

  const isStepOptional = (step: number) => {
    return false;
  };

  const isStepSkipped = (step: number) => {
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

  const handleMonthChange = (date: Date) => {};

  const handleDateChange = (newValue: Date) => {
    console.log("date: %o", newValue);
    if (user) {
      getAvailableTimes(newValue, addMonths(newValue, 1), event.url, user._id)
        .then((slots) => {
          console.log("slots: %j", slots);
          //setSlots(slots);
        })
        .catch((err) => {
          console.error("failed to get available times");
        });
      setActiveStep(1);
      setDate(newValue);
    }
  };

  const steps = ["Choose date", "Choose time", "Provide details"];

  const checkDay = (date: Date) => {
    if (!event.available) {
      return false;
    } else {
      return (
        date > new Date() &&
        event.available[date.getDay() as Day].length > 0 &&
        event.available[date.getDay() as Day][0].start !== ""
      );
    }
  };

  const renderPickerDay = (
    date: Date,
    selectedDates: any,
    pickersDayProps: any
  ) => {
    return (
      <PickersDay
        {...pickersDayProps}
        disableMargin
        disabled={!checkDay(date)}
        className={clsx({
          [classes.date]: true,
          highlight: checkDay(date),
        })}
      />
    );
  };

  const getTimes = () => {
    if (slots) {
      let times = [];
      for (let slot of slots) {
        console.log("Slot: %o", slot);
        let start = new Date(slot.start);
        let end = new Date(slot.end);
        console.log("start: %s, end: %s", start, end);
        let s = start;
        while (s < end) {
          times.push(s);
          s = addMinutes(s, event.duration);
        }
      }
      return times;
    } else {
      return [];
    }
  };

  const handleTime =
    (time: Date) => (event: React.MouseEvent<HTMLButtonElement>) => {
      console.log("time: %o", time);
      setActiveStep(2);
      setTime(time);
    };

  const renderSlots = () => {
    console.log("renderSlots: %o", slots);
    const times = getTimes();
    return (
      <>
        <Grid
          className={classes.slots}
          spacing={2}
          container
          direction="column"
          alignItems="flex-start"
        >
          {times.map((time) => (
            <Grid item>
              <Button variant="contained" onClick={handleTime(time)}>
                {format(time, "HH:mm")}
              </Button>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  const handleDetailChange = (details: Details) => {
    console.log("details: %o", details);
    setDetails(details);
  };

  const handleSubmit = (e: FormEvent) => {
    console.log("onSubmit");
    e.preventDefault();
    if (user && details) {
      insertIntoGoogle(
        user._id,
        event,
        selectedTime,
        details.name,
        details.email,
        details.description
      ).then(() => {
        //toast.success("Event successfully booked!");
        history.push({
          pathname: `/booked`,
          state: { userid: user._id, event, time: selectedTime },
        });
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Container>
          <Typography variant="h3" component="h1" gutterBottom>
            Schedule an appointment
          </Typography>

          <div className={classes.container}>
            <div className={classes.item}>
              <Avatar
                sx={{ width: 24, height: 24 }}
                alt={user ? user.name : ""}
                src={user ? user.picture_url : ""}
              />
            </div>
            <div className={classes.item}>{event.name}</div>
            <div className={classes.item}>
              <HourglassFull />
            </div>
            <div className={classes.item}>{event.duration + " minutes"}</div>

            <div className={classes.item}>
              <Room />
            </div>
            <div className={classes.item}>{event.location}</div>
          </div>

          <Paper>
            <form onSubmit={handleSubmit}>
              <Box pt="1em" m="2em">
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps: any = {};
                    const labelProps: any = {};
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

                    {activeStep === steps.length - 1 ? (
                      <Button variant="contained" type="submit">
                        Book appointment
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </React.Fragment>

                <Grid container spacing={2}>
                  <Grid item hidden={activeStep != 0}>
                    <StaticDatePicker
                      displayStaticWrapperAs="desktop"
                      value={selectedDate}
                      className={classes.picker}
                      onChange={handleDateChange}
                      onMonthChange={handleMonthChange}
                      renderDay={renderPickerDay}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" />
                      )}
                    />
                  </Grid>

                  <Grid item hidden={activeStep != 1}>
                    {renderSlots()}
                  </Grid>

                  {activeStep > 1 ? (
                    <Grid item>
                      {user ? (
                        <BookDetails
                          userid={user._id}
                          username={user.name}
                          event={event}
                          start={selectedTime}
                          end={addMinutes(selectedTime, event.duration)}
                          onChange={handleDetailChange}
                        />
                      ) : (
                        ""
                      )}
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </Box>
            </form>
          </Paper>
        </Container>
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default Booking;