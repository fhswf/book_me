/**
 * @module user_controller
 */
const User = require("../models/User");

/**
 * Middleware to get the logged in user
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.getUserController = (req, res) => {
  const userid = req.user_id;
  const query = User.findOne({ _id: userid });
  query.exec(function (err, user) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json(user);
    }
  });
};

/**
 * Middleware to get a user by their url
 * @function
 * @param {request} req
 * @param {response} res
 */
exports.getUserByUrl = (req, res) => {
  const userurl = req.query.url;
  const query = User.findOne({ user_url: userurl }, "-password");
  query.exec(function (err, user) {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(200).json(user);
    }
  });
};
