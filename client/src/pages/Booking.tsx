/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useTransition, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { StaticDatePicker, PickersDay, PickersDayProps } from '@mui/x-date-pickers';


import {
  styled
} from "@mui/material/styles";

import {
  Box,
  Button,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
} from "@mui/material";

import Grid from '@mui/material/Grid2';


import { getUserByUrl } from "../helpers/services/user_services";
import { getEventByUrlAndUser, getAvailableTimes } from "../helpers/services/event_services";
import clsx from "clsx";
import { Day, addMonths, addDays, addMinutes, format, startOfDay, endOfDay } from "date-fns";
import BookDetails from "../components/BookDetails";
import { insertIntoGoogle } from "../helpers/services/google_services";
import { EMPTY_EVENT, Event, IntervalSet } from "common";
import { UserDocument } from "../helpers/UserDocument";
import { useTranslation } from "react-i18next";
import { EventType } from "../components/EventType";
import { useSnackbar } from "notistack";


type Error = {
  message: string;
  details: any;
};

const Booking = (props: any) => {
  const { t, i18n } = useTranslation();
  const data = useParams<{ user_url: string; url: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  type Details = { name: string; email: string; description: string };

  const [user, setUser] = useState<UserDocument>();
  const [activeStep, setActiveStep] = React.useState(0);
  const [event, setEvent] = useState<Event>(EMPTY_EVENT);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [beginDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<IntervalSet>();
  const [selectedTime, setSelectedTime] = useState<Date>();
  const [details, setDetails] = useState<Details>();
  const [, startTransition] = useTransition()

  const updateSlots = (startDate: Date) => {
    getAvailableTimes(
      startDate,
      addDays(addMonths(startDate, 6), 1),
      event.url,
      user._id
    )
      .then((slots) => {
        console.log("slots %o", slots);
        setSlots(slots);
      })
      .catch((err) => {
        enqueueSnackbar("Could not get available time slots", { variant: "error", autoHideDuration: 15000, className: "error" });
      });
  }

  useEffect(() => {

    getUserByUrl(data.user_url)
      .then((res) => {
        if (res.data.length === 0) {
          navigate("/notfound");
        } else {
          setUser(res.data);
          getEventByUrlAndUser(res.data._id, data.url)
            .then((res) => {
              if (res.data == null) {
                navigate("/notfound");
              }
              if (res.data.isActive === false) {
                navigate("/notfound");
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
        console.log("error getting user: %o", err);
        enqueueSnackbar("Error getting user", { variant: "error", autoHideDuration: 15000, className: "error" });
        return err;
      });
  }, [data.url, data.user_url, navigate, selectedDate]);

  useEffect(() => {

    if (user && event?.url) {
      startTransition(() => updateSlots(beginDate));
    }

  }, [beginDate, user, event]);



  const isStepOptional = (step: number) => {
    return false;
  };



  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleMonthChange = (date: Date) => {
    console.log("handleMonthChange: %o", date);
  };

  const handleDateChange = (newValue: Date) => {
    console.log("change date: %o", startOfDay(newValue));
    setSelectedDate(newValue);
    setActiveStep(1);
  };

  const steps = ["Choose date", "Choose time", "Provide details"].map((label) => t(label));

  const checkDay = (date: Date) => {
    if (!event.available) {
      return false;
    } else {
      return (
        date > new Date() &&
        event.available[date.getDay() as Day].length > 0 &&
        event.available[date.getDay() as Day][0].start !== "" &&
        slots?.overlapping({ start: startOfDay(date), end: endOfDay(date) }).length > 0
      );
    }
  };

  const StyledPickersDay = styled(PickersDay)(({ theme }) => ({
    fontWeight: theme.typography.fontWeightLight,
    "&.highlight": {
      fontWeight: theme.typography.fontWeightBold,
      "&:hover, &:focus": {
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
      },
    },
  }));

  const renderPickerDay = (
    props: PickersDayProps<Date> & { selectedDate: Date | null }) => {
    const { day } = props;
    return (
      <StyledPickersDay
        {...props}
        disableMargin
        disabled={!checkDay(day)}
        className={clsx({
          highlight: checkDay(day),
        })}
      />
    );
  };

  const getTimes = (day: Date) => {
    if (slots) {
      let times = [];
      const target = new IntervalSet(startOfDay(day), endOfDay(day));
      for (let slot of slots.intersect(target)) {
        console.log("Slot: %o", slot);
        let start = new Date(slot.start);
        let end = new Date(slot.end);
        console.log("start: %s, end: %s", start, end);
        let s = start;
        while (s < addMinutes(end, -event.duration)) {
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
      setSelectedTime(time);
    };

  const renderSlots = () => {
    console.log("renderSlots: %o %o %s", slots, selectedDate, i18n.language);
    const times = getTimes(selectedDate);
    return (
      <>
        <Typography variant="subtitle1" component="h2" gutterBottom sx={{ marginTop: "16px", marginBottom: "12px", fontWeight: 500 }}>
          {selectedDate !== undefined ? i18n.t('clear_close_racoon_pat', { value: selectedDate }) : ""}
        </Typography>
        <Grid
          spacing={1}
          container
          direction="row"
          alignItems="flex-start"
        >
          {times.map((time) => (
            <Grid key={time}>
              <Button variant="text" onClick={handleTime(time)}>
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
      )
        .then(() => {
          enqueueSnackbar("Event successfully booked!", { variant: "success" });
          navigate(`/booked`, {
            state: { user, event, time: selectedTime },
          });
        })
        .catch((err) => {
          enqueueSnackbar("Could not book event", { variant: "error", autoHideDuration: 15000, className: "error" });
        });
    }
  };

  return (

    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        {t("Schedule an appointment")}
      </Typography>

      <EventType event={event} user={user} time={selectedTime}></EventType>

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
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>

                  </Step>
                );
              })}
            </Stepper>

            <React.Fragment>
              <Typography>
                {t("cuddly_spare_felix_stir", { val: activeStep + 1 })}
              </Typography>
              <div>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}

                >
                  {t("heroic_kind_llama_zip")}
                </Button>
                <div />

                {activeStep === steps.length - 1 ? (
                  <Button variant="contained" type="submit">
                    {t("whole_acidic_parrot_promise")}
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </React.Fragment>

            <Grid container spacing={2}>
              <Grid size={8} hidden={activeStep > 1}>
                <StaticDatePicker
                  minDate={beginDate}
                  displayStaticWrapperAs="desktop"
                  value={selectedDate || new Date()}
                  onChange={handleDateChange}
                  onMonthChange={handleMonthChange}
                  slots={{ day: renderPickerDay }}
                />
              </Grid>

              <Grid size={4} hidden={selectedDate == null || activeStep > 1}>
                {renderSlots()}
              </Grid>

              {activeStep > 1 ? (
                <Grid>
                  {user ? (
                    <BookDetails
                      errors={{}}
                      onChange={handleDetailChange}
                    />
                  ) : (
                    ""
                  )}
                </Grid>
              ) : null}

            </Grid>
          </Box>
        </form>
      </Paper>
    </Container>

  );
};

export default Booking;
