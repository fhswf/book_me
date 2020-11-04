const express = require('express');
const router = express.Router();


const { 
    registerController,
    activationController,
    loginController,
    googleController,
} = require('../controller/authentication_controller');

const { addEventController,
getEventListController } = require('../controller/event_controller')

const {
    validateRegister,
    validateLogin
} = require('../handlers/validation');


router.post('/register', validateRegister, registerController);
router.post('/login', validateLogin, loginController);
router.post('/activate', activationController);
router.post('/googlelogin', googleController);
router.post('/addEvent', addEventController);

router.get('/getEvents',getEventListController);

module.exports = router;