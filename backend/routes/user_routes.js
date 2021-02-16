/**
 * @module router/user
 */
const express = require("express");
const router = express.Router();
const {
  getUser,
  getUserByUrl,
  putUser
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
router.get("/user", requireAuth, getUser);

/**
 * Route to fetch a user by a given url
 * @name get/findUserByUrl
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get("/findUserByUrl", getUserByUrl);

/**
 * Update the currently logged in user
 */
router.put("/user", requireAuth, putUser);

module.exports = router;
