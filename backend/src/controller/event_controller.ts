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

//const DAYS = [Day.SUN, Day.MON, Day.TUE, Day.WED, Day.THU, Day.FRI, Day.SAT,]

function max<T>(a: T, b: T): T {
  console.log('max: %o %o', a, b)
  return a < b ? b : a;
}

function min<T>(a: T, b: T): T {
  console.log('min: %o %o', a, b)
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
  EventModel.findOne({ url: url, user: userid }).select(
    `available bufferbefore duration bufferafter minFuture maxFuture maxPerDay -_id`
  )
    .then(event => {

      // Calculate intersection of requested and 'feasible' tome interval
      timeMin = max(timeMin, startOfHour(Date.now() + 1000 * event.minFuture))
      timeMax = min(timeMax, startOfHour(Date.now() + 1000 * event.maxFuture))
      console.log("Event: %o; timeMin: %s, timeMax: %s", event, timeMin, timeMax);

      // Request currently booked events. We need them for the maxPerDay restriction
      return events(userid, timeMin.toISOString(), timeMax.toISOString())
        .then(events => {
          // Calculate number of booked events per day
          console.log('list events: %o', events)
          const days = {}
          const blocked = new IntervalSet([{ start: timeMin, end: timeMin }, { start: timeMax, end: timeMax }])
          events.forEach(evt => {
            console.log('event: %o', evt)
            if (!evt.start.dateTime) {
              return
            }
            const day = startOfDay(new Date(evt.start.dateTime)).toISOString()
            if (day in days) {
              days[day] += 1
            }
            else {
              days[day] = 1
            }
          })
          for (const day in days) {
            if (days[day] >= event.maxPerDay) {
              blocked.addRange({ start: new Date(day), end: addDays(new Date(day), 1) })
            }
          }
          console.log("blocked: %o", blocked)
          console.log("free: %o", blocked.inverse())

          // Now query freeBusy service
          return freeBusy(userid, timeMin.toISOString(), timeMax.toISOString())
            .then(res => {
              let freeSlots = new IntervalSet(timeMin, timeMax, event.available, "Europe/Berlin");
              freeSlots = freeSlots.intersect(blocked.inverse())
              for (const key in res.data.calendars) {
                const calIntervals = new IntervalSet();
                let current = timeMin;
                for (const busy of res.data.calendars[key].busy) {
                  console.log('freeBusy: %o %o %d %d', busy.start, busy.end, event.bufferbefore, event.bufferafter);
                  const _start = addMinutes(new Date(busy.start), -event.bufferbefore);
                  const _end = addMinutes(new Date(busy.end), event.bufferafter);
                  if (current < _start)
                    calIntervals.push({ start: current, end: _start });
                  current = _end;
                }
                if (current < timeMax) {
                  calIntervals.push({ start: current, end: timeMax });
                }
                freeSlots = freeSlots.intersect(calIntervals)
              }
              console.log('freeSlots before filtering: %j', freeSlots);
              freeSlots = new IntervalSet(freeSlots.filter(slot => (slot.end.getTime() - slot.start.getTime()) > event.duration * 60 * 1000))
              console.log('freeSlots after filtering: %j', freeSlots);
              return freeSlots;
            })
            .catch(err => {
              console.error('freebusy failed: %o', err);
              throw err;
            })
            .then(slots => {
              res.status(200).json(slots);
            })
            .catch(err => {
              console.error('freeBusy failed: %o', err);
              res.status(400).json({ error: <unknown>err });
            })
        });
    })
    .catch(err => {
      console.error('getAvailableTime: event not found: %o', err);
      res.status(400).json({ erorr: err });
    });
}



/**
 * Middleware to create a new event
 * @function
 * @param {request} req
 * @param {response} res
 */
export const addEventController = (req: Request, res: Response): void => {
  const errors = validationResult(req);
  console.log('errors: %j', errors);

  const event: Event = req.body;
  console.log('event: %j', event)

  if (!errors.isEmpty()) {
    const newError = errors.array().map<unknown>((error: ValidationError) => error.msg)[0];
    res.status(422).json({ error: newError });
  } else {
    const eventToSave = new EventModel(event);

    void eventToSave.save()
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
  void EventModel.findByIdAndDelete(eventid)
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
  EventModel.find({ user: userid })
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
  const query = EventModel.find({ user: userid, isActive: true });

  query.exec()
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
  EventModel.findById({ _id: event_id })
    .then(event => {
      console.log("getEvent: %s %o", event_id, event);
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

  EventModel.findOne({ url: url, user: userid })
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
  void EventModel.findByIdAndUpdate(event_id, event)
    .then((doc: EventDocument) => {
      res.status(200).json({ msg: "Update successful", event: doc })
    })
    .catch((err: unknown) => {
      res.status(400).json({ error: err });
    });

};
