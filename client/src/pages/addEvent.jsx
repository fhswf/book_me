import React,{useState} from 'react';
import axios from 'axios';

import {Form, FormGroup, InputGroup,Button, FormControl} from 'react-bootstrap';

import AppNavbar from '../components/appNavbar'
const AddEvent = ({history}) => {

    const test = localStorage.getItem('user');
    var result = JSON.parse(test)
    var user = result._id;

    const [formData, setFormData] = useState({
        name:'',
        location:'',
        description:'',
        duration:'',
        url: '',
        isActive: false
    });

    const testing = event  =>{
        event.preventDefault();
        console.log(test);
    }

    const {name,location,description,duration} = formData;
    

    const handleOnSubmit = event =>{
        event.preventDefault();
        
        setFormData({...formData})
        axios.post(`${process.env.REACT_APP_API_URI}/addEvent`, {
            user,
            name,
            location,
            duration,
            description,
            isActive:true,
          }).then(res => {
            history.push("/app");
          }).catch(err => {
            console.log(err)
          })
    }

    const handleOnChange = text => event =>{
        setFormData({...formData, [text]: event.target.value})
    }

    return(
        <div>
            <AppNavbar></AppNavbar>
            <h1>Add event Page</h1>
            <div className="addeventbox">
            <Form onSubmit={handleOnSubmit}>
            <FormGroup controlId = "name">
                <InputGroup>
                <FormControl
                type="name"
                placeholder="Event titel"
                onChange={handleOnChange('name')}
                value ={name}
                />
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <InputGroup>
                <FormControl
                type="location"
                placeholder="Location"
                onChange={handleOnChange('location')}
                value ={location}
                />
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <InputGroup>
                <FormControl
                type="description"
                placeholder="Description"
                onChange={handleOnChange('description')}
                value ={description}
                />
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <InputGroup>
                <FormControl as="textarea"
                type="duration"
                placeholder="Duration"
                onChange={handleOnChange('duration')}
                value ={duration}
                />
                </InputGroup>
            </FormGroup>
            <Button variant="primary" type="submit">
                            Speichern
            </Button>
            <Button onClick={testing}>
                Test
            </Button>
            </Form>
            </div>
        </div>
    )
}

export default AddEvent;