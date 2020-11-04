import React, { useEffect, useState } from 'react';
import { signout, isAuthenticated } from './helpers/auth';
import { Link, Redirect } from 'react-router-dom';

import './styles/app.css'

import {
  Navbar,
  Nav,
  Table,
  Button,
} from 'react-bootstrap'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import EventList from './components/eventlist';
import AppNavbar from './components/appNavbar';
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


  return (

    <div className="app">
      {!isAuthenticated() ? <Redirect to='/landing' /> : null}
      <AppNavbar/>
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
                <td><Button as={Link} to="/addevent">Add Event</Button></td>
              </tr>
            </tbody>
          </Table>
          <EventList>
            
          </EventList>
        </div>
      </div>
    </div>
  );
}

export default App;
