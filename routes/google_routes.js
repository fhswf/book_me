const express = require("express");
const router = express.Router();
const {
  generateAuthUrl,
  googleCallback,
  revokeScopes,
  googleFreeBusy,
} = require("../controller/google_controller");

router.get("/revoke", revokeScopes);
router.get("/generateAuthUrl", generateAuthUrl);
router.get("/oauthcallback", googleCallback);
router.post("/freebusy", googleFreeBusy);
module.exports = router;
