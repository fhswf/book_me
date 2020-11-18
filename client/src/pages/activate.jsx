import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import { Redirect, useHistory } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "../styles/activation.css";

/*------------Font Awesome Icons --------------*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { isAuthenticated } from "../helpers/auth";

const iconUserPlus = <FontAwesomeIcon icon={faUserPlus} />;
const iconSignIn = <FontAwesomeIcon icon={faSignInAlt} />;

const Activate = (match) => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    name: "",
    token: "",
    show: true,
  });

  const { name } = formData;

  const handleOnSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URI}/auth/activate`, {
        withCredentials: true,
      })
      .then((res) => {
        setFormData({
          ...formData,
          show: false,
        });
        if (res.data.message === "Error! Please signup again!") {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          history.push("/login");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.errors);
      });
  };

  return (
    <div className="activate">
      <ToastContainer autoClose={2500} />
      {isAuthenticated() ? <Redirect to="/" /> : null}
      <div className="activate-container">
        <div className="activatebox">
          <Form onSubmit={handleOnSubmit}>
            <h1>Welcome {name}</h1>
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
