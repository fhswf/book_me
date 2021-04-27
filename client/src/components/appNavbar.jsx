import React, { useCallback, useRef, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { isAuthenticated, signout } from "../helpers/helpers";
import { toast, ToastContainer } from "react-toastify";

//import { Avatar } from 'primereact/avatar';
//import { Button } from 'primereact/button';
//import { Menu } from 'primereact/menu';

import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/Settings';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';

//import "../styles/topbar.scss";
//import { Navbar, Nav, NavDropdown } from "react-bootstrap";

//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { getUserById } from "../helpers/services/user_services";
//const iconCal = <FontAwesomeIcon icon={faCalendar} />;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const AppNavbar = () => {
  const classes = useStyles();
  const history = useHistory();
  const [link, setLink] = useState("");
  const [user, setUser] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const token = JSON.parse(localStorage.getItem("access_token"));
  const menu = useRef(null);

  const handleLogout = () => {
    signout();
    history.push("/landing");
  };

  const handleLogin = () => {
    history.push("/login");
  };

  const copyToClipboard = () => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = link;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    toast.success("Copied Link to Clipboard");
  };

  useEffect(() => {
    getUserById(token).then((res) => {
      setUser(res.data);
      setLink(process.env.REACT_APP_URL + "users/" + res.data.user_url);
    });
  }, []);


  const items = [
    {
      label: 'Profile',
      items: [
        {
          label: 'Logout',
          icon: 'pi pi-logout',
          command: handleLogout
        },
        {
          label: 'Share your link',
          icon: 'pi pi-copy',
          command: copyToClipboard
        },
        {
          label: 'Calendar configuration',
          icon: 'pi pi-config',
          command: () => history.push('/integration')
        }
      ]
    },
  ];

  const handleOnClick = (target) => { return () => history.push(target); };

  const menuId = 'primary-search-account-menu';

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const loginout = isAuthenticated() ?
    (<MenuItem onClick={handleLogout}>Log Out</MenuItem>) :
    (<MenuItem onClick={handleLogin}>Log In</MenuItem>)

  const userMenu = (
    <>
      < MenuItem onClick={handleMenuClose} >
        <ListItemIcon><CalendarTodayIcon fontSize="small" /></ListItemIcon>
        <ListItemText>Profile</ListItemText></MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </>
  )

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {userMenu}
      {loginout}
    </Menu>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
            onClick={handleOnClick("/app")} >
            <CalendarTodayIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            BookMe
          </Typography>
          <div>
            <IconButton aria-label="Calendar Settings" color="inherit" onClick={handleOnClick("/integration")}>
              <SettingsIcon />
            </IconButton>
            <Menu model={items} popup ref={menu} id="popup_menu" />
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <Avatar src={user ? user.picture_url : null} shape="circle" />
            </IconButton>

          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
    /*
        <div className="appnavbar">
          <ToastContainer />
    
    
    
          <div className="wrap-top-navbar">
            <Navbar sticky="top" className="top-navbar">
              <Navbar.Brand as={Link} to="/app">
                {iconCal} Bookme{" "}
              </Navbar.Brand>
              <div className="content-end">
                <Nav>
                  <Nav.Link as={Link} to="/landing">
                    Start
                  </Nav.Link>
                </Nav>
                <Nav>
                  <Nav.Link as={Link} to="/integration">
                    Calendar Integration
                  </Nav.Link>
                </Nav>
                <Nav>
                  <NavDropdown title="Account">
                    <NavDropdown.Item as={Link} to="/integration">
                      Calendar Integration
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={copyToClipboard}>
                      Share your Link!
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </div>
            </Navbar>
          </div>
        </div>
        */
  );
};

export default AppNavbar;
