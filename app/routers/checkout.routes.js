const express = require("express");

const router = express.Router(),
  checkoutControls = require("../controllers/checkout.controller");

router
  .route("/")
  .get(checkoutControls.renderCheckoutForm)
  .post(checkoutControls.processCheckout);
router.route("/autofill").post(checkoutControls.autofill);

module.exports = router;
