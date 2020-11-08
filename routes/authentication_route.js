const express = require('express');
const router = express.Router();


const { 
    registerController,
    activationController,
    loginController,
    googleController,
} = require('../controller/authentication_controller');

const {
    addEventController,
    getEventListController,
    deleteEventController,
    getEventByIdController,
    updateEventController
} = require('../controller/event_controller')

const {
    validateRegister,
    validateLogin
} = require('../handlers/validation');

router.post('/register', validateRegister, registerController);
router.post('/login', validateLogin, loginController);
router.post('/activate', activationController);
router.post('/googlelogin', googleController);
router.post('/addEvent', addEventController);
router.post('/deleteEvent', deleteEventController);

router.post('/updateEvent',updateEventController)
router.get('/getEvents',getEventListController);

router.get('/getEventByID',getEventByIdController);

module.exports = router;