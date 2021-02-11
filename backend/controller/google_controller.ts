/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * @module google_controller
 */


import { addMinutes, parseISO, parse } from 'date-fns';
const { body } = require("express-validator");
import { calendar_v3, google } from 'googleapis';
import { GaxiosPromise } from "gaxios";
import { OAuth2Client, Credentials } from 'google-auth-library';
import Schema$Event = calendar_v3.Schema$Event;
import { UserModel, User } from "../models/User";
import { Request, Response } from 'express';


const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirectUri: `${process.env.API_URL}/google/oauthcallback`,
});
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

/**
 * Middleware to generate a URL to connect the google calendar
 * @param {request} req
 * @param {response} res
 */
export const generateAuthUrl = (req: Request, res: Response) => {
  const userid = req.user_id;
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    state: userid,
  });
  return res.json({ url: authUrl });
};

/**
 * Callback function, gets called after connecting google cal API
 * Set in Google Developer Console as redirect URI
 * @function
 * @param {request} req
 * @param {response} res
 */
export const googleCallback = (req, res) => {
  const code = req.query.code;
  const user = req.query.state;
  if (code) {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return res.status(400).json({ err: "Error retrieving access token" });
      } else {
        saveTokens(user, token);
        res.redirect(`${process.env.CLIENT_URL}/app`);
      }
    });
  } else {
    return res.status(400).json({ err: "No authorization code was provided." });
  }
};

/**
 * Middleware to insert an event to google calendar.
 * @function
 * @param {request} req
 * @param {response} res
 */
export const insertEventToGoogleCal = (req: Request, res: Response): void => {
  const starttime = parse(<string>req.body.starttime, "yyyy-MM-dd HH:mm:ss", new Date());
  const endtime = addMinutes(starttime, req.body.event.duration);


  const event: Schema$Event = {
    summary: <string>req.body.event.name + " with " + <string>req.body.name,
    location: <string>req.body.event.location,
    description: req.body.event.description,
    start: {
      dateTime: starttime.toISOString(),
      timeZone: "Europe/Berlin",
    },
    end: {
      dateTime: endtime.toISOString(),
      timeZone: "Europe/Berlin",
    },
    attendees: [
      {
        email: req.body.email,
      },
    ],
  };

  const query = UserModel.findOne({ _id: req.user_id });
  query.exec()
  .then((user: User) => {
      const google_tokens = user.google_tokens;
      oAuth2Client.setCredentials(google_tokens);
      void insertEvent(oAuth2Client, event)
      .then(event => {
        res.json({ success: true, message: "Event wurde gebucht", event: event });
      })
      .catch(err => {
        res.status(400).json({ error: err});
      })
    })
    .catch(err => {
      res.status(400).json({ error: err});
    });
};

/**
 * Middleware function to delete an google Access Token from a user
 * @function
 * @param {request} req
 * @param {response} res
 */
export const revokeScopes = (req: Request, res: Response): void => {
  const userid = req.user_id;
  let tokens = null;
  const query = UserModel.findOne({ _id: userid });
  void query.exec()
  .then ((user: User) => {
      tokens = user.google_tokens;
      if (tokens.expiry_date <= Date.now()) {
        deleteTokens(userid);
      } else {
        oAuth2Client.revokeToken(tokens.access_token, function (err) {
          if (err) {
            console.log(err);
          } else {
            deleteTokens(userid);
          }
        });
      }
      res.json({ msg: "ok" });
    })
    .catch(err => {
      res.status(400).json({ error: <unknown>err});
    });
};

export const freeBusy = async (user_id, start, end, event) => {
  const user: User = await UserModel.findOne({ _id: user_id });
  const google_tokens = user.google_tokens;
  oAuth2Client.setCredentials(google_tokens);
  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  return calendar.freebusy.query({
    requestBody: {
      timeMin: start,
      timeMax: end,
      timeZone: "Europe/Berlin",
      items: [
        { id: "primary" }
      ]
    }
  })
    .then(res => {
      const slots = [];
      for (const key in res.data.calendars) {
        for (const busy of res.data.calendars[key].busy) {
          console.log('freeBusy: %o %o %d %d', busy.start, busy.end, event.bufferbefore, event.bufferafter);
          let _start = addMinutes(new Date(busy.start), -event.bufferbefore);
          let _end = addMinutes(new Date(busy.end), event.bufferafter);
          slots.push({ start: start, end: _start });
          start = _end;
        }
        if (start < end) {
          slots.push({ start: start, end: end });
        }
        console.log('freeBusy: %s %j', key, slots);
      }
      return slots;
    })
    .catch(err => {
      console.log('freebusy failed: %o', err);
    });
}

function deleteTokens(userid) {
  UserModel.findOneAndUpdate(
    { _id: userid },
    { $unset: { google_tokens: "" } }
  ).then(res => {
    console.log(res);
  });
}

/**
 * Function to store google tokens.
 * @function
 * @param {string} userid - User who gave consent to connect Calendar API
 * @param {object} token  - The Token Object retrieved from Google
 */
function saveTokens(user: User, token) {
  UserModel.findOneAndUpdate({ _id: user }, { google_tokens: token });
 
  /*
  if (token.refresh_token) {
    User.findOneAndUpdate(
      { _id: user },
      {
        google_tokens: {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
          scope: token.scope,
          token_type: token.token_type,
          expiry_date: token.expiry_date,
        },
      }
    )
      .then((res) => {
        return res.status(200).json({ msg: "Succesfully saved Tokens" });
      })
      .catch((err) => {
        return err;
      });
  } else {
    User.findOneAndUpdate(
      { _id: user },
      {
        $set: { "google_tokens.access_token": token.access_token },
      }
    )
      .then((res) => {
        return res.status(200).json({ msg: "succesfully created Tokens" });
      })
      .catch((err) => {
        return err;
      });
  }
  */
}

/**
 * function to insert a event to the users google calendar
 * @function
 * @param {object} auth - The OAuth Client Object, which stores Tokens.
 * @param {object} event - The event to insert into the calendar.
 */
export function insertEvent(auth: OAuth2Client, event: Schema$Event) : GaxiosPromise<Schema$Event> {
  const calendar = google.calendar({ version: "v3", auth });
  return calendar.events.insert(
    {
      auth: auth,
      calendarId: "primary",
      sendUpdates: "all",
      requestBody: event,
    });
}
