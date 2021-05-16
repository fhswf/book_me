import React, { useState, useEffect, useContext } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { getUserByToken } from "../helpers/services/user_services";
import EventList from "../components/EventList";
import AppNavbar from "../components/appNavbar";

import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  Paper,
  Typography,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

import { signout } from "../helpers/helpers";
import { UserContext } from "../helpers/privateRoute";

const App = () => {
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("access_token") as string);
  const user = useContext(UserContext).user;
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    getUserByToken(token)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          history.push("/landing");
        }
        if (!res.data.google_tokens || !res.data.google_tokens.access_token) {
          setConnected(false);
        } else {
          setConnected(true);
        }
      })
      .catch((err) => {
        // TODO: Add SnackBar
        //toast.error(err);
      });
  }, []);

  const addEventButton = () => {
    if (connected) {
      return (
        <Button href="addevent" variant="contained" startIcon={<AddIcon />}>
          Add Event Type
        </Button>
      );
    } else {
      return (
        <Link component={RouterLink} className="calcon" to="integration">
          You need to connect your Calendar first, before you can add Events!
        </Link>
      );
    }
  };

  const renderList = () => {
    if (user && connected) {
      return <EventList url={user.user_url} userid={user._id} />;
    }
  };

  return (
    <>
      <AppNavbar />
      <Container>
        <Box p="1em">
          <Typography variant="h3" gutterBottom>
            My Event Types
          </Typography>
          <Grid container justifyContent="space-between" alignItems="center">
            {user ? (
              <>
                <Grid item>
                  {user.name}
                  <br />
                  <Link component={RouterLink} to={"/users/" + user.user_url}>
                    {history.createHref({
                      pathname: `/users/${user.user_url}`,
                    })}
                  </Link>
                </Grid>
                <Grid item>{addEventButton()}</Grid>
              </>
            ) : (
              <span>Loading</span>
            )}
          </Grid>
        </Box>

        <Box p="1em">{renderList()}</Box>
      </Container>
    </>
  );
};

export default App;