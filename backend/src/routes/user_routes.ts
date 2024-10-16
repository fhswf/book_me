/**
 * @module router/user
 */
import { Router } from "express";
import { getUser, getUserByUrl, putUser } from "../controller/user_controller.js";

import { middleware } from "../handlers/middleware.js";

export const userRouter = Router();


/**
 * Route to fetch a the currently logged in user
 * @name get/getUser
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
userRouter.get("/user", middleware.requireAuth, getUser);

/**
 * Route to fetch a user by a given url
 * @name get/findUserByUrl
 * @function
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
userRouter.get("/user/:url", getUserByUrl);
userRouter.get("/findUserByUrl", getUserByUrl);

/**
 * Update the currently logged in user
 */
userRouter.put("/user", middleware.requireAuth, putUser);

export default userRouter;
