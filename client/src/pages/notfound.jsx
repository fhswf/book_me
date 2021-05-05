import React from "react";

import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';

import "../styles/notfound.css";

const NotFound = () => {
  return (
    <div className="notfound">
      <h1>404</h1>
      <h3>page not found</h3>
      <Button variant="contained" as={Link} href="/app">
        GO HOME
      </Button>
    </div>
  );
};

export default NotFound;
