const User = require("../models/User");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { validationResult } = require("express-validator");
const mailer = require("nodemailer");
const bcrypt = require("bcryptjs");

/*---------Google Cal API-----------*/
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const oAuth2Client = new OAuth2({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirectUri: `${process.env.API_URL}/oauthcallback`,
});

exports.generateAuthUrl = (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return res.json({ url: authUrl });
};

exports.googleCallback = (req, res) => {
  const code = req.query.code;
  oAuth2Client.getToken(code, (err, tokens) => {
    if (err) {
      return console.error("Error retrieving access token", err);
    } else {
    }
  });
};

const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

function validateUrl(userEmail) {
  const newEmail = userEmail.split("@");
  var reg = new RegExp(/[~\/]/g);
  var newUrl = newEmail[0].toLowerCase().replace(/[\. ,:]+/g, "-");
  newUrl = newUrl.replace(reg, "-");
  return newUrl;
}

exports.registerController = (req, res) => {
  const { name, email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ errors: newError });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({ errors: "Email already exists!" });
      }
      if (err) {
        return res.status(400).json({ errors: "Error, findOne email " });
      }
    });

    const token = jwt.sign(
      { name, email, password },
      process.env.ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );
    const cookieOptions = {
      maxAge: 6000000,
      secure: false, // set to true if your using https
      httpOnly: true,
    };
    res.cookie("activation_token", token, cookieOptions);

    let mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Account activation "Bookme" ',
      html: `<h1>Click the link below to activate your account</h1>
                   <p>${process.env.CLIENT_URL}/users/activate</p>`,
    };

    transporter.sendMail(mailOptions, function (error) {
      if (error) {
        return res.status(400).json({
          success: false,
          errors: error,
        });
      } else {
        return res.json({
          message: `Email has been send to ${email}`,
        });
      }
    });
  }
};

//Controller for saving the user to the DB
exports.activationController = (req, res) => {
  const token = req.cookies.activation_token;
  if (token) {
    jwt.verify(token, process.env.ACCOUNT_ACTIVATION, (err) => {
      if (err) {
        console.log("Verify failed");
        return res.status(401).json({ errors: "Error! Please signup again!" }); //Verify failed
      } else {
        //Decode the jwt for User information
        const { name, email, password } = jwt.decode(token);
        const user_url = validateUrl(email);
        //Create a new User
        const userToSave = new User({ name, email, password, user_url });
        //Save the new created User to the DB
        userToSave.save((err, userToSave) => {
          if (err) {
            return res
              .status(401)
              .json({ errors: "Could not save the User to the Database" });
          } else {
            return res.json({
              success: true,
              message: userToSave,
              message: "You successfully signed up!",
            });
          }
        });
      }
    });
  } else {
    return res.json({ message: "Error! Please signup again!" });
  }
};

exports.loginController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ errors: newError });
  } else {
    User.findOne({ email }).exec((err, user) => {
      if (!user || err) {
        return res.status(400).json({ errors: "User does not exist!" });
      }
      bcrypt
        .compare(password, user.password)
        .then((result) => {
          if (result) {
            const token = jwt.sign(
              { user: user._id },
              process.env.JWT_SECRET_TOKEN,
              {
                expiresIn: "30min",
              }
            );
            /*
            res.cookie("acces_token", token, {
              maxAge: 6000000,
              secure: false, // set to true if your using https
              httpOnly: true,
            });
            */
            const { _id, name, email } = user;
            return res.json({ token, user: { _id, name, email } });
          } else {
            return res.status(400).json({ errors: "Wrong password or email!" });
          }
        })
        .catch((err) => console.error(err));
    });
  }
};

function makePassword(length) {
  var result = "";
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!"§$%&/()=?-._,';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
exports.googleController = (req, res) => {
  const { idToken } = req.body;
  oAuth2Client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_ID })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (user) {
            const token = jwt.sign(
              { _id: user._id },
              process.env.JWT_SECRET_TOKEN,
              {
                expiresIn: "1m",
              }
            );
            const { _id, email, name } = user;
            return res.json({
              token,
              user: { _id, email, name },
            });
          } else {
            let randompw = makePassword(15);
            let password = randompw + process.env.JWT_SECRET_TOKEN;

            user = new User({ name, email, password });
            user.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: "User signup failed with google",
                });
              }
              const token = jwt.sign(
                { _id: data._id },
                process.env.JWT_SECRET_TOKEN,
                { expiresIn: "1m" }
              );
              const { _id, email, name, role } = data;

              return res.json({
                token,
                user: { _id, email, name, role },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          error: "Google login failed. Try again",
        });
      }
    });
};
