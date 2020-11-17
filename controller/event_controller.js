const Event = require("../models/Event");

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

exports.addEventController = (req, res) => {
  const eventToSave = new Event({
    user: req.body.user,
    name: req.body.name,
    location: req.body.location,
    duration: req.body.duration,
    description: req.body.description,
    url: req.body.user_url,
    isActive: req.body.isActive,

    available: {
      mon: req.body.mon,
      tue: req.body.tue,
      wen: req.body.wen,
      thu: req.body.thu,
      fri: req.body.fri,
      sat: req.body.sat,
      sun: req.body.sun,
    },
  });
  eventToSave.save((err, eventToSave) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .json({ errors: "Could not save the Event to the Database" });
    } else {
      return res.json({
        success: true,
        message: eventToSave,
        message: "Event Saved",
      });
    }
  });
};

exports.deleteEventController = (req, res) => {
  const { eventid } = req.body;

  Event.findByIdAndDelete(eventid, function (err) {
    if (err) {
      console.log(err);
    }
  });
};

exports.getEventListController = (req, res) => {
  const userid = req.query.user;

  const query = Event.find({ user: userid });
  query.exec(function (err, event) {
    if (err) {
      return err;
    } else {
      return res.json(event);
    }
  });
};

exports.getActiveEventsController = (req, res) => {
  const userid = req.query.user;
  const query = Event.find({ user: userid, isActive: true });
  query.exec(function (err, event) {
    if (err) {
      return res.json(null, err);
    } else {
      return res.json(event);
    }
  });
};

exports.getEventByIdController = (req, res) => {
  const eventID = req.query.event;

  const query = Event.findById({ _id: eventID });

  query.exec(function (err, event) {
    if (err) {
      return res.json(null);
    } else {
      return res.json(event);
    }
  });
};

exports.updateEventController = (req, res) => {
  const event = req.body;

  var query = { _id: event.eventID };

  Event.findByIdAndUpdate(query, req.body, { upsert: true }, function (
    err,
    event
  ) {
    if (err) {
      return err;
    } else {
      return res.json("Update successful");
    }
  });
};
