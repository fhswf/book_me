import React, { useEffect, useMemo, useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import { isAuthenticated, signout } from "./helpers";
import { getUserByToken } from "./services/user_services";

/**
 * Context containing the currently logged in user
 */
export const UserContext = React.createContext({ user: null });

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [user, setUser] = useState(null);
  const token = JSON.parse(localStorage.getItem("access_token") as string);
  const history = useHistory();

  useEffect(() => {
    getUserByToken(token)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          history.push("/landing");
        } else {
          console.log("getUserById: %o", res);
          setUser(res.data);
        }
      })
      .catch((err) => {
        // TODO: Add SnackBar
        //toast.error(err);
      });
  }, [history, token]);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          user ? (
            <UserContext.Provider value={{ user: user }}>
              <Component {...props} />
            </UserContext.Provider>
          ) : (
            <span>Waiting to get User</span>
          )
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
};

export default PrivateRoute;
