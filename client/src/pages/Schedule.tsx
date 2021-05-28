import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { StaticDatePicker, PickersDay } from "@material-ui/lab";

import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Link,
} from "@material-ui/core";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";

import { getUserByUrl } from "../helpers/services/user_services";
import { getEventByUrlAndUser } from "../helpers/services/event_services";
import { getAvailableTimes } from "../helpers/services/event_services";
import clsx from "clsx";
import {
  addDays,
  addMonths,
  isBefore,
  isAfter,
  isSameDay,
  startOfDay,
  endOfDay,
} from "date-fns";
//import de from "date-fns/locale/de";
import { de, enUS } from "date-fns/locale";
import BookDetails, { BookingFormData } from "../components/BookDetails";
import { insertIntoGoogle } from "../helpers/services/google_services";
import {
  EMPTY_EVENT,
  Event,
  IntervalSet,
  TimeRange,
} from "@fhswf/bookme-common";
import { UserDocument } from "../helpers/UserDocument";
import ChooseTime from "../components/ChooseTime";
import { useTranslation, Trans } from "react-i18next";

const LOCALES = { en: enUS, de: de, "de-DE": de };

const useStyles = makeStyles((theme) => ({
  picker: {
    "& button": {
      borderRadius: "50%",
      "&.highlight": {
        "&.selected": {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          "&:hover, &:focus": {
            backgroundColor: theme.palette.primary.light,
          },
        },
        fontWeight: "bold",
        "&:hover, &:focus": {
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText,
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
  grid: {
    display: "grid",
    [theme.breakpoints.down("sm")]: {
      gridTemplateColumns: "1fr",
      gridTemplateAreas: `"header_l"  "picker_l" "header_r" "picker_r"`,
    },
    gridTemplateColumns: "1fr 1fr",
    gridTemplateAreas: `"header_l header_r" "picker_l picker_r"`,
    gap: 2,
    alignItems: "start",
    padding: 2,
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

const Schedule = (props: any) => {
  const data = useParams<{ user_url: string; url: string }>();
  const history = useHistory();
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const [user, setUser] = useState<UserDocument>();
  const [event, setEvent] = useState<Event>(EMPTY_EVENT);
  const [timezone, setTimezone] = useState<string>("Europe/Berlin");
  const [selectedDate, setDate] = useState<Date | null>(null);
  const [selectedTime, setTime] = useState<TimeRange | null>(null);
  const [beginDate, setBeginDate] = useState<Date>(new Date());
  const [slots, setSlots] = useState<IntervalSet>(new IntervalSet());
  const [daySlots, setDaySlots] = useState<IntervalSet>(new IntervalSet());
  const [details, setDetails] = useState<BookingFormData | null>(null);

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

  useEffect(() => {
    if (user && event && event.url) {
      getAvailableTimes(
        beginDate,
        addDays(addMonths(beginDate, 1), 1),
        event.url,
        user._id
      ).then((slots) => {
        console.log("slots %o", slots);
        setSlots(slots);
        if (selectedDate == null) {
          console.log("setDate: %o", slots[0].start);
          let dayInt = new IntervalSet(
            startOfDay(slots[0].start),
            endOfDay(slots[0].start)
          );
          setDaySlots(dayInt.intersect(slots));
          setDate(slots[0].start);
        }
      });
    }
  }, [user, event, beginDate]);

  const checkDay = (date: Date) => {
    if (date < new Date()) {
      return false;
    }
    let available = false;
    if (slots) {
      slots.forEach((slot) => {
        if (
          isSameDay(slot.start, date) ||
          isSameDay(slot.end, date) ||
          (isBefore(slot.start, date) && isAfter(slot.end, date))
        ) {
          available = true;
        }
      });
    }
    return available;
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
          selected: selectedDate && isSameDay(date, selectedDate),
          highlight: checkDay(date),
        })}
      />
    );
  };

  const handleMonthChange = (date: Date) => {
    setBeginDate(date);
  };

  const handleDateChange = (newValue: Date) => {
    console.log("date: %o", newValue);
    if (user) {
      let dayInt = new IntervalSet(startOfDay(newValue), endOfDay(newValue));
      setDaySlots(dayInt.intersect(slots));
      setDate(newValue);
    }
  };

  const handleTime = (time: TimeRange) => {
    console.log("select slot: %o", time);
    setTime(time);
  };

  const handleDetailChange = (data: BookingFormData) => {
    console.log("detailchange: %o", data);
    setDetails(data);
  };

  const handleSubmit = (e) => {
    console.log("submit: %o", details);
    e.preventDefault();
    if (details.name && details.email) {
      insertIntoGoogle(
        user._id,
        event,
        selectedTime.start,
        details.name,
        details.email,
        details.description
      ).then(() => {
        //toast.success("Event successfully booked!");
        history.push({
          pathname: `/booked`,
          state: { user, event, time: selectedTime },
        });
      });
    } else {
      //toast.error("Please fill in your name and email!");
    }
  };

  const userName = user ? user.name : "";

  console.log("langue: %s", i18n.language);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      locale={LOCALES[i18n.language]}
    >
      <Container>
        {selectedTime ? (
          <>
            <Typography variant="h5">{t("Confirm meeting")}</Typography>
            <Typography>
              {selectedDate.toLocaleDateString(i18n.language, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}{" "}
              {selectedTime.start.toLocaleTimeString(i18n.language, {
                timeStyle: "short",
              })}{" "}
              –{" "}
              {selectedTime.end.toLocaleTimeString(i18n.language, {
                timeStyle: "short",
              })}{" "}
              <Link onClick={() => setTime(null)}>{t("Change")}</Link>
            </Typography>

            <form onSubmit={handleSubmit}>
              <BookDetails
                userid={user._id}
                username={user.name}
                event={event}
                start={selectedTime.start}
                end={selectedTime.end}
                onChange={handleDetailChange}
              />
              <Grid container justifyContent="space-between" padding={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setTime(null)}
                >
                  {t("Back")}
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {t("Confirm &amp; Book")}
                </Button>
              </Grid>
            </form>
          </>
        ) : (
          <Box className={classes.grid} padding={2}>
            <Box sx={{ gridArea: "header_l" }} justifyContent="center">
              <Avatar
                alt={user ? user.name : ""}
                src={user ? user.picture_url : ""}
                sx={{ width: 72, height: 72, margin: "auto" }}
              />
              <Typography variant="h5" textAlign="center">
                {t("Meeting with")} {userName}
              </Typography>
            </Box>
            <Box sx={{ gridArea: "picker_l" }}>
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
            </Box>

            <Box sx={{ gridArea: "header_r" }} alignSelf="end">
              <Typography>
                {selectedDate ? (
                  <>
                    <Trans i18nKey="availableSlots">
                      The following times are available on
                      {{
                        date: selectedDate.toLocaleDateString(i18n.language, {
                          day: "numeric",
                          month: "long",
                        }),
                      }}
                      . You may pick one or choose a different date.
                    </Trans>
                  </>
                ) : (
                  <>Please choose a date to check available times.</>
                )}
              </Typography>
            </Box>
            <Box
              sx={{ gridArea: "picker_r" }}
              display="flex"
              flexWrap="wrap"
              gap={2}
              padding={2}
            >
              <ChooseTime
                slots={daySlots}
                duration={event.duration}
                onSelect={handleTime}
              />
            </Box>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default Schedule;