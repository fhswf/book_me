import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import AppNavbar from "../components/appNavbar";

import "../styles/calendarint.css";

// Material UI
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

//import { Button, Modal } from "react-bootstrap";
import { getUserById, updateUser } from "../helpers/services/user_services";
import { deleteAccess, getAuthUrl, getCalendarList } from "../helpers/services/google_services";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
const iconGoogle = (
  <FontAwesomeIcon icon={faGoogle} size="3x"></FontAwesomeIcon>
);


const renderCalendarList = (calendarList, state, setState, single = false) => {
  console.log('renderCalendarList: %o', state);

  if (single) {
    const selected = Object.keys(state)[0];
    console.log('selected: %o', selected);
    const items = calendarList.items.map(item => {
      return (
        <MenuItem value={item.id}>{item.summaryOverride ? item.summaryOverride : item.summary}</MenuItem>
      )
    })

    return (
      <FormControl>
        <InputLabel id="calendar-select-label">Calendar</InputLabel>
        <Select
          labelId="calendar-select-label"
          id="calendar-select"
          value={selected}
          displayEmpty
          onChange={event => {
            state = { [event.target.value]: true };
            console.log('select: %o %o', event, state);
            setState(state);
          }}
        >
          {items}
        </Select>
      </FormControl>
    )
  }
  else {
    const items = calendarList.items.map(item => {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={state[item.id]}
              onChange={event => {
                state[event.target.name] = event.target.checked;
                setState(state);
              }}
              name={item.id}
            />
          }
          label={item.summaryOverride ? item.summaryOverride : item.summary}
        />
      )
    })

    return (
      <FormGroup>{items}</FormGroup>
    );
  }
}

const PushCalendar = ({ user, calendarList }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(undefined);

  const token = JSON.parse(localStorage.getItem("access_token"));
  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);
  const save = () => {
    console.log("save: selected: %o", selected);
    user.push_calendar = Object.keys(selected).find(item => selected[item]);

    updateUser(token, user)
      .then(user => {
        console.log('updated user: %o', user);
      })
      .catch(err => {
        console.error('user update failed: %o', err);
      });
    setOpen(false);
  }

  if (!user || !calendarList) {
    return (<div></div>)
  }

  console.log('pushCalendar: %o %o', user, calendarList);

  const pushCal = calendarList.items.find(item => item.id === user.push_calendar);
  return (
    <>
      <div>
        <Button onClick={handleShow} color="primary"><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></Button>
          Add appointments to calendar
          <div className="calendar">
          {pushCal.summaryOverride ? pushCal.summaryOverride : pushCal.summary}
        </div>
      </div>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Calendar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a calendar in which appointments are created.
          </DialogContentText>
          {renderCalendarList(calendarList, selected ? selected : { [user.push_calendar]: true }, setSelected, true)}
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
  )

}

const PullCalendars = ({ user, calendarList }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(undefined);

  const token = JSON.parse(localStorage.getItem("access_token"));
  const handleClose = () => setOpen(false);
  const handleShow = () => setOpen(true);
  const save = () => {
    console.log("save: selected: %o", selected);
    user.pull_calendars = [];
    Object.keys(selected).forEach(item => {
      console.log('save: item %s', item)
      if (selected[item]) {
        console.log('save: %s is true', item);
        user.pull_calendars.push(item);
      }
    });
    updateUser(token, user)
      .then(user => {
        console.log('updated user: %o', user);
      })
      .catch(err => {
        console.error('user update failed: %o', err);
      });
    setOpen(false);
  }

  if (!user || !calendarList) {
    return (<div></div>)
  } else {
    const pullCals = calendarList.items
      .filter(item => user.pull_calendars.includes(item.id))
      .map(cal => (<li>{cal.summaryOverride ? cal.summaryOverride : cal.summary}</li>))

    let _selected = {};
    user.pull_calendars.forEach(item => _selected[item] = true);
    return (
      <>
        <div>
          <Button onClick={handleShow} color="primary"><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></Button>
          Check free time in calendars
          <FormGroup><ul>{pullCals}</ul></FormGroup>
        </div>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Calendar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Choose calendars to check for busy times.
          </DialogContentText>
            {renderCalendarList(calendarList, selected ? selected : _selected, setSelected)}
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
    )
  }
}

const Calendarintegration = () => {
  const token = JSON.parse(localStorage.getItem("access_token"));
  const history = useHistory();
  const [connected, setConnected] = useState(false);
  const [url, setUrl] = useState("");
  const [user, setUser] = useState(undefined);
  const [calendarList, setCalendarList] = useState(null);


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
    getUserById(token).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      }

      const user = res.data;
      setUser(user);
      if (!res.data.google_tokens || !res.data.google_tokens.access_token) {
        setConnected(false);
      } else {
        setConnected(true);
        console.log("user: %o", user);

        getCalendarList(token)
          .then(res => {
            setCalendarList(res.data.data);
            const calendars = res.data.data;
            const primary = calendars.items.filter(item => item.primary);
            console.log('calendarList: %o %o', calendars, primary);
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
                .then(user => {
                  console.log('updated user: %o', user);
                  toast.info('using primary calendars by default');
                })
                .catch(err => {
                  console.error('user update failed: %o', err);
                })
            }
          })
      }
      getAuthUrl(token).then((res) => {
        if (res.data.success === false) {
          signout();
          history.push("/landing");
        } else {
          setUrl(res.data);
        }
      });
    });
  }, [history, token]);

  const renderConnectButton = () => {
    if (connected) {
      return (
        <Button className="connectbtn" onClick={revokeScopes}>
          Disconnect from Google
        </Button>
      );
    } else {
      return (
        <Button className="connectbtn" href={url.url}>
          Connect Google Calendar
        </Button>
      );
    }
  };



  return (
    <div>
      <AppNavbar />
      <Paper>
        <div className="wrapcontent">
          <Container>

            <Typography>
              {iconGoogle}
              Calendar
              </Typography>
            {renderConnectButton()}
          </Container>
        </div>
        <div className="wrapcontent">
          <Typography variant="h4">Configuration</Typography>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Card className="half">
              <PushCalendar user={user} calendarList={calendarList} />
            </Card>
            <Card className="half">
              <PullCalendars user={user} calendarList={calendarList} />
            </Card>
          </Grid>
        </div>
      </Paper>
    </div>
  );
};

export default Calendarintegration;
