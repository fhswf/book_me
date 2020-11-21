const express = require("express");
const router = express.Router();

const { validateAddEvent } = require("../handlers/validation");

const {
  addEventController,
  getEventListController,
  deleteEventController,
  getEventByIdController,
  updateEventController,
  getActiveEventsController,
  getEventByUrl,
  getAvailableTimesForDay,
} = require("../controller/event_controller");

router.post("/addEvent", validateAddEvent, addEventController);
router.post("/deleteEvent", deleteEventController);
router.post("/updateEvent", updateEventController);
router.get("/getActiveEvents", getActiveEventsController);
router.get("/getEvents", getEventListController);
router.get("/getEventByID", getEventByIdController);
router.get("/getEventByUrl", getEventByUrl);
router.get("/getavailable", getAvailableTimesForDay);

module.exports = router;
