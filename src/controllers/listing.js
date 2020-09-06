const User = require("../models/user.model");

const Listing = require("../models/listing.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const uploadFileS3 = require("../utils/imageUpload");
const fs = require("fs");
const multer = require("multer");
const multerS3 = require("multer-s3");
const uploader = require("../utils/imageUpload")
//s3
const aws = require("aws-sdk");
const uuid = require("uuid");

const {
  sendMail
} = require("../utils/email");
const Crud = require("../utils/crud");
const {
  getCoordinates
} = require("../utils/utils");
const s3Uplaod = require("../utils/imageUpload");

// all listings
listings = async (req, res) => {
  try {
    const listings = Listing.find({}, (error, listings) => {
      res.json(listings);
    });
  } catch (error) {
    res.json(error);
  }
};

// create listings
create = async (req, res) => {
  try {
    const {
      street,
      city,
      state,
      zip
    } = req.body.address;
    const n = await getCoordinates(street, city, state, zip);
    req.body.coords = n.data.results[0].locations[0].latLng;
    const doc = await Listing.create(req.body);
    res.status(200).json({
      data: doc,
      success: true
    });
  } catch (e) {
    // unable to create and save user
    res
      .status(400)
      .json(e)
      .end();
  }
};

// update a listing based on id received from req.body
update = async (req, res) => {
  try {
    const {
      street,
      city,
      state,
      zip
    } = req.body.address;
    const n = await getCoordinates(street, city, state, zip);
    req.body.coords = n.data.results[0].locations[0].latLng;

    Listing.findByIdAndUpdate({
        _id: req.params.id
      },
      req.body, {
        multi: true,
        new: true
      },
      (err, doc) => {
        if (err || !doc) {
          res.json({
            error: "unable to update your Listing"
          });
        }
        res.status(200).json({
          data: doc,
          success: true
        });
      }
    );
  } catch (error) {
    res.json({
      error: error
    });
  }
};

// get a listing
get = async (req, res, next) => {
  const {
    id
  } = req.params;
  try {
    Listing.findById(id, (error, doc) => {
      if (error || !doc) {
        return res.json({
          message: "Sorry! The property you are looking for does not exist ",
          error: true
        });
      }
      // document found
      console.log(doc.listingAddress);

      doc.findSimilar(Listing, doc).then(d => {
        return res.json({
          data: doc,
          similar: d
        });
      });
    });
  } catch (error) {
    res.json(error);
  }
};


const uploadMulter = uploader.uploader("realtor-houses");
const MultiUpload = uploadMulter.array('images');

upload = async (req, res, next) => {
  // upload to aws s3 storage
  MultiUpload(req, res, (error) => {

    if (error) {
      res.status(400).json({
        status: false,
        message: req.errro
      });
    }
    const {
      files
    } = req;
    console.log(files);

    const lists = [];
    files.forEach(element => {
      lists.push(element.location);
    });

    // find doc and update photos:['photo1',photo2' ....]
    try {
      Listing.findOneAndUpdate({
          _id: req.params.id
        }, {
          $push: {
            photos: lists
          }
        },
        (err, doc) => {
          if (err) {
            res.json({
              status: 401,
              message: error.message
            });

          }
          res.status(200).json({
            data: "Uploaded successfully"
          });

        }
      );


    } catch (error) {
      res.json({
        status: 401,
        message: error.message
      });

    }





  })





};

module.exports = ListingController = {
  get,
  update,
  create,
  listings,
  upload
};