const express = require("express");
const router = express.Router();
const ListingController = require("../controllers/listing");
const imageUploads = require("../utils/imageUpload");

router.get("/", ListingController.listings);
router.get("/:id", ListingController.get);
router.post("/create", ListingController.create);
router.put("/update/:id", ListingController.update);

router.post(
  "/upload/:id",
  imageUploads.imageUploadWithAWS().array("images", 12),
  ListingController.upload

);

module.exports = router;