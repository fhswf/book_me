import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import AppNavbar from "../components/appNavbar";
import axios from "axios";

import { Button } from "react-bootstrap";

const Calendarintegration = () => {
  const test = localStorage.getItem("user");
  var result = JSON.parse(test);
  var user = result._id;

  const callGoogle = () => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/generateAuthUrl`)
      .then((res) => {
        window.open(
          res.data.url,
          "Google Authentication",
          "width=600,height=600"
        );
        axios.post(`${process.env.REACT_APP_API_URI}/currentUser`, {
          params: { user: user },
        });
      });
  };
  return (
    <div className="integration">
      <AppNavbar />
      <Button onClick={callGoogle}>Integreate Google Api</Button>
    </div>
  );
};

export default Calendarintegration;
