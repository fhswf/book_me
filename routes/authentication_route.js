/** Express router providing authentication related routes
 * @module routers/auth
 */

const express = require("express");
const router = express.Router();

const {
  registerController,
  activationController,
  loginController,
  googleLoginController,
} = require("../controller/authentication_controller");

const { validateRegister, validateLogin } = require("../handlers/validation");

/**
 * Route to register a new user.
 * @name post/register
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @access public
 */
router.post("/register", validateRegister, registerController);

/**
 * Route to login a user.
 * @name post/login
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @access public
 */
router.post("/login", validateLogin, loginController);

/**
 * Route persist a new user into the DB.
 * @name post/activate
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @access public
 */
router.post("/activate", activationController);

/**
 * Route to login a user. When the user does not exist we create one.
 * @name post/google_oauth2_oidc
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @access public
 */
router.post("/google_oauth2_oidc", googleLoginController);

module.exports = router;
