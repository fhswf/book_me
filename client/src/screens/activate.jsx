import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { isAuthenticated } from '../helpers/auth';
import { Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/activation.css'


/*------------Font Awesome Icons --------------*/
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

const iconUserPlus = <FontAwesomeIcon icon={faUserPlus} />
const iconSignIn = <FontAwesomeIcon icon={faSignInAlt} />


const Activate = ({ match, history }) => {

  const [formData, setFormData] = useState({
    name: '',
    token: '',
    show: true
  });
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setFormData({ ...formData, name, token });
    }
  //  console.log(token, name);
  }, [match.params]);

  const { name, token } = formData;

  const handleOnSubmit = e => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_API_URI}/activate`, {
        token
      }).then(res => {
        setFormData({
          ...formData,
          show: false
        });
        
        console.log(res.data.message);
        toast.success(res.data.message);

        sleep(3000).then(() => {
          history.push('/login')
        })
      })
      .catch(err => {
        toast.error(err.response.data.errors);
      });
  };

  return (
    <div className="limiter">
      {isAuthenticated() ? <Redirect to='/app' /> : null}
      <ToastContainer
        autoClose={2500} />
      <div className="activate-container">
        <div className="activatebox">
          <Form onSubmit={handleOnSubmit}>
            <h1>
              Welcome {name}
            </h1>
            <Button variant="primary" type="submit">
              {iconUserPlus} Activate your Account
                </Button>
            <p>Already got an Account?</p>
            <Button variant="primary" href="/login" role="button" target="_self">
              {iconSignIn} Sign in
                </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}


export default Activate;