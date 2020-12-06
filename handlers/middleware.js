/**
 * @module authentication_middleware
 */
const jwt = require("jsonwebtoken");

/**
 * Middleware to check if User is authorized
 * @function
 * @param {request} req
 * @param {response} res
 * @param {callback} next
 */
exports.requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header.split(" ")[1];
  if (!token) {
    return res.json({
      success: false,
      message: "Unauthorized! Sign in again!",
    });
  } else {
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Unauthorized! Sign in again!",
        });
      } else {
        req.user_id = decoded._id;
        next();
      }
    });
  }
};
