const Event = require("../models/Event");
const { validationResult } = require("express-validator");
const { errorHandler } = require("../handlers/errorhandler");
const { mongo } = require("mongoose");

exports.getAvailableTimesForDay = (req, res) => {
  const day = req.query.day;
  const eventurl = req.query.eventurl;
  const query = Event.findOne({ url: eventurl }).select(`available -_id`);
  query.exec(function (err, event) {
    if (err) {
      console.log(err);
    } else {
      return res.json(event.available[day]);
    }
  });
};

exports.addEventController = (req, res) => {
  const errors = validationResult(req);
  let calendarday = false;

  if (req.body.calendardays == "false") {
    calendarday = false;
  } else {
    calendarday = true;
  }

  if (!errors.isEmpty()) {
    const newError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ errors: newError });
  } else {
    const eventToSave = new Event({
      user: req.body.user,
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      url: req.body.eventurl,
      isActive: req.body.isActive,
      duration: parseInt(req.body.duration),
      rangedays: parseInt(req.body.rangedays),
      bufferbefore: parseInt(req.body.bufferbefore),
      bufferafter: parseInt(req.body.bufferafter),
      calendarday: calendarday,
      available: req.body.starttimemon,
    });

    eventToSave.save((err, eventToSave) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ errors: errorHandler(err) });
      } else {
        return res.json({
          success: true,
          message: eventToSave,
          msg: "Successfully saved event!",
        });
      }
    });
  }
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

exports.getEventByUrl = (req, res) => {
  const userid = req.query.user;
  const url = req.query.url;
  console.log(req.query);

  const query = Event.findOne({ url: url, user: userid });
  query.exec(function (err, event) {
    if (err) {
      return err;
    } else {
      return res.json(event);
    }
  });
};

exports.updateEventController = (req, res) => {
  const event = req.body;

  var query = { _id: event.eventID };

  Event.findByIdAndUpdate(
    query,
    req.body,
    { upsert: true },
    function (err, event) {
      if (err) {
        return err;
      } else {
        return res.json({ msg: "Update successful" });
      }
    }
  );
};
