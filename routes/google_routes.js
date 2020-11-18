const express = require("express");
const router = express.Router();
const {
  generateAuthUrl,
  googleCallback,
  revokeScopes,
} = require("../controller/google_controller");

router.get("/revoke", revokeScopes);

router.get("/generateAuthUrl", generateAuthUrl);
router.get("/oauthcallback", googleCallback);

module.exports = router;
