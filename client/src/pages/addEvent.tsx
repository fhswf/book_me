/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import { signout } from "../helpers/helpers";

import { Container } from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { makeStyles } from "@material-ui/core/styles";

import AppNavbar from "../components/appNavbar";
import { saveUserEvent } from "../helpers/services/event_services";
import { TimesForDay } from "../components/timesForDay";
import { Day, EMPTY_EVENT, Event, Slot } from "@fhswf/bookme-common";
import { EventForm } from "../components/EventForm";
import { getUserByToken } from "../helpers/services/user_services";

export const useStyles = makeStyles((theme) => ({
  row: {
    alignItems: "baseline",
  },
  label: {
    fontSize: "0.7rem",
    display: "block",
    paddingTop: "2ex",
    marginBottom: "-1ex",
  },
  sep: {
    padding: "0.8ex",
  },
}));

type AddEventProps = {};

const AddEvent = (props: AddEventProps) => {
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("access_token"));

  const [formData, setFormData] = useState(EMPTY_EVENT);
  const [user, setUser] = useState("");

  useEffect(() => {
    getUserByToken(token).then((res) => {
      setUser(res.data);
    });
  }, []);

  const saveEvent = (formData: Event) => {
    saveUserEvent(token, formData, user._id)
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

  const theme = {
    spacing: (value) => value * 2,
  };

  return (
    <>
      <AppNavbar></AppNavbar>
      <Container maxWidth="md">
        <h2>Add Event Type</h2>
        <EventForm event={formData} handleOnSubmit={saveEvent} />
      </Container>
    </>
  );
};

export default AddEvent;
