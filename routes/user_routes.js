const express = require("express");
const router = express.Router();
const {
  getUserController,
  getUserByUrl,
} = require("../controller/user_controller");

router.get("/getUser", getUserController);
router.get("/findUserByUrl", getUserByUrl);

module.exports = router;
