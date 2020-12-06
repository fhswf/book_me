import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Redirect, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { isAuthenticated } from "../helpers/helpers";
import { postToActivate } from "../helpers/services/auth_services";

import "../styles/activation.css";

/*------------Font Awesome Icons --------------*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faSignInAlt,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";

const iconUserPlus = <FontAwesomeIcon icon={faUserPlus} />;
const iconSignIn = <FontAwesomeIcon icon={faSignInAlt} />;
const iconCal = <FontAwesomeIcon icon={faCalendar} size="xs" />;

const Activate = ({ match }) => {
  const handleOnSubmit = (e) => {
    e.preventDefault();
    postToActivate(match.params.token)
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.errors);
      });
  };

  return (
    <div className="activate">
      <ToastContainer autoClose={2500} />
      <div className="activate-container">
        <h3>{iconCal} Welcome to Bookme</h3>
        <div className="activatebox">
          <Form onSubmit={handleOnSubmit}>
            <Button variant="primary" type="submit">
              {iconUserPlus} Activate your Account
            </Button>
            <p>Already got an Account?</p>
            <Button
              variant="primary"
              href="/login"
              role="button"
              target="_self"
            >
              {iconSignIn} Sign in
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Activate;
