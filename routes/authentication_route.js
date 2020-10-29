const express = require('express');
const router = express.Router();


const { 
    registerController,
    activationController,
    loginController,
    googleController,
} = require('../controller/authentication_controller');


const {
    validateRegister,
    validateLogin
} = require('../handlers/validation');


router.post('/register', validateRegister, registerController);
router.post('/login', validateLogin, loginController);
router.post('/activate', activationController);
router.post('/googlelogin', googleController);

module.exports = router;