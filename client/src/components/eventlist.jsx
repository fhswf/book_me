import React,{useState,useEffect} from 'react'
import axios from 'axios'


import Dropdown from './eventDropdownMenu';

function EventList() {

    const localuser = localStorage.getItem('user');
    var result = JSON.parse(localuser);
    var userid = result._id;

    const [events,setEvents] = useState([]);

    useEffect( ()=>{
        axios.get(`${process.env.REACT_APP_API_URI}/getEvents`, {params: {user: userid}})
        .then(res =>{
                setEvents(res.data);  
        })
        .catch(err =>{
            console.log(err);
        })
    },[userid])



    return(
        <div>
            <ul>
                {
                    events.map( events => <li key={events._id}>{events.name}<Dropdown options={events._id}/></li>)
                }
            </ul>
        </div>
    )
}

export default EventList;