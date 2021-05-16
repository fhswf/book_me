import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import AppNavbar from "../components/appNavbar";

import "../styles/calendarint.css";

// Material UI
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  Container,
  IconButton,
} from "@material-ui/core";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";

//import { Button, Modal } from "react-bootstrap";
import { updateUser } from "../helpers/services/user_services";
import {
  deleteAccess,
  getAuthUrl,
  getCalendarList,
} from "../helpers/services/google_services";

import EditIcon from "@material-ui/icons/Edit";

import { ToastContainer, toast } from "react-toastify";
import { Avatar } from "@material-ui/core";
import { UserContext } from "../helpers/privateRoute";

const renderCalendarList = (calendarList, state, setState, single = false) => {
  console.log("renderCalendarList: %o", state);

  if (single) {
    const selected = Object.keys(state)[0];
    console.log("selected: %o", selected);
    const items = calendarList.items.map((item) => {
      return (
        <MenuItem value={item.id}>
          {item.summaryOverride ? item.summaryOverride : item.summary}
        </MenuItem>
      );
    });

    return (
      <FormControl>
        <InputLabel id="calendar-select-label">Calendar</InputLabel>
        <Select
          labelId="calendar-select-label"
          id="calendar-select"
          value={selected}
          displayEmpty
          onChange={(event) => {
            state = { [event.target.value]: true };
            console.log("select: %o %o", event, state);
            setState(state);
          }}
        >
          {items}
        </Select>
      </FormControl>
    );
  } else {
    const items = calendarList.items.map((item) => (
      <FormControlLabel
        control={
          <Checkbox
            checked={state[item.id]}
            onChange={(event) => {
              console.log(
                "onChange: %s %o\n%o",
                event.target.name,
                event.target.checked,
                state
              );
              setState({ ...state, [event.target.name]: event.target.checked });
            }}
            name={item.id}
          />
        }
        label={item.summaryOverride ? item.summaryOverride : item.summary}
      />
    ));

    return <FormGroup>{items}</FormGroup>;
  }
};

const PushCalendar = ({ user, calendarList }) => {
  const pushCal = calendarList
    ? calendarList.items.find((item) => item.id === user.push_calendar)
    : undefined;
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(pushCal);

  const token = JSON.parse(localStorage.getItem("access_token"));
  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);
  const save = () => {
    console.log("save: selected: %o", selected);
    user.push_calendar = Object.keys(selected).find((item) => selected[item]);

    updateUser(token, user)
      .then((user) => {
        console.log("updated user: %o", user);
      })
      .catch((err) => {
        console.error("user update failed: %o", err);
      });
    setOpen(false);
  };

  if (!user || !calendarList) {
    return <div></div>;
  }

  console.log("pushCalendar: %o %o", user, calendarList);

  return (
    <>
      <CardHeader
        action={
          <IconButton onClick={handleShow}>
            <EditIcon />
          </IconButton>
        }
        title="Add appointments to calendar"
      />
      <CardContent>
        {pushCal.summaryOverride ? pushCal.summaryOverride : pushCal.summary}
      </CardContent>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Calendar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a calendar in which appointments are created.
          </DialogContentText>
          {renderCalendarList(
            calendarList,
            selected ? selected : { [user.push_calendar]: true },
            setSelected,
            true
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={save} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const PullCalendars = ({ user, calendarList }) => {
  const pullCals = calendarList
    ? calendarList.items
        .filter((item) => user.pull_calendars.includes(item.id))
        .map((cal) => (
          <li>{cal.summaryOverride ? cal.summaryOverride : cal.summary}</li>
        ))
    : undefined;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(pullCals);

  const token = JSON.parse(localStorage.getItem("access_token"));
  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);
  const save = () => {
    console.log("save: selected: %o", selected);
    user.pull_calendars = [];
    Object.keys(selected).forEach((item) => {
      console.log("save: item %s", item);
      if (selected[item]) {
        console.log("save: %s is true", item);
        user.pull_calendars.push(item);
      }
    });
    updateUser(token, user)
      .then((user) => {
        console.log("updated user: %o", user);
      })
      .catch((err) => {
        console.error("user update failed: %o", err);
      });
    setOpen(false);
  };

  if (!user || !calendarList) {
    return <div></div>;
  } else {
    let _selected = {};
    user.pull_calendars.forEach((item) => (_selected[item] = true));
    return (
      <>
        <CardHeader
          action={
            <IconButton onClick={handleShow}>
              <EditIcon />
            </IconButton>
          }
          title="Check free time in calendars"
        />
        <CardContent>
          <FormGroup>
            <ul>{pullCals}</ul>
          </FormGroup>
        </CardContent>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Calendar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Choose calendars to check for busy times.
            </DialogContentText>
            {renderCalendarList(
              calendarList,
              selected ? selected : _selected,
              setSelected
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={save} color="primary">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
};

const Calendarintegration = () => {
  const token = JSON.parse(localStorage.getItem("access_token") as string);
  const history = useHistory();
  const [connected, setConnected] = useState(false);
  const [url, setUrl] = useState("");
  const [calendarList, setCalendarList] = useState(null);
  const user = useContext(UserContext).user;

  const revokeScopes = (event) => {
    event.preventDefault();
    deleteAccess(token).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      }
      setConnected(false, window.location.reload());
    });
  };

  useEffect(() => {
    if (!user || !user.google_tokens || !user.google_tokens.access_token) {
      setConnected(false);
    } else {
      setConnected(true);
      console.log("user: %o", user);

      getCalendarList(token).then((res) => {
        setCalendarList(res.data.data);
        const calendars = res.data.data;
        const primary = calendars.items.filter((item) => item.primary);
        console.log("calendarList: %o %o", calendars, primary);
        let update = false;
        if (user.pull_calendars.length === 0) {
          user.pull_calendars.push(primary[0].id);
          update = true;
        }
        if (!user.push_calendar) {
          user.push_calendar = primary[0].id;
          update = true;
        }

        if (update) {
          updateUser(token, user)
            .then((user) => {
              console.log("updated user: %o", user);
              toast.info("using primary calendars by default");
            })
            .catch((err) => {
              console.error("user update failed: %o", err);
            });
        }
      });
    }
    getAuthUrl(token).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      } else {
        setUrl(res.data);
      }
    });
  }, [history, token]);

  const renderConnectButton = () => {
    if (connected) {
      return (
        <Button variant="contained" onClick={revokeScopes}>
          Disconnect from Google
        </Button>
      );
    } else {
      return (
        <Button variant="contained" href={url.url}>
          Connect Google Calendar
        </Button>
      );
    }
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <Typography variant="h3" gutterBottom>
          My Calendar
        </Typography>
        <Box p="1em">
          <Grid
            container
            direction="row"
            spacing={2}
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              <img
                class="icon"
                src="/icons/google_calendar_icon.svg"
                width="32"
              />{" "}
              Google Calendar
            </Grid>
            <Grid item>{renderConnectButton()}</Grid>
          </Grid>
        </Box>

        <Typography variant="h4" gutterBottom>
          Configuration
        </Typography>
        <Box p="1em">
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Card>
              <PushCalendar user={user} calendarList={calendarList} />
            </Card>
            <Card>
              <PullCalendars user={user} calendarList={calendarList} />
            </Card>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Calendarintegration;
