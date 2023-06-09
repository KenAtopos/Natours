const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/me", authController.protect, viewsController.getAccount);

router.use(authController.isLoggedIn);

router.get("/", viewsController.getOverview);
router.get("/tour/:tourSlug", viewsController.getTour);
router.get("/login", viewsController.getLoginForm);
router.get("/signup", viewsController.getSignUpForm);

router.post(
  "/submit-user-data",
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
