import React from "react";
import { Link, useHistory } from "react-router-dom";
import { signout } from "../helpers/auth";
import { ToastContainer } from "react-toastify";

import "../styles/appNavbar.css";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
const iconCal = <FontAwesomeIcon icon={faCalendar} />;

const AppNavbar = () => {
  let history = useHistory();

  const handleLogout = (event) => {
    event.preventDefault();
    signout();
    history.push("/landing");
  };

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
                Startseite
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
                <NavDropdown.Item>Share your Link!</NavDropdown.Item>
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
