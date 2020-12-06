import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../helpers/helpers";

//If a user isnt authenticated the user gets Redirected to /landing

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/landing",
            state: { from: props.location },
          }}
        />
      )
    }
  ></Route>
);

export default PrivateRoute;
