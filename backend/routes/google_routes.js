/**
 * @module router/google
 */
const express = require("express");

const router = express.Router();

const {
  generateAuthUrl,
  googleCallback,
  revokeScopes,
  insertEventToGoogleCal,
} = require("../controller/google_controller");

const { requireAuth } = require("../handlers/middleware");

/**
 * Route to delete an access token from a given user
 * @name delete/revoke
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.delete("/revoke", requireAuth, revokeScopes);

/**
 * Route to generate an URL to connect the google cal api
 * @name get/generateUrl
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/generateUrl", requireAuth, generateAuthUrl);

/**
 * Callback function - Set in google developer console
 * @name get/oauthcallback
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/oauthcallback", googleCallback);

/**
 * Route to insert an event into the google calendar of a given user
 * @name post/insertEvent/:user_id
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post("/insertEvent/:user_id", insertEventToGoogleCal);

module.exports = router;
