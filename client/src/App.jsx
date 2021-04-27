import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { getUserById } from "./helpers/services/user_services";
import EventList from "./components/eventlist";
import AppNavbar from "./components/appNavbar";

import { Button, Table } from '@material-ui/core';

import { signout } from "./helpers/helpers";

import "./styles/app.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const iconPlus = <FontAwesomeIcon icon={faPlus} size="xs" />;

const App = () => {
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("access_token"));
  const [user, setUser] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    getUserById(token)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          history.push("/landing");
        } else {
          console.log("getUserById: %o", res)
          setUser(res.data);
        }
        if (!res.data.google_tokens || !res.data.google_tokens.access_token) {
          setConnected(false);
        } else {
          setConnected(true);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  const renderConnectButton = () => {
    if (connected) {
      return (
        <Button href="addevent">
          {iconPlus} Add Event
        </Button>
      );
    } else {
      return (
        <Link className="calcon" as={Link} href="integration">
          You need to connect your Calendar first, before you can add Events!
        </Link>
      );
    }
  };

  const renderList = () => {
    if (connected) {
      return <EventList url={user.user_url} />;
    }
  };

  // TODO: Remove Table
  return (
    <div className="app">
      <AppNavbar />

      <div className="wrap-event-list">
        <div className="event-list">
          <Table className="table-list">
            <tbody>
              <tr>
                <td className="profileinfo">
                  {user.name}
                  <br></br>

                  <a
                    href={process.env.REACT_APP_URL + "/users/" + user.user_url}
                  >
                    Your Link: {user.user_url}
                  </a>
                </td>
                <td className="addeventbtn">{renderConnectButton()}</td>
              </tr>
            </tbody>
          </Table>
          {renderList()}
        </div>
      </div>
    </div>
  );
};

export default App;
