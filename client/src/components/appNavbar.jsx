import React from 'react';
import { Link} from 'react-router-dom';
import { signout } from '../helpers/auth';
import { ToastContainer } from 'react-toastify';

import '../styles/appNavbar.css';
import { Navbar, Nav, NavDropdown} from 'react-bootstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
const iconCal = <FontAwesomeIcon icon={faCalendar} />

const AppNavbar = ({useHistory}) => {


    return (
        <div className="appnavbar">
            <ToastContainer></ToastContainer>
            <div className="wrap-top-navbar">
                <Navbar sticky="top" className="top-navbar">
                    <Navbar.Brand as={Link} to="/app">{iconCal} Bookme </Navbar.Brand>
                    <div className="content-end">
                        <Nav>
                            <Nav.Link as={Link} to="/landing">Startseite</Nav.Link>
                        </Nav>
                        <Nav>
                            <NavDropdown title="Account">
                                <NavDropdown.Item>test1</NavDropdown.Item>
                                <NavDropdown.Item>test2</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={signout} as={Link} to="/landing"> Logout </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </div>
                </Navbar>
            </div>
        </div>
    )
}

export default AppNavbar;