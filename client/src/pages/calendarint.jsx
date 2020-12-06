import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import AppNavbar from "../components/appNavbar";

import "../styles/calendarint.css";
import { Button } from "react-bootstrap";
import { getUserById } from "../helpers/services/user_services";
import { deleteAccess, getAuthUrl } from "../helpers/services/google_services";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";
const iconGoogle = (
  <FontAwesomeIcon icon={faGoogle} size="3x"></FontAwesomeIcon>
);

const Calendarintegration = () => {
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("access_token"));
  const [connected, setConnected] = useState(false);
  const [url, setUrl] = useState("");

  const revokeScopes = (event) => {
    event.preventDefault();
    deleteAccess(token).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      }
      setConnected(false, window.location.reload());
    });
  };

  useEffect(() => {
    getUserById(token).then((res) => {
      if (res.data.success === false) {
        signout();
        history.push("/landing");
      }
      if (!res.data.google_tokens.access_token) {
        setConnected(false);
      } else {
        setConnected(true);
      }
      getAuthUrl(token).then((res) => {
        if (res.data.success === false) {
          signout();
          history.push("/landing");
        } else {
          setUrl(res.data);
        }
      });
    });
  }, [history, token]);

  const renderConnectButton = () => {
    if (connected) {
      return (
        <Button className="connectbtn" onClick={revokeScopes}>
          Disconnect from Google
        </Button>
      );
    } else {
      return (
        <Button className="connectbtn" href={url.url}>
          Connect Google Calendar
        </Button>
      );
    }
  };

  return (
    <div className="integration">
      <AppNavbar />
      <div className="wrapcontent">
        <div className="wrapcalendar">
          <div className="left">
            {iconGoogle} <h4 className="calendarName">Calendar</h4>
          </div>
          <div className="right">{renderConnectButton()}</div>
        </div>
      </div>
    </div>
  );
};

export default Calendarintegration;
