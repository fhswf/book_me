import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import App from "./App";
import Register from "./pages/register";
import Activate from "./pages/activate";
import Login from "./pages/login";
import Landing from "./pages/landing";
import AddEvent from "./pages/addEvent";
import Planing from "./pages/planing";
import NotFound from "./pages/notfound";
import Booking from "./pages/booking";
import EditEvent from "./pages/editevent";
import PrivateRoute from "./routes/privateRoute";
import Calendarintegration from "./pages/calendarint";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <PrivateRoute path="/app" exact component={App} />
        <PrivateRoute path="/addevent" exact component={AddEvent} />
        <PrivateRoute path="/editevent/:id" exact component={EditEvent} />

        <PrivateRoute
          path="/integration"
          exact
          component={Calendarintegration}
        />

        <Route
          path="/register"
          exact
          render={(props) => <Register {...props} />}
        />
        <Route path="/login" exact render={(props) => <Login {...props} />} />
        <Route
          path="/landing"
          exact
          render={(props) => <Landing {...props} />}
        />
        <Route
          path="/users/activate"
          exact
          render={(props) => <Activate {...props} />}
        />
        <Route path="/:url" exact render={(props) => <Planing {...props} />} />
        <Route
          path="/:user/:name"
          exact
          render={(props) => <Booking {...props} />}
        />
        <Route path="*" component={NotFound} />
        <Route path="/notfound" component={NotFound} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
