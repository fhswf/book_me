import React from 'react';
import { signout } from './helpers/auth';
import Button from 'react-bootstrap/Button';
import {Link} from 'react-router-dom';
import './styles/app.css'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Jumbotron from 'react-bootstrap/Jumbotron'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
const iconCal = <FontAwesomeIcon icon={faCalendar} />



const App = ({ history, component: Component, ...rest }) => {

  const handleOnSubmit = event => {
    event.preventDefault();
    signout(localStorage.getItem('user'));
    history.push('/landing');
  }
  return (
    <div className="App">
      <div className="wrap-app">
        <div className="app-navbar">
          <Navbar>
            <Navbar.Brand as={Link} href="/app">{iconCal} Sprechstundenbuchung</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link as={Link} href="/app">Startseite</Nav.Link>
            </Nav>
            <NavDropdown title="Account" id="basic-nav-dropdown">
              <NavDropdown.Divider />
              <NavDropdown.Item >
                <Button onClick={handleOnSubmit}>
                  Logout
              </Button>
              </NavDropdown.Item>
            </NavDropdown>
          </Navbar>
        </div>
        <Jumbotron>
        <div className="card1">
                    <h1>Hier kommt die Startseite der App hin </h1>
                </div>
        </Jumbotron>
      </div>
    </div>
  );
}

export default App;
