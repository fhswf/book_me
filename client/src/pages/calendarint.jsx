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

    axios.get(`${process.env.REACT_APP_API_URI}/google/revoke`, {
      params: { user: user },
    });

    window.location.reload();
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/users/getUser`, {
        params: { user: user },
      })
      .then((res) => {
        if (!res.data.access_token) {
          setConnected(false);
        } else {
          setConnected(true);
        }
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/google/generateAuthUrl`, {
        params: { user: user },
      })
      .then((res) => {
        setGoogle(res.data);
      });
  }, []);

  const renderConnectButton = () => {
    if (connected) {
      return <Button onClick={revokeScopes}>Disconnect from Google</Button>;
    } else {
      return <Button href={google.url}>Integreate Google Api</Button>;
    }
  };

  return (
    <div className="integration">
      <AppNavbar />
      {renderConnectButton()}
    </div>
  );
};

export default Calendarintegration;
