import React, { useEffect, useState } from 'react';
import { signout, isAuthenticated } from './helpers/auth';
import { Link, Redirect } from 'react-router-dom';

import './styles/app.css'

import {
  Navbar,
  Nav,
  NavDropdown,
  ListGroup,
  Table,
  Button,
  ListGroupItem,

} from 'react-bootstrap'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import List from './components/eventlist'

const iconCal = <FontAwesomeIcon icon={faCalendar} />



const App = ({ history }) => {
  

  const addEventPressed = event => {
    event.preventDefault();

    const test = localStorage.getItem('user');
    var result = JSON.parse(test)
    var user = result._id;
    const name = "New Event";
    const location = "Zuhause";
    const duration = "30";
    const description = "Test event zum testen"
    axios.post(`${process.env.REACT_APP_API_URI}/addEvent`, {
      user,
      name,
      location,
      duration,
      description
    }).then(res => {
      console.log("axiosOK")
    }).catch(err => {
      console.log(err)
    })

  }



  const handleOnSubmit = event => {
    event.preventDefault();
    signout(localStorage.getItem('user'));
    history.push('/landing');
  }
  return (

    <div className="app">
      {!isAuthenticated() ? <Redirect to='/landing' /> : null}
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

      <div className="wrap-homebar">
        <div className="menu-wrapper">
          {iconCal} Bookme
        </div>

        <Navbar className="homebar">
          <Nav>
            <Nav.Link as={Link} to="/app">Startseite</Nav.Link>
          </Nav>

        </Navbar>

      </div>
      <div className="wrap-event-list">
        <div className="event-list">
          <Table bsPrefix="table-list">
            <tbody>
              <tr>
                <td>Name</td>
                <td><Button onClick={addEventPressed}>Add Event</Button></td>
              </tr>
            </tbody>
          </Table>
          <List>
            
          </List>
        </div>
      </div>
    </div>
  );
}

export default App;
