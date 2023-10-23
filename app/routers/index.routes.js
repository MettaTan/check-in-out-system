const express = require("express");

const router = express.Router(),
    indexControls = require("../controllers/index.controller");

router.route("/").get(indexControls.renderMainPage).post(indexControls.adminLogin);
router.route("/checkNric").post(indexControls.checkNric);
router.route("/reprintReceipt").post(indexControls.reprintReceipt);

router.route("/seed").get(indexControls.outputDB);

module.exports = router;