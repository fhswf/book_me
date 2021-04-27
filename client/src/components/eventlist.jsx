import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { deleteEvent, updateEvent } from "../helpers/services/event_services";
//import Dropdown from "./eventDropdownMenu";
import "../styles/eventlist.css";

import {
  Button, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Snackbar, Switch
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import { getUsersEvents } from "../helpers/services/event_services";

const useStyles = makeStyles((theme) => ({
  delete: {
    marginLeft: 'auto',
  }
}));

function EventCard(props) {

  const [active, setActive] = useState(props.event.isActive);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const token = props.token;
  const classes = useStyles();
  const history = useHistory();

  const toggleActive = (evt) => {
    setActive(evt.target.checked);
    props.setActive(active);
  }

  const handleCopy = () => {
    let loc = window.location;
    let url = history.createHref({ pathname: `/users/${props.url}/${props.event.url}` });
    url = loc.protocol + '//' + loc.host + url;
    console.log('url: %s', url);

    navigator.clipboard.writeText(url)
      .then(() => setSuccess(true))
      .catch((err) => {
        console.log('err: %o', err);
        setFailure(true)
      });
  }

  const handleDelete = () => {
    deleteEvent(token, props.event._id).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      }
    });
  }

  return (
    <>
      <Grid item xs={12} sm={6}>

        <Card>
          <CardHeader action={
            <IconButton aria-label="settings" component={Link} to={`/editevent/${props.event._id}`}>
              <EditIcon />
            </IconButton>
          }
            title={props.event.name}
            subheader={props.event.url}
          />
          <CardContent>{props.event.description}</CardContent>
          <CardActions disableSpacing>
            <Switch
              checked={active}
              onChange={toggleActive}
              size="small"
              name="active"
              color="primary"
              inputProps={{ 'aria-label': 'active' }}
            />
            <Button aria-label="copy link" startIcon={<ShareIcon />} onClick={handleCopy}>
              Copy link
            </Button>
            <IconButton aria-label="delete" className={classes.delete} onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>
      <Snackbar open={success} autoHideDuration={2000} onClose={() => { setSuccess(false) }}>
        <Alert severity="success">
          Link copied to clipboard!
        </Alert>
      </Snackbar>
      <Snackbar open={failure} >
        <Alert severity="failure">
          Could not copy link to clipboard!
        </Alert>
      </Snackbar>
    </>
  )
}

function EventList(props) {
  const token = JSON.parse(localStorage.getItem("access_token"));
  const history = useHistory();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    getUsersEvents(token).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      } else {
        console.log('events: %o', res.data);
        setEvents(res.data);
      }
    });
  }, [token, history]);

  const list = events.length > 0 ? events.map((event, index) => (
    <EventCard event={event} url={props.url} setActive={(active) => { events[index].isActive = active; updateEvent(token, events[index]) }} token={token} />
  )) : (<div>No events yet, create one</div>);

  return (
    <>
      <Grid container spacing={3}>
        {list}
      </Grid>
    </>
  );
}

/*
     <Card>
      <CardHeader action={
        <IconButton aria-label="settings" component={Link} href={`/editevent/${_event._id}`}>
          <MoreVertIcon />
        </IconButton>
      }>{_event.name}</CardHeader>
      <CardContent></CardContent>
      <CardActions>
        <IconButton aria-label="copy link" onClick={handleCopy(_event)}>
          <ShareIcon /> Copy link
                </IconButton>
        <IconButton aria-label="delete" onClick={handleDelete(_event)} >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
*/




export default EventList;
