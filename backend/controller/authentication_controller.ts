/**
 * @module authentication_controller
 */
import { UserModel } from "../models/User";
import { decode, sign, verify }  from "jsonwebtoken";
// const _ = require("lodash");
import { validationResult } from "express-validator";
import { createTransport } from "nodemailer";
import { compare } from "bcryptjs";
import { google } from "googleapis";
import { OAuth2Client, Credentials } from 'google-auth-library';

const oAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  redirectUri: `${process.env.API_URL}/oauthcallback`,
});

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Middleware to register a new User
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ errors: newError });
  } else {
    UserModel.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({ errors: "Email already exists!" });
      } else if (err) {
        return res
          .status(400)
          .json({ errors: "Something went wrong, please try again." });
      } else {
        const token = sign(
          { name, email, password },
          process.env.ACCOUNT_ACTIVATION,
          { expiresIn: "10m" }
        );

        let mailOptions = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: 'Account activation "Bookme" ',
          html: `<h1>Click the link below to activate your account</h1>
                       <p>${process.env.CLIENT_URL}/activate/${token}</p>`,
        };

        transporter.sendMail(mailOptions, function (error) {
          if (error) {
            return res.status(400).json({
              success: false,
              errors: "Couldnt send email,try again",
            });
          } else {
            return res.status(200).json({
              message: `Email has been send to ${email}`,
            });
          }
        });
      }
    });
  }
};

/**
 * Middleware to create a new user object and activate an Account.
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.activationController = (req, res) => {
  const header = req.headers.authorization;
  const token = header.split(" ")[1];

  if (token) {
    verify(token, process.env.ACCOUNT_ACTIVATION, (err) => {
      if (err) {
        return res.status(400).json({ errors: "Error! Please signup again!" }); //Verify failed
      } else {
        //Decode the jwt for User information
        let name = "";
        let email = "";
        let password = ""; 
        let _t = <Record<string, string>>decode(token);
        if ('name' in _t) {
          name = _t['name']
        }
        if ('email' in _t) {
          email = _t['email']
        }
        if ('password' in _t) {
          password = _t['password']
        }
        const user_url = validateUrl(email);
        //Create a new User
        const userToSave = new UserModel({ name, email, password, user_url });
        //Save the new created User to the DB
        userToSave.save((err) => {
          if (err) {
            return res
              .status(400)
              .json({ errors: "You already have an Account" });
          } else {
            return res.status(201).json({
              success: true,
              message: "You successfully signed up!",
            });
          }
        });
      }
    });
  } else {
    return res.status(400).json({ errors: "Error! Please signup again!" });
  }
};

/**
 * Middleware to log in a user
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.loginController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const newError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({ errors: newError });
  } else {
    UserModel.findOne({ email }).exec((err, user) => {
      if (!user || err) {
        return res.status(400).json({ errors: "User does not exist!" });
      }
      compare(password, user.password)
        .then((result) => {
          if (result) {
            const { _id, name, email } = user;
            const access_token = sign(
              { _id, name, email },
              process.env.JWT_SECRET_TOKEN,
              {
                expiresIn: "1d",
              }
            );
            return res.status(200).json({
              access_token,
              user: {
                name,
              },
            });
          } else {
            console.log("error");
            return res.status(400).json({ errors: "Wrong password or email!" });
          }
        })
        .catch((err) => {
          return res.status(400).json({ errors: "Coudlnt find user" });
        });
    });
  }
};

exports.googleLoginController = (req, res) => {
  //Fetch the google idToken from req.body
  const idToken = req.headers.authorization.split(" ")[1];
  oAuth2Client
    .verifyIdToken({ idToken, audience: process.env.GOOGLE_ID })
    .then((response) => {
      const { email_verified, name, email } = response.getAttributes().payload;
      if (email_verified) {
        UserModel.findOne({ email }).exec((err, user) => {
          if (user) {
            const { _id, name, email } = user;
            const access_token = sign(
              { _id, name, email },
              process.env.JWT_SECRET_TOKEN,
              {
                expiresIn: "1d",
              }
            );

            return res.status(200).json({
              access_token,
              user: { _id, email, name },
            });
          } else {
            let randompw = makePassword(15);
            let password = randompw + process.env.JWT_SECRET_TOKEN;
            const user_url = validateUrl(email);

            user = new UserModel({ name, email, password, user_url });
            user.save((err, user) => {
              if (err) {
                return res.status(400).json({
                  errors: "User signup failed with google",
                });
              }
              const { _id, name, email } = user;
              const access_token = sign(
                { _id, name, email },
                process.env.JWT_SECRET_TOKEN,
                {
                  expiresIn: "1d",
                }
              );

              return res.status(200).json({
                access_token,
                user: { _id, email, name },
              });
            });
          }
        });
      } else {
        return res.status(400).json({
          errors: "Google login failed. Try again",
        });
      }
    });
};

/**
 * Helper function to generate a random password
 * @function
 * @param {number} length - length of the password to generate
 */
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

/**
 * Generates a URL based on the given email
 * @function
 * @param {string} userEmail
 */
function validateUrl(userEmail) {
  const newEmail = userEmail.split("@");
  var reg = new RegExp(/[~\/]/g);
  var newUrl = newEmail[0].toLowerCase().replace(/[\. ,:]+/g, "-");
  newUrl = newUrl.replace(reg, "-");
  return newUrl;
}
