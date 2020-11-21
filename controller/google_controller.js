const { google } = require("googleapis");
const User = require("../models/User");
const { OAuth2 } = google.auth;

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
];

const oAuth2Client = new OAuth2({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirectUri: `${process.env.API_URL}/google/oauthcallback`,
});

exports.revokeScopes = (req, res) => {
  const userid = req.query.user;

  User.findOneAndUpdate(
    { _id: userid },
    { access_token: null }
  ).then((res) => {});
};
exports.generateAuthUrl = (req, res) => {
  const user = req.query.user;
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    state: user,
  });

  return res.json({ url: authUrl });
};

exports.googleCallback = (req, res) => {
  const code = req.query.code;
  const user = req.query.state;
  if (code) {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return console.error("Error retrieving access token", err);
      } else {
        saveTokens(user, token);
        res.redirect(`${process.env.CLIENT_URL}/app`);
      }
    });
  } else {
    return res.json({ err: "Error Google API request" });
  }
};

exports.googleFreeBusy = (req, res) => {};

function saveTokens(user, token) {
  User.findOneAndUpdate({ _id: user }, { access_token: token })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function listEvents(auth) {
  const calendar = google.calendar({ version: "v3", auth });
  calendar.events.list(
    {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const events = res.data.items;
      if (events.length) {
        console.log("Upcoming 10 events:");
        events.map((event, i) => {
          const start = event.start.dateTime || event.start.date;
          console.log(`${start} - ${event.summary}`);
        });
      } else {
        console.log("No upcoming events found.");
      }
    }
  );
}
