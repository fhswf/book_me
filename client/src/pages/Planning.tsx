import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Card,
  CardHeader,
  CardContent,
  Container,
  Grid,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RoomIcon from "@mui/icons-material/Room";

import { getActiveEvents } from "../helpers/services/event_services";
import { getUserByUrl } from "../helpers/services/user_services";
import { EventDocument } from "../helpers/EventDocument";

/*
const useStyles = makeStyles((theme) => ({
  container: {
    display: "grid",
    gridTemplateColumns: "1.5em 1fr",
    gridGap: theme.spacing(1),
    alignItems: "center",
    verticalAlign: "center",
    paddingBottom: "16px",
  },
  item: {},
}));
*/

const Planning = (props: any) => {
  const navigate = useNavigate();

  const { user_url } = useParams<{ user_url: string }>();
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [user, setUser] = useState({
    name: "",
    welcome: "",
    picture_url: "",
  });

  useEffect(() => {
    getUserByUrl(user_url)
      .then((res) => {
        if (res.data.length === 0) {
          navigate("/notfound");
        } else {
          setUser(res.data);
          getActiveEvents(res.data._id)
            .then((res) => {
              console.log(res.data);
              if (res.data.length === 0) {
                setUser({
                  name: user.name,
                  welcome: "No active Events",
                  picture_url: "",
                });
              } else {
                setEvents(res.data);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user_url, navigate, user.name]);

  const handleOnClick = (bookingEvent: EventDocument) => {
    navigate(`/users/${user_url}/${bookingEvent.url}`, {
      state: { bookingEvent, user },
    });
  };

  const renderEventlist = () => {
    if (!events || events.length === 0) {
      return <h4 className="noevents">No events to book</h4>;
    } else {
      return (
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="space-evenly"
          alignItems="stretch"
        >
          {events.map((event) => (
            <Grid item sm={4} xs={6}>
              <Card>
                <CardHeader
                  avatar={<Avatar alt={user.name} src={user.picture_url} />}
                  title={event.name}
                />
                <CardContent>
                  <Container
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "1.5em 1fr",
                      alignItems: "center",
                      verticalAlign: "center",
                      paddingBottom: "16px"
                    }}>
                    <div>
                      <HourglassFullIcon />
                    </div>
                    <div>
                      {event.duration + " minutes"}
                    </div>

                    <div>
                      <RoomIcon />
                    </div>
                    <div>{event.location}</div>
                  </Container>
                  {event.description}
                </CardContent>
                <CardActions>
                  <Button
                    color="primary"
                    aria-label="schedule"
                    onClick={(evt) => {
                      evt.preventDefault();
                      handleOnClick(event);
                    }}
                    startIcon={<ScheduleIcon />}
                  >
                    Schedule event
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        Schedule an appointment with {user.name}
      </Typography>
      Please select the type of appointment you need and click on the schedule
      button to book it. You will get a list of available slots in my schedule.
      <Box p="1em">{renderEventlist()}</Box>
    </Container>
  );
};

export default Planning;
