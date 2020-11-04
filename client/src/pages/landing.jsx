import React from 'react';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Jumbotron from 'react-bootstrap/Jumbotron'
import '../styles/landing.css'

import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
const iconCal = <FontAwesomeIcon icon={faCalendar} />

const Landing = () => {
    return (
        <div className="landing">
            <div className="wrap-navbar">
            
            <Navbar sticky="top" expand="lg">
                <Navbar.Brand as={Link} to="/landing">{iconCal} Bookme </Navbar.Brand>
                <Nav className="content-end">
                    <Nav.Link as={Link} to="/register">Sign Up</Nav.Link>
                    <Nav.Link as={Link} to="/login">Sing In</Nav.Link>
                    <Nav.Link as={Link} to="/landing">First Steps Guide(coming soon)</Nav.Link>
                </Nav>
            </Navbar>
            </div>
            <Jumbotron>
                <h1>Landing Page</h1>
            </Jumbotron>
        </div>
    )
}

export default Landing;