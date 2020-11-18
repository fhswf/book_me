const express = require("express");
const router = express.Router();

const {
  addEventController,
  getEventListController,
  deleteEventController,
  getEventByIdController,
  updateEventController,
  getActiveEventsController,
  getEventByUrl,
} = require("../controller/event_controller");

router.post("/addEvent", addEventController);
router.delete("/deleteEvent", deleteEventController);
router.post("/updateEvent", updateEventController);
router.get("/getActiveEvents", getActiveEventsController);
router.get("/getEvents", getEventListController);
router.get("/getEventByID", getEventByIdController);
router.get("/getEventByUrl", getEventByUrl);

module.exports = router;
