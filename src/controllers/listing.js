const User = require("../models/user.model");
const Listing = require("../models/listing.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { sendMail } = require("../utils/email");
const Crud = require("../utils/crud");
const { getCoordinates } = require("../utils/utils");

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
    const { street, city, state, zip } = req.body.address;
    const n = await getCoordinates(street, city, state, zip);
    req.body.coords = n.data.results[0].locations[0].latLng;
    const doc = await Listing.create(req.body);
    res.status(200).json({ data: doc, success: true });
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
    const { street, city, state, zip } = req.body.address;
    const n = await getCoordinates(street, city, state, zip);
    req.body.coords = n.data.results[0].locations[0].latLng;

    Listing.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { multi: true, new: true },
      (err, doc) => {
        if (err || !doc) {
          res.json({ error: "unable to update your Listing" });
        }
        res.status(200).json({ data: doc, success: true });
      }
    );
  } catch (error) {
    res.json({ error: error });
  }
};

// get a listing
get = async (req, res, next) => {
  const { id } = req.params;
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
        return res.json({ data: doc, similar: d });
      });
    });
  } catch (error) {
    res.json(error);
  }
};
upload = async (req, res, next) => {
  const listingId = req.params.id;
  try {
    if (req.error) {
      res.status(400).json({ status: false, message: req.errro });
    } else {
      const { files } = req;
      // const { filename } = files;
      const lists = [];
      files.forEach(element => {
        lists.push(element.filename);
      });

      // find doc and update photos:['photo1',photo2' ....]
      Listing.findOneAndUpdate(
        { _id: listingId },
        { $push: { photos: lists } },
        (err, doc) => {
          console.log(err);
          console.log(doc);
        }
      );

      res.json({ status: 200, message: "upload successfully" });
    }
  } catch (error) {
    res.json({ status: 401, message: error });
  }
};

module.exports = ListingController = {
  get,
  update,
  create,
  listings,
  upload
};
