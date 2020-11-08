import React from 'react';
import { Link } from 'react-router-dom'

import { Dropdown } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
const iconConfig = <FontAwesomeIcon icon={faCog} />


const EventDropdownMenu = ({options}) => {

    const eventid = options;

    const handleOnDelete = event => {
        event.preventDefault();
        axios.post(`${process.env.REACT_APP_API_URI}/deleteEvent`, { eventid })
        window.location.reload(false);
    }

    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {iconConfig}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item as={Link} to={`/editevent/${eventid}`} >Edit</Dropdown.Item>
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Item onClick={handleOnDelete}>Delete</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default EventDropdownMenu;