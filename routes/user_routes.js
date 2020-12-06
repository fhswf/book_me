/**
 * @module router/user
 */
const express = require("express");
const router = express.Router();
const {
  getUserController,
  getUserByUrl,
} = require("../controller/user_controller");

const { requireAuth } = require("../handlers/middleware");

/**
 * Route to fetch a the currently logged in user
 * @name get/getUser
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/getUser", requireAuth, getUserController);

/**
 * Route to fetch a user by a given url
 * @name get/findUserByUrl
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/findUserByUrl", getUserByUrl);

module.exports = router;
