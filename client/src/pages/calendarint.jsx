import React, { useState, useEffect } from "react";

import AppNavbar from "../components/appNavbar";
import axios from "axios";

import { Button } from "react-bootstrap";

const Calendarintegration = () => {
  const [google, setGoogle] = useState("");
  const test = localStorage.getItem("user");
  var result = JSON.parse(test);
  var user = result._id;
  const [connected, setConnected] = useState(false);

  const revokeScopes = (event) => {
    event.preventDefault();
    console.log(user);
    axios.get(`${process.env.REACT_APP_API_URI}/google/revoke`, {
      params: { user: user },
    });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/users/getUser`, {
        params: { user: user },
      })
      .then((res) => {
        console.log(res.data);
        if (!res.data.access_token) {
          setConnected(false);
        } else {
          setConnected(true);
        }
      });
    console.log(setConnected);
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/google/generateAuthUrl`, {
        params: { user: user },
      })
      .then((res) => {
        console.log(res.data);
        setGoogle(res.data);
      });
  }, []);

  const renderAuthButton = () => {
    if (connected) {
      return <Button onClick={revokeScopes}>Disconnect from Google</Button>;
    } else {
      return <Button href={google.url}>Integreate Google Api</Button>;
    }
  };

  return (
    <div className="integration">
      <AppNavbar />
      {renderAuthButton()}
    </div>
  );
};

export default Calendarintegration;
