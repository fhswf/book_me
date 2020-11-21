const User = require("../models/User");

exports.getUserController = (req, res) => {
  const userid = req.query.user;
  const query = User.find({ _id: userid });
  query.exec(function (err, user) {
    if (err) {
      return err;
    } else {
      return res.json(user[0]);
    }
  });
};

exports.getUserByUrl = (req, res) => {
  const userurl = req.query.user;
  const query = User.findOne({ user_url: userurl });

  query.exec(function (err, user) {
    if (err) {
      return res.json(err);
    } else {
      return res.json(user);
    }
  });
};
