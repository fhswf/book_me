/**
 * @module event_controller
 */
const Event = require("../models/Event");
const { validationResult } = require("express-validator");
const { errorHandler } = require("../handlers/errorhandler");

/**
 * Middleware to get available times for one weekday of a given user
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.getAvailableTimesForDay = (req, res) => {
  const day = req.query.day;
  const eventurl = req.query.eventurl;
  const userid = req.query.user;
  const query = Event.findOne({ url: eventurl, user: userid }).select(
    `available -_id`
  );
  query.exec(function (err, event) {
    if (err) {
      return res.status(400).json({ erorr: err });
    } else {
      return res.status(200).json(event.available[day]);
    }
  });
};

/**
 * Middleware to create a new event
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.addEventController = (req, res) => {
  const userid = req.user_id;
  const errors = validationResult(req);

  let available = {
    mon: [req.body.starttimemon, req.body.endtimemon],
    tue: [req.body.starttimetue, req.body.endtimetue],
    wen: [req.body.starttimewen, req.body.endtimewen],
    thu: [req.body.starttimethu, req.body.endtimethu],
    fri: [req.body.starttimefri, req.body.endtimefri],
    sat: [req.body.starttimesat, req.body.endtimesat],
    sun: [req.body.starttimesun, req.body.endtimesun],
  };

  if (!errors.isEmpty()) {
    const newError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ error: newError });
  } else {
    const eventToSave = new Event({
      user: userid,
      name: req.body.name,
      location: req.body.location,
      description: req.body.description,
      url: req.body.eventurl,
      isActive: req.body.isActive,
      duration: parseInt(req.body.duration),
      rangedays: parseInt(req.body.rangedays),
      bufferbefore: parseInt(req.body.bufferbefore),
      bufferafter: parseInt(req.body.bufferafter),
      calendarday: req.body.calendarday,
      available: available,
    });

    eventToSave.save((err, eventToSave) => {
      if (err) {
        return res.status(400).json({ error: errorHandler(err) });
      } else {
        return res.status(201).json({
          success: true,
          message: eventToSave,
          msg: "Successfully saved event!",
        });
      }
    });
  }
};

/**
 * Middleware to delete an event
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.deleteEventController = (req, res) => {
  const eventid = req.params.id;
  Event.findByIdAndDelete(eventid, function (err) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json({ msg: "Successfully deleted the Event" });
    }
  });
};

/**
 * Middleware to fetch all events of an given user
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.getEventListController = (req, res) => {
  const userid = req.user_id;
  const query = Event.find({ user: userid });
  query.exec(function (err, event) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json(event);
    }
  });
};

/**
 * Middleware to fetch all active events of an given user
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.getActiveEventsController = (req, res) => {
  const userid = req.query.user;
  const query = Event.find({ user: userid, isActive: true });

  query.exec(function (err, event) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json(event);
    }
  });
};

/**
 * Middleware to get an event by id
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.getEventByIdController = (req, res) => {
  const event_id = req.params.id;
  const query = Event.findById({ _id: event_id });
  query.exec(function (err, event) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json(event);
    }
  });
};

/**
 * Middleware to get an event by the eventurl
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.getEventByUrl = (req, res) => {
  const userid = req.query.user;
  const url = req.query.url;

  const query = Event.findOne({ url: url, user: userid });
  query.exec(function (err, event) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json(event);
    }
  });
};

/**
 * Middleware to update an event
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.updateEventController = (req, res) => {
  const event = req.body.data;
  const event_id = req.params.id;
  Event.findByIdAndUpdate(event_id, event, function (err, event) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json({ msg: "Update successful", event: event });
    }
  });
};
