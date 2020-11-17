import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { isAuthenticated, authenticate } from "../helpers/auth";
import { Redirect, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "react-google-login";

/*------------ Styling --------------*/
import "../styles/login.css";

/*------------ Bootstrap Stuff  --------------*/
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

/*------------Font Awesome Icons --------------*/
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faUserPlus,
  faEnvelope,
  faLock,
  faSpinner,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
const iconSignIn = <FontAwesomeIcon icon={faSignInAlt} />;
const iconUserPlus = <FontAwesomeIcon icon={faUserPlus} />;
const iconEmail = <FontAwesomeIcon icon={faEnvelope} />;
const iconLock = <FontAwesomeIcon icon={faLock} />;
const iconSpinner = <FontAwesomeIcon icon={faSpinner} pulse />;
const iconCal = <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>;
const iconGoogle = <FontAwesomeIcon icon={faGoogle}></FontAwesomeIcon>;

const Login = ({ history }) => {
  /*- Google Login -*/
  const sendGoogleToken = (tokenId) => {
    axios
      .post(`${process.env.REACT_APP_API_URI}/googlelogin`, {
        idToken: tokenId,
      })
      .then((res) => {
        informParent(res);
      })
      .catch((error) => {
        console.log(error);
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  const responseGoogle = (response) => {
    console.log(response);
    sendGoogleToken(response.tokenId);
  };

  const informParent = (response) => {
    authenticate(response, () => {
      if (isAuthenticated()) {
        history.push("/app");
      }
    });
  };

  /*- End of Google login -*/

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    changeBtnTxt: "Login",
  });

  const { email, password, changeBtnTxt } = formData;

  const handleChangeEvent = (text) => (event) => {
    setFormData({ ...formData, [text]: event.target.value });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    if (email && password) {
      setFormData({ ...formData, changeBtnTxt: iconSpinner });
      axios
        .post(`${process.env.REACT_APP_API_URI}/login`, {
          email,
          password: password,
        })
        .then((res) => {
          console.log(res.data);
          authenticate(res, () => {
            setFormData({
              ...formData,
              email: "",
              password: "",
              changeBtnTxt: iconSpinner,
            });
            isAuthenticated();
            toast.success(`Hey ${res.data.user.name}, Welcome back!`);
          });
        })
        .catch((err) => {
          setFormData({
            ...formData,
            email: "",
            password: "",
            changeBtnTxt: "Sign In",
          });
          console.log(err.response);
          toast.error(err.response.data.errors);
        });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const onIconClick = () => {
    history.push("/landing");
  };
  return (
    <div className="login">
      {isAuthenticated() ? <Redirect to="/app" /> : null}
      <ToastContainer />
      <div className="login-container">
        <div className="calIcon" onClick={onIconClick}>
          {iconCal} Bookme
        </div>
        <p>Login to your Bookme account</p>
        <div className="loginbox">
          <Form onSubmit={handleOnSubmit}>
            <Form.Group controlId="email">
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>{iconEmail}</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  onChange={handleChangeEvent("email")}
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
                  onChange={handleChangeEvent("password")}
                  value={password}
                />
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit">
              {iconSignIn} {changeBtnTxt}
            </Button>

            <p></p>

            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_ID}
              buttonText="Login"
              accessType="offline"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  {iconGoogle} Sign in with Google
                </Button>
              )}
            ></GoogleLogin>

            <p>No account yet?</p>

            <Button
              variant="info"
              as={Link}
              to="/register"
              role="button"
              target="_self"
            >
              {iconUserPlus} Sign up
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
