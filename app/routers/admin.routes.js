const express = require("express");

const router = express.Router(),
  adminControls = require("../controllers/admin.controller");

router.route("/").get(adminControls.renderAdminPage);

router
  .route("/addPass")
  .get(adminControls.renderAddPass)
  .post(adminControls.processPass);

router.route("/passTable").get(adminControls.renderPassTable);
router.route("/getPassData").get(adminControls.getPassData);
router.route("/editPass").post(adminControls.editPassEntry);
router.route("/deletePass").post(adminControls.deletePassEntry);

router.route("/deptRecords").get(adminControls.renderDeptRecords);
router.route("/getDeptData").get(adminControls.getDeptData);

router.route("/feedbackRecords").get(adminControls.renderFeedbackRecords);
router.route("/getFeedbackData").get(adminControls.getFeedbackData);

module.exports = router;
