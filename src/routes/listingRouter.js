const express = require("express");
const router = express.Router();
const ListingController = require("../controllers/listing");
const imageUploads = require("../utils/imageUpload");
const multer = require("multer");
const multerS3 = require("multer-s3");
//s3
const aws = require("aws-sdk");
const uuid = require("uuid");

router.get("/", ListingController.listings);
router.get("/:id", ListingController.get);
router.post("/create", ListingController.create);
router.put("/update/:id", ListingController.update);






router.post(
  "/upload/:id",

  ListingController.upload

);

module.exports = router;