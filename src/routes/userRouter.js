var express = require("express");
var router = express.Router();
const path = require("path");
const multer = require("multer");
const imageUpload = require("../utils/imageUpload");
const userController = require("../controllers/user");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/logout", userController.logout);
// router.route("/:id").get();
router.post("/forgot-password", userController.forgotPassword);
router.get("/dashboard/:userId", userController.getUserDashboard);
router.delete(
  "/dashboard/listings/delete/:id",
  userController.deleteUserListing
);

router.post(
  "/:id/upload",
  // imageUpload.imageUpload().single("avatar"),
  userController.upload
);
router.put("/update/:id", userController.update);

module.exports = router;