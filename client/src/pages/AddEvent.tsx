/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { signout } from "../helpers/helpers";

import { Container } from "@mui/material";


import AppNavbar from "../components/AppNavbar";
import { saveUserEvent } from "../helpers/services/event_services";
import { EMPTY_EVENT, Event } from "common";
import { EventForm } from "../components/EventForm";
import { UserContext } from "../components/PrivateRoute";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";


type AddEventProps = {};

const AddEvent = (props: AddEventProps) => {
  const navigate = useNavigate();
  const [formData] = useState(EMPTY_EVENT);
  const user = useContext(UserContext).user;
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const saveEvent = (formData: Event) => {
    if (user) {
      saveUserEvent(formData, user._id)
        .then((res) => {
          if (res.data.success === false) {
            signout();
            navigate("/landing");
          } else {
            enqueueSnackbar(t("best_due_parakeet_zip"), { variant: "success" });
            navigate("/app");
          }
        })
        .catch((err) => {
          console.log(err);
          enqueueSnackbar(t("steep_fine_lobster_inspire"), { variant: "error", autoHideDuration: 15000, className: "error" });
        });
    }
  };


  return (
    <>
      <AppNavbar></AppNavbar>
      <Container maxWidth="md">
        <h2>{t("Add Event Type")}</h2>
        <EventForm event={formData} handleOnSubmit={saveEvent} data-testid="event-form" />
      </Container>
    </>
  );
};

export default AddEvent;
