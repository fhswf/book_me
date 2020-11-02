import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Redirect,Route,Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';
import Register from './screens/register';
import Activate from './screens/activate';
import Login from './screens/login';
import Landing from './screens/landing';
import Edit from './screens/editeventtype'

import PrivateRoute from './routes/privateRoute';


ReactDOM.render(
  
  <React.StrictMode>  
    <BrowserRouter basename="bookme">
    <Switch>
      <PrivateRoute path="/app" exact component={App} />
      <Route path ='/register' exact render = {props => <Register {...props}/>}/>
      <Route path='/login' exact render={props => <Login {...props} />} />
      <Route path='/landing' exact render={props => <Landing {...props} />} />
      <Route path='/users/activate/:token' exact render={props => <Activate {...props} />} />
      <Route path='/edit' exact render={props => <Edit {...props} />} />
      <Route path="/"> <Redirect to='/app' /></Route>
    </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

