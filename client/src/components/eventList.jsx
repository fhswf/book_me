import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { updateEvent } from "../helpers/services/event_services";

import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { getUsersEvents } from "../helpers/services/event_services";
import { EventCard } from "./eventCard";

export const useStyles = makeStyles((theme) => ({
  delete: {
    marginLeft: 'auto',
  }
}));

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

  const list = events.length == 0 ? (<div>No events yet, create one</div>) :
    events.map((event, index) =>
      <EventCard
        event={event}
        url={props.url}
        setActive={(active) => { events[index].isActive = active; updateEvent(token, events[index]); }}
        token={token} />
    );

  return (
    <>
      <Grid container spacing={3} justify="space-around" alignItems="stretch">
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
