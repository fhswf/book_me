import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { signout } from "../helpers/helpers";
import { toast, ToastContainer } from "react-toastify";

import "../styles/appNavbar.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { getUserById } from "../helpers/services/user_services";
const iconCal = <FontAwesomeIcon icon={faCalendar} />;

const AppNavbar = () => {
  const history = useHistory();
  const [link, setLink] = useState("");
  const token = JSON.parse(localStorage.getItem("access_token"));

  const handleLogout = (event) => {
    event.preventDefault();
    signout();
    history.push("/landing");
  };
  const copyToClipboard = (e) => {
    e.preventDefault();
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = link;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    toast.success("Copied Link to Clipboard");
  };

  useEffect(() => {
    getUserById(token).then((res) => {
      setLink(process.env.REACT_APP_URL + "users/" + res.data.user_url);
    });
  }, []);
  return (
    <div className="appnavbar">
      <ToastContainer />
      <div className="wrap-top-navbar">
        <Navbar sticky="top" className="top-navbar">
          <Navbar.Brand as={Link} to="/app">
            {iconCal} Bookme{" "}
          </Navbar.Brand>
          <div className="content-end">
            <Nav>
              <Nav.Link as={Link} to="/landing">
                Start
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/integration">
                Calendar Integration
              </Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown title="Account">
                <NavDropdown.Item as={Link} to="/integration">
                  Calendar Integration
                </NavDropdown.Item>
                <NavDropdown.Item onClick={copyToClipboard}>
                  Share your Link!
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </div>
        </Navbar>
      </div>
    </div>
  );
};

export default AppNavbar;
