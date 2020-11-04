import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { isAuthenticated } from '../helpers/auth';
import { Redirect, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/register.css'

/*------------ Bootstrap Stuff  --------------*/
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button';


/*------------Font Awesome Icons --------------*/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faSpinner, faUserPlus, faEnvelope, faUser, faLock, faCalendar } from '@fortawesome/free-solid-svg-icons'
const iconSpinner = <FontAwesomeIcon icon={faSpinner} pulse />
const iconSignIn = <FontAwesomeIcon icon={faSignInAlt} />
const iconUserPlus = <FontAwesomeIcon icon={faUserPlus} />
const iconEmail = <FontAwesomeIcon icon={faEnvelope} />
const iconUser = <FontAwesomeIcon icon={faUser} />
const iconLock = <FontAwesomeIcon icon={faLock} />
const iconCal = <FontAwesomeIcon icon={faCalendar} />


const Register = ({ history }) => {
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        changeBtnTxt: 'Register'
    })
    const { name, email, password, password2, changeBtnTxt } = formData;

    const handleChangeEvent = text => event => {
        setFormData({ ...formData, [text]: event.target.value })
    }

    const handleOnSubmit = event => {
        event.preventDefault();
        if (name && email && password) {
            if (password === password2) {
                setFormData({ ...formData, changeBtnTxt: iconSpinner });
                axios
                    .post(`${process.env.REACT_APP_API_URI}/register`, {
                        name,
                        email,
                        password: password
                    })
                    .then(res => {
                        setFormData({
                            ...formData,
                            name: '',
                            email: '',
                            password: '',
                            password2: '',
                            changeBtnTxt: 'Submitted'
                        });

                        toast.success(res.data.message);
                    })
                    .catch(err => {
                        setFormData({
                            ...formData,
                            name: '',
                            email: '',
                            password: '',
                            password2: '',
                            changeBtnTxt: 'Sign Up'
                        });
                        console.log(err.response);
                        toast.error(err.response.data.errors);
                    });
            } else {
                toast.error("Passwords don't matches");
            }
        } else {
            toast.error('Please fill all fields');
        }
    }
    const onIconClick = () => {
        if (isAuthenticated()) {
            history.push("/app");
        } else {
            history.push("/landing");
        }
    }

    return (
        <div className="register">
            {isAuthenticated() ? <Redirect to='/app' /> : null}
            <ToastContainer />
            <div className="register-container">
            <div className="calIcon" onClick={onIconClick} >
                        {iconCal} Bookme
            </div>
            <p>Sign up for Bookme</p>
                <div className="registerbox">
                    <Form onSubmit={handleOnSubmit}>
                        <Form.Group controlId="name">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>{iconUser}</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="name"
                                    placeholder="Name"
                                    onChange={handleChangeEvent('name')}
                                    value={name}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="email">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>{iconEmail}</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="email"
                                    placeholder="name@example.com"
                                    onChange={handleChangeEvent('email')}
                                    value={email}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>{iconLock}</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    onChange={handleChangeEvent('password')}
                                    value={password}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group controlId="password2">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text>{iconLock}</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="password"
                                    placeholder="Reapeat password"
                                    onChange={handleChangeEvent('password2')}
                                    value={password2}
                                />
                            </InputGroup>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {iconUserPlus} {changeBtnTxt}
                        </Button>

                        <p>Already got an Account?</p>

                        <Button variant="info" as={Link} to="/login" role="button" target="_self">
                            {iconSignIn} Sign in
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};
export default Register;