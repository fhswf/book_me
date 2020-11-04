import React from 'react';
import { Link } from 'react-router-dom';
import { signout } from '../helpers/auth';

import '../styles/appNavbar.css';
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
const iconCal = <FontAwesomeIcon icon={faCalendar} />

const AppNavbar = ({ history }) => {

    const handleOnSubmit = event => {
        event.preventDefault();
        signout(localStorage.getItem('user'));
        history.push('/landing');
    }
    return (
        <div className="appnavbar">
            <div className="wrap-top-navbar">
                <Navbar sticky="top" className="top-navbar">
                    <Navbar.Brand as={Link} to="/app">{iconCal} Bookme </Navbar.Brand>
                    <div className="content-end">
                        <Nav>
                            <Nav.Link as={Link} to="/landing">Startseite</Nav.Link>
                        </Nav>
                        <Nav>
                            <NavDropdown title="Account">
                                <NavDropdown.Item><Button>Accountsettings</Button></NavDropdown.Item>
                                <NavDropdown.Item><Button>Share your link</Button></NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item >
                                    <Button onClick={handleOnSubmit}>
                                        Logout
                                     </Button>
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </div>
                </Navbar>
            </div>
        </div>
    )
}

export default AppNavbar;