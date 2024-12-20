/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @module event_controller
 */
import { EventDocument, EventModel } from "../models/Event.js";
import { Event, IntervalSet } from "common";
import { freeBusy, events } from "./google_controller.js";
import { ValidationError, validationResult } from "express-validator";
import { errorHandler } from "../handlers/errorhandler.js";
import { addMinutes, addDays, startOfHour, startOfDay } from 'date-fns';
import { Request, Response } from "express";

import { logger } from "../logging.js";

//const DAYS = [Day.SUN, Day.MON, Day.TUE, Day.WED, Day.THU, Day.FRI, Day.SAT,]

function max<T>(a: T, b: T): T {
  logger.debug('max: %o %o', a, b)
  return a < b ? b : a;
}

function min<T>(a: T, b: T): T {
  logger.debug('min: %o %o', a, b)
  return a < b ? a : b;
}

/**
 * Middleware to get available times for one weekday of a given user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getAvailableTimes = (req: Request, res: Response): void => {
  let timeMin = new Date(<string>req.query.timeMin);
  let timeMax = new Date(<string>req.query.timeMax);
  const url = <string>req.query.url;
  const userid = <string>req.query.userid;
  logger.debug('getAvailableTimes: %s %s %s %s', timeMin, timeMax, url, userid);
  EventModel
    .findOne({ url: url, user: userid })
    .select("available bufferbefore duration bufferafter minFuture maxFuture maxPerDay -_id")
    .exec()
    .then(event => {
      // Calculate intersection of requested and 'feasible' time interval
      timeMin = max(timeMin, startOfHour(Date.now() + 1000 * event.minFuture));
      timeMax = min(timeMax, startOfHour(Date.now() + 1000 * event.maxFuture));
      logger.debug("Event: %o; timeMin: %s, timeMax: %s", event, timeMin, timeMax);

      // Request currently booked events. We need them for the maxPerDay restriction
      return events(userid, timeMin.toISOString(), timeMax.toISOString())
        .then(events => ({ events, event }));
    })
    .then(({ events, event }) => {
      const blocked = calculateBlocked(events, event, timeMin, timeMax);
      logger.debug("blocked: %o", blocked);
      logger.debug("free: %o", blocked.inverse());

      // Now query freeBusy service
      return freeBusy(userid, timeMin.toISOString(), timeMax.toISOString())
        .then(freeBusyResponse => ({ freeBusyResponse, event, blocked }));
    })
    .then(({ freeBusyResponse, event, blocked }) => {
      let freeSlots = calculateFreeSlots(freeBusyResponse, event, timeMin, timeMax, blocked);
      logger.debug('freeSlots before filtering: %j', freeSlots);
      freeSlots = new IntervalSet(freeSlots.filter(slot => (slot.end.getTime() - slot.start.getTime()) > event.duration * 60 * 1000));
      logger.debug('freeSlots after filtering: %j', freeSlots);
      res.status(200).json(freeSlots);
    })
    .catch(err => {
      logger.error('getAvailableTime: event not found or freeBusy failed: %o', err);
      res.status(400).json({ error: err });
    });

  function calculateBlocked(events, event, timeMin, timeMax) {
    const eventsPerDay = {};
    const blocked = new IntervalSet([{ start: timeMin, end: timeMin }, { start: timeMax, end: timeMax }]);
    events.forEach(evt => {
      logger.debug('event: %o', evt);
      if (!evt.start.dateTime) {
        return;
      }
      const day = startOfDay(new Date(evt.start.dateTime)).toISOString();
      if (day in eventsPerDay) {
        eventsPerDay[day] += 1;
      } else {
        eventsPerDay[day] = 1;
      }
    });
    for (const day in eventsPerDay) {
      if (eventsPerDay[day] >= event.maxPerDay) {
        blocked.addRange({ start: new Date(day), end: addDays(new Date(day), 1) });
      }
    }
    return blocked;
  }

  function calculateFreeSlots(response, event, timeMin, timeMax, blocked) {
    let freeSlots = new IntervalSet(timeMin, timeMax, event.available, "Europe/Berlin");
    freeSlots = freeSlots.intersect(blocked.inverse());
    for (const key in response.data.calendars) {
      const calIntervals = new IntervalSet();
      let current = timeMin;
      for (const busy of response.data.calendars[key].busy) {
        logger.debug('freeBusy: %o %o %d %d', busy.start, busy.end, event.bufferbefore, event.bufferafter);
        const _start = addMinutes(new Date(busy.start), -event.bufferbefore);
        const _end = addMinutes(new Date(busy.end), event.bufferafter);
        if (current < _start)
          calIntervals.push({ start: current, end: _start });
        current = _end;
      }
      if (current < timeMax) {
        calIntervals.push({ start: current, end: timeMax });
      }
      freeSlots = freeSlots.intersect(calIntervals);
    }
    return freeSlots;
  }
}



/**
 * Middleware to create a new event
 * @function
 * @param {request} req
 * @param {response} res
 */
export const addEventController = (req: Request, res: Response): void => {
  const errors = validationResult(req);
  logger.debug('errors: %j', errors);

  const event: Event = req.body;
  logger.debug('event: %j', event)

  if (!errors.isEmpty()) {
    const newError = errors.array().map<unknown>((error: ValidationError) => error.msg)[0];
    res.status(422).json({ error: newError });
  } else {
    const eventToSave = new EventModel(event);

    eventToSave
      .save()
      .then((doc: EventDocument) => {
        res.status(201).json({
          success: true,
          message: doc,
          msg: "Successfully saved event!",
        })
      })
      .catch(err => {
        res.status(400).json({ error: errorHandler(err) });
      });
  }
};

/**
 * Middleware to delete an event
 * @function
 * @param {request} req
 * @param {response} res
 */
export const deleteEventController = (req: Request, res: Response): void => {
  const eventid = req.params.id;
  EventModel
    .findByIdAndDelete(eventid)
    .exec()
    .then(() => {
      res.status(200).json({ msg: "Successfully deleted the Event" });
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to fetch all events of an given user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getEventListController = (req: Request, res: Response): void => {
  const userid = req["user_id"];
  EventModel
    .find({ user: userid })
    .exec()
    .then(event => {
      res.status(200).json(event);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to fetch all active events of an given user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getActiveEventsController = (req: Request, res: Response): void => {
  const userid = <string>req.query.user;
  EventModel
    .find({ user: userid, isActive: true })
    .exec()
    .then(event => {
      res.status(200).json(event);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to get an event by id
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getEventByIdController = (req: Request, res: Response): void => {
  const event_id = req.params.id;
  EventModel
    .findById({ _id: event_id })
    .exec()
    .then(event => {
      logger.debug("getEvent: %s %o", event_id, event);
      res.status(200).json(event);
    })
    .catch(err => {
      res.status(400).json({ error: err });
    });
};

/**
 * Middleware to get an event by the url
 * @function
 * @param {request} req
 * @param {response} res
 */
export const getEventByUrl = (req: Request, res: Response): void => {
  const userid = <string>req.query.user;
  const url = <string>req.query.url;

  EventModel
    .findOne({ url: url, user: userid })
    .exec()
    .then(event => {
      res.status(200).json(event);
    })

    .catch(err => { res.status(400).json({ error: err }); });
}

/**
 * Middleware to update an event
 * @function
 * @param {request} req
 * @param {response} res
 */
export const updateEventController = (req: Request, res: Response): void => {
  const event = req.body.data;
  const event_id = req.params.id;

  // Validate the event object
  if (typeof event !== 'object' || event === null) {
    res.status(400).json({ error: 'Invalid event data' });
    return;
  }

  void EventModel
    .findByIdAndUpdate(event_id, { $set: event })
    .exec()
    .then((doc: EventDocument) => {
      res.status(200).json({ msg: "Update successful", event: doc })
    })
    .catch((err: unknown) => {
      res.status(400).json({ error: err });
    });

};
