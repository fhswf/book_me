const { check } = require("express-validator");

//Validates the User input before register
exports.validateRegister = [
  check("name", "Name is requiered")
    .isLength({ min: 4, max: 20 })
    .withMessage("Name must be between 4 and 20 characters!"),
  check("email").isEmail(),
  check("password", "password is requiered").notEmpty(),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must have atleast 8 characters")
    .matches(/\d/)
    .withMessage("password must have a number"),
];

//Validates the User input before login
exports.validateLogin = [
  check("email").isEmail(),
  check("password", "password is requiered").notEmpty(),
];

exports.validateAddEvent = [
  check("name").notEmpty().withMessage("Name cant be empty"),
  check("eventurl").notEmpty().withMessage("Url cant be empty"),
  check("starttimemon")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Starttime Monday is not a time"),
  check("starttimetue")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Enttime monday is not a time"),
  check("starttimewen")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Starttime tuesday is not a time"),
  check("starttimethu")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Endtime tuesday is not a time"),
  check("starttimefri")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Not a time"),
  check("starttimesat")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Not a time"),
  check("starttimesun")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Not a time"),
  check("endtimemon")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Not a time"),
  check("endtimetue")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Not a time"),
  check("endtimewen")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Not a time"),
  check("endtimethu")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Not a time"),
  check("endtimefri")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Not a time"),
  check("endtimesat")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Not a time"),
  check("endtimesun")
    .matches(/^$|^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Not a time"),
];
