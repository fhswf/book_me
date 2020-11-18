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
  check("duration").isNumeric().withMessage("Duration needs to be a Number!"),
];
