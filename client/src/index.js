import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Redirect,Route,Switch} from 'react-router-dom';


import App from './App';
import Register from './pages/register';
import Activate from './pages/activate';
import Login from './pages/login';
import Landing from './pages/landing';
import AddEvent from './pages/addEvent';


import PrivateRoute from './routes/privateRoute';
import EditEvent from './pages/editevent';


ReactDOM.render(
  
  <React.StrictMode>  
    <BrowserRouter basename="bookme">
    <Switch>
      <PrivateRoute path="/app" exact component={App}/>
      <PrivateRoute path='/addevent' exact component={AddEvent}/>
      <PrivateRoute path='/editevent/:id' exact component={EditEvent}/>
      <Route path ='/register' exact render = {props => <Register {...props}/>}/>
      <Route path='/login' exact render={props => <Login {...props} />} />
      <Route path='/landing' exact render={props => <Landing {...props} />} />
      <Route path='/users/activate/:token' exact render={props => <Activate {...props} />} />
      <Route path="/"> <Redirect to='/app' /></Route>
    </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

