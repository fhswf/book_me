import React, { useState, useEffect } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { getUserById } from "./helpers/services/user_services";
import EventList from "./components/eventList";
import AppNavbar from "./components/appNavbar";

import { Box, Button, Container, Grid, Link, Paper, Typography } from '@material-ui/core';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

import AddIcon from '@material-ui/icons/Add';

import { signout } from "./helpers/helpers";

const App = () => {
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("access_token"));
  const [user, setUser] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    getUserById(token)
      .then((res) => {
        if (res.data.success === false) {
          signout();
          history.push("/landing");
        } else {
          console.log("getUserById: %o", res)
          setUser(res.data);
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

  const renderConnectButton = () => {
    if (connected) {
      return (
        <Button href="addevent" variant="contained" startIcon={<AddIcon />}>
          Add Event Type
        </Button >
      );
    } else {
      return (
        <Link component={RouterLink} className="calcon" as={Link} to="integration">
          You need to connect your Calendar first, before you can add Events!
        </Link>
      );
    }
  };

  const renderList = () => {
    if (connected) {
      return <EventList url={user.user_url} />;
    }
  };

  // TODO: Remove Table
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppNavbar />
      <Paper>
        <Box p="1em">
          <Typography variant="h3" gutterBottom>My Event Types</Typography>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              {user.name}<br />
              <Link
                component={RouterLink}
                to={"/users/" + user.user_url}
              >
                {history.createHref({ pathname: `/users/${user.user_url}` })}
              </Link>
            </Grid>
            <Grid item>{renderConnectButton()}</Grid>
          </Grid>
        </Box>

        <Box p="1em">
          {renderList()}
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default App;
