import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signout, useAuthenticated } from "../helpers/helpers";
import { updateEvent } from "../helpers/services/event_services";

import Grid from "@mui/material/Grid2";

import { getUsersEvents } from "../helpers/services/event_services";
import { EventCard } from "./EventCard";
import { EventDocument } from "../helpers/EventDocument";
import { useTranslation } from "react-i18next";
import { use } from "i18next";


type EventListProps = {
  url: string;
  userid: string;
};

const EventList = (props: EventListProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isAuthenticated = useAuthenticated();

  const [events, setEvents] = useState<EventDocument[]>([]);

  useEffect(() => {
    getUsersEvents().then((res) => {
      if (res.data.success === false) {
        signout();
        navigate("/landing");
      } else {
        console.log("events: %o", res.data);
        setEvents(res.data);
      }
    });
  }, [navigate]);

  const onDelete = (event: EventDocument) => {
    setEvents(events.filter((ev) => ev._id !== event._id));
  };

  const list =
    events.length === 0 ? (
      <div>{t("sunny_great_halibut_empower")}</div>
    ) : (
      events.map((event, index) => (
        <EventCard
          key={event._id}
          event={event}
          url={props.url}
          setActive={(active) => {
            const event = events[index];
            event.isActive = active;
            console.log("setActive: %o %o", event, active);
            updateEvent(event._id, event);
          }}
          onDelete={onDelete}
        />
      ))
    );

  return (
    <>
      <Grid
        size={12}
        spacing={3}
        justifyItems="space-around"
        alignItems="stretch"
      >
        {list}
      </Grid>
    </>
  );
};

export default EventList;
