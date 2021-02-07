/**
 * @module google_controller
 */
const { body } = require("express-validator");
const { google } = require("googleapis");
const User = require("../models/User");
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2({
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
exports.generateAuthUrl = (req, res) => {
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
exports.googleCallback = (req, res) => {
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
exports.insertEventToGoogleCal = (req, res) => {
  let datum = req.body.starttime.split(" ")[0];

  let startzeit = req.body.starttime.split(" ")[1];
  const starttime = datum.concat("T", startzeit);

  let endzeit = addMinutes(startzeit, req.body.event.duration.toString());
  const endtime = datum.concat("T", endzeit, ":00");

  let event = {
    summary: req.body.event.name + " with " + req.body.name,
    location: req.body.event.location,
    description: req.body.event.description,
    start: {
      dateTime: starttime,
      timeZone: "Europe/Berlin",
    },
    end: {
      dateTime: endtime,
      timeZone: "Europe/Berlin",
    },
    attendes: [
      {
        email: req.body.email,
      },
    ],
  };

  const query = User.findOne({ _id: req.params.user_id });
  query.exec(function (err, user) {
    if (err) {
      return err;
    } else {
      let google_tokens = user.google_tokens;
      oAuth2Client.setCredentials(google_tokens);
      insertEvent(oAuth2Client, event);
      return res.json({ success: true, message: "Event wurde gebucht" });
    }
  });
};

/**
 * Middleware function to delete an google Access Token from a user
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.revokeScopes = (req, res) => {
  const userid = req.user_id;
  let tokens = null;
  const query = User.findOne({ _id: userid });
  query.exec(function (err, user) {
    if (err) {
    } else {
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
      return res.json({ msg: "ok" });
    }
  });
};

exports.freeBusy = async (user_id, start, end) => {
  let user = await User.findOne({ _id: user_id });
  let google_tokens = user.google_tokens;
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
    .catch(err => {
      console.log('freebusy failed: %o', err);
    })
    .then(res => {
      let slots = [];
      for (let key in res.data.calendars) {
        for (let busy of res.data.calendars[key].busy) {
          console.log('freeBusy: %o %o', busy.start, busy.end);
          let _start = new Date(busy.start);
          let _end = new Date(busy.end);
          slots.push({ start: start, end: _start });
          start = _end;
        }
        if (start < end) {
          slots.push({ start: start, end: end });
        }
        console.log('freeBusy: %s %j', key, slots);
      }
      return slots;
    });
}

function deleteTokens(userid) {
  User.findOneAndUpdate(
    { _id: userid },
    { $unset: { google_tokens: "" } }
  ).then((res) => {
    console.log(res);
  });
}

/**
 * Function to store google tokens.
 * @function
 * @param {string} userid - User who gave consent to connect Calendar API
 * @param {object} token  - The Token Object retrieved from Google
 */
function saveTokens(user, token) {
  User.findOneAndUpdate({ _id: user }, { google_tokens: token })
    .then((res) => {
      return res.status(200).json({ msg: "Succesfully saved Tokens" });
    })
    .catch((err) => {
      return err;
    });
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
function insertEvent(auth, event) {
  const calendar = google.calendar({ version: "v3", auth });
  calendar.events.insert(
    {
      auth: auth,
      calendarId: "primary",
      resource: event,
    },
    function (err, event) {
      if (err) {
        console.log(err.response);
      } else {
        return res
          .status(200)
          .json({ msg: "Event successfully inserted.", event: event });
      }
    }
  );
}

/**
 *
 * @param {string} time - time to add minutes to
 * @param {number} minsToAdd  Amount of Minutes to add.
 */
function addMinutes(time, minsToAdd) {
  function D(J) {
    return (J < 10 ? "0" : "") + J;
  }
  var piece = time.split(":");
  var mins = piece[0] * 60 + +piece[1] + +minsToAdd;

  return D(((mins % (24 * 60)) / 60) | 0) + ":" + D(mins % 60);
}
