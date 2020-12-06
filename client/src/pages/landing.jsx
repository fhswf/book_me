import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import "../styles/landing.css";

import { isAuthenticated } from "../helpers/helpers";
import { Link, Redirect } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCalendarCheck,
  faShare,
  faCheck,
  faSignInAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Jumbotron } from "react-bootstrap";
const iconCal = <FontAwesomeIcon icon={faCalendar} />;
const iconAddCal = <FontAwesomeIcon icon={faCalendarCheck} size="10x" />;
const iconShare = <FontAwesomeIcon icon={faShare} size="10x" />;
const iconCheck = <FontAwesomeIcon icon={faCheck} size="10x" />;
const signIn = <FontAwesomeIcon icon={faSignInAlt} />;
const signUp = <FontAwesomeIcon icon={faUserPlus} />;

const Landing = () => {
  return (
    <div className="landing">
      {isAuthenticated() ? <Redirect to="/app" /> : null}
      <div className="wrap-navbar">
        <Navbar sticky="top" expand="lg">
          <Navbar.Brand as={Link} to="/landing">
            {iconCal} Bookme{" "}
          </Navbar.Brand>
          <Nav className="content-end">
            <Nav.Link as={Link} to="/register">
              {signUp} Sign Up
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              {signIn} Sing In
            </Nav.Link>
          </Nav>
        </Navbar>
      </div>
      <div className="section">
        <div className="subsection">
          <div className="container">
            <h1 className="sectionheader">How Bookme works</h1>
            <div className="steps">
              <div className="row">
                <div className="stepone">
                  <div className="step-image">
                    <div className="icon">{iconAddCal}</div>
                  </div>
                  <div className="step-description">
                    <p>
                      <strong>Create Events</strong>
                    </p>

                    <p>
                      Create events. Setup your available times and you're good
                      to go!
                    </p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="steptwo">
                  <div className="step-image second">
                    <div className="icon">{iconShare}</div>
                  </div>
                  <div className="step-description">
                    <p>
                      <strong>Share your Link</strong>
                    </p>

                    <p>Users can use this link to book appointments.</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="stepthree">
                  <div className="step-image thrid">
                    <div className="icon">{iconCheck}</div>
                  </div>
                  <div className="step-description">
                    <p>
                      <strong>Done! Congrats!</strong>
                    </p>

                    <p>
                      Once a user books a appointment, the event is added to
                      your Calendar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
