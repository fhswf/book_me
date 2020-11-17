import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../styles/notfound.css";

const NotFound = () => {
  return (
    <div className="notfound">
      <h1>404</h1>
      <h3>page not found</h3>
      <Button variant="info" as={Link} to="/app" role="button" target="_self">
        GO HOME
      </Button>
    </div>
  );
};

export default NotFound;
