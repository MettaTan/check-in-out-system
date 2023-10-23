const express = require("express");

const router = express.Router(),
  checkinControls = require("../controllers/checkin.controller");

router
  .route("/")
  .get(checkinControls.renderCheckinForm)
  .post(checkinControls.processCheckin);
router.route("/checkPassphrase").post(checkinControls.checkPassphrase);
router.route("/checkPIN").post(checkinControls.checkPIN);
router.route("/getPass").post(checkinControls.getPass);

module.exports = router;
