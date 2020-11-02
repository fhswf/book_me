import React from 'react';
import { signout, isAuthenticated } from './helpers/auth';
import { Link, Redirect } from 'react-router-dom';

import './styles/app.css'


import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import ListGroup from 'react-bootstrap/ListGroup'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button';


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
    <div className="page">
      {!isAuthenticated() ? <Redirect to='/landing' /> : null}
      <div className="wrap-top-navbar">
        <Navbar sticky="top">
          <Navbar.Brand as={Link} to="/app">{iconCal} Bookme </Navbar.Brand>
          <div className="content-end">
            <Nav>
              <Nav.Link as={Link} to="/landing">Startseite</Nav.Link>
            </Nav>

            <Nav>
              <NavDropdown title="Account">
                <NavDropdown.Item><Button>Accountsettings</Button></NavDropdown.Item>
                <NavDropdown.Item><Button>Share your link</Button></NavDropdown.Item>
                <NavDropdown.Divider/>
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
          <Navbar bsPrefix="homebar">
            <Navbar.Brand>Eventtypes</Navbar.Brand>
              <Nav>
                <Nav.Link as={Link} to="/app"> <div className="buttontxt">Eventtypes</div> </Nav.Link>
                <Nav.Link as={Link} to="/app"> <div className="buttontxt">Test</div> </Nav.Link>
              </Nav>
          </Navbar>
      </div>
          <div className="wrap-event-list">
            <div className="event-list">
              <Table bsPrefix="table-list">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td><Button>Add Event</Button></td>
                  </tr>
                </tbody>
              </Table>
              <ListGroup>
                <ListGroup.Item as={Link} to="/edit" >Event</ListGroup.Item>
                <ListGroup.Item>Event</ListGroup.Item>
                <ListGroup.Item>Event</ListGroup.Item>
                <ListGroup.Item>Event</ListGroup.Item>
                <ListGroup.Item>Event</ListGroup.Item>
              </ListGroup>
            </div>
          </div>
        </div>
  );
}

export default App;
