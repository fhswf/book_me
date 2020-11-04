import React from 'react';
import { isAuthenticated } from './helpers/auth';
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
import EventList from './components/eventlist';
import AppNavbar from './components/appNavbar';
const iconCal = <FontAwesomeIcon icon={faCalendar} />



const App = () => {
 
  return (
    <div className="app">
      {!isAuthenticated() ? <Redirect to='/landing' /> : null}
      <AppNavbar />
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
