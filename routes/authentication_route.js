const express = require("express");
const router = express.Router();

const {
  registerController,
  activationController,
  loginController,
  googleController,
  generateAuthUrl,
  googleCallback,
} = require("../controller/authentication_controller");

const {
  addEventController,
  getEventListController,
  deleteEventController,
  getEventByIdController,
  updateEventController,
  getActiveEventsController,
} = require("../controller/event_controller");

const {
  getUserController,
  getUserByUrl,
} = require("../controller/user_controller");

const { validateRegister, validateLogin } = require("../handlers/validation");

//POST Routes
router.post("/register", validateRegister, registerController);
router.post("/login", validateLogin, loginController);
router.post("/activate", activationController);
router.post("/googlelogin", googleController);

router.post("/addEvent", addEventController);
router.post("/deleteEvent", deleteEventController);
router.post("/updateEvent", updateEventController);

//GET Routes
router.get("/getActiveEvents", getActiveEventsController);
router.get("/getEvents", getEventListController);
router.get("/getUser", getUserController);
router.get("/getEventByID", getEventByIdController);
router.get("/findUserByUrl", getUserByUrl);

router.get("/generateAuthUrl", generateAuthUrl);
router.get("/oauthcallback", googleCallback);

module.exports = router;
