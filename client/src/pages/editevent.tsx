import React, { useState, useEffect } from "react";
import AppNavbar from "../components/appNavbar";

import "../styles/addevent.css";
import {
  Card,
  Container,
  FormGroup,
  FormLabel,
  Input,
  Paper,
} from "@material-ui/core";

import Switch from "@material-ui/core/Switch";
import { toast } from "react-toastify";
import { getEventByID, updateEvent } from "../helpers/services/event_services";
import { useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { EventForm } from "../components/EventForm";
import { Day, EMPTY_EVENT, Event, Slot } from "@fhswf/bookme-common";

export type EventFormProps = {
  event: Event;
  handleOnSubmit: (evt: Event) => void;
};

const EditEvent = ({ match }): JSX.Element => {
  const eventID = match.params.id;
  const token = JSON.parse(localStorage.getItem("access_token"));
  const history = useHistory();
  const [formData, setFormData] = useState<Event | null>(null);

  useEffect(() => {
    getEventByID(token, eventID).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      } else {
        console.log("editEvent: getEventById returned %o", res.data);
        const available: Record<Day, Slot[]> = {
          [Day.MONDAY]: [
            {
              start: res.data.available.mon[0] as string,
              end: res.data.available.mon[1] as string,
            },
          ],
          [Day.TUESDAY]: [
            {
              start: res.data.available.tue[0] as string,
              end: res.data.available.tue[1] as string,
            },
          ],
          [Day.WEDNESDAY]: [
            {
              start: res.data.available.wen[0] as string,
              end: res.data.available.wen[1] as string,
            },
          ],
          [Day.THURSDAY]: [
            {
              start: res.data.available.thu[0] as string,
              end: res.data.available.thu[1] as string,
            },
          ],
          [Day.FRIDAY]: [
            {
              start: res.data.available.fri[0] as string,
              end: res.data.available.fri[1] as string,
            },
          ],
          [Day.SATURDAY]: [
            {
              start: res.data.available.sat[0] as string,
              end: res.data.available.sat[1] as string,
            },
          ],
          [Day.SUNDAY]: [
            {
              start: res.data.available.sun[0] as string,
              end: res.data.available.sun[1] as string,
            },
          ],
        };
        console.log("slots: %o", available);
        setFormData({
          name: res.data.name,
          location: res.data.location,
          description: res.data.description,
          duration: res.data.duration,
          isActive: res.data.isActive,
          eventurl: res.data.url,
          rangedays: res.data.rangedays,
          bufferafter: res.data.bufferafter,
          bufferbefore: res.data.bufferbefore,
          calendardays: res.data.calendardays,
          available: available,
        });
      }
    });
  }, []);

  const saveEvent = (formData: Event) => {
    updateEvent(token, eventID, formData)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          history.push("/landing");
        } else {
          toast.success(res.data.msg);
          history.push("/app");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to save event type");
      });
  };

  console.log("render: formData=%o", formData);
  return (
    <>
      <AppNavbar />

      <Container maxWidth="md">
        <h2>Edit Event Type</h2>
        <EventForm
          event={formData ? formData : EMPTY_EVENT}
          handleOnSubmit={saveEvent}
        />
      </Container>
    </>
  );
};

export default EditEvent;
