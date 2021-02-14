import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import AppNavbar from "../components/appNavbar";

import "../styles/calendarint.css";
import { Button } from "react-bootstrap";
import { getUserById } from "../helpers/services/user_services";
import { deleteAccess, getAuthUrl, getCalendarList } from "../helpers/services/google_services";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { ToastContainer, toast } from "react-toastify";
const iconGoogle = (
  <FontAwesomeIcon icon={faGoogle} size="3x"></FontAwesomeIcon>
);

const Calendarintegration = () => {
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("access_token"));
  const [connected, setConnected] = useState(false);
  const [url, setUrl] = useState("");
  const [calendarList, setCalendarList] = useState(null);


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
      console.log('connected: %s', connected);
      
        getCalendarList(token)
        .then(res => {
          setCalendarList(res.data.data)
          console.log('calendarList: %o', res.data.data)
        })
      
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

  const renderCalendarList = () => {
    if (connected) {
      console.log("calendarList: %o", calendarList);
      let items = "Liste";
      if (calendarList) {
        console.log("???");
        items = calendarList.items.map(item => {
          return (
            <div>
            <label>
              <input name={item.id} type="checkbox" checked={item.primary}></input>
              {item.summaryOverride ? item.summaryOverride : item.summary}
            </label>
            </div> 
          )
        })
      }
      return (
        <div>{items}</div>
      );
    }
  }

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
      <div className="wrapcontent">
      {renderCalendarList()}
      </div>
    </div>
  );
};

export default Calendarintegration;
