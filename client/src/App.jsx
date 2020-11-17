import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import EventList from "./components/eventlist";
import AppNavbar from "./components/appNavbar";

import "./styles/app.css";
import { Navbar, Nav, Table, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const iconPlus = <FontAwesomeIcon icon={faPlus} size="xs" />;

const App = () => {
  const test = localStorage.getItem("user");
  var result = JSON.parse(test);
  var userID = result._id;

  const [user, setUser] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/getUser`, {
        params: { user: userID },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userID]);

  return (
    <div className="app">
      <AppNavbar />
      <div className="wrap-homebar">
        <div className="menu-wrapper">Personal Site</div>
        <Navbar className="homebar">
          <Nav>
            <Nav.Link as={Link} to="/app">
              Events
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>
      <div className="wrap-event-list">
        <div className="event-list">
          <Table className="table-list">
            <tbody>
              <tr>
                <td className="profileinfo">
                  {user.name}
                  <br></br>

                  <a href={process.env.REACT_APP_URL + user.user_url}>
                    Your Link: {user.user_url}
                  </a>
                </td>
                <td className="addeventbtn">
                  <div className="wrap-button">
                    <Button className="mybtn" as={Link} to="/addevent">
                      {iconPlus} Add Event
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
          <EventList></EventList>
        </div>
      </div>
    </div>
  );
};

export default App;
