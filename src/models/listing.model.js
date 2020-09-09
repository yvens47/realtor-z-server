// const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define UserSchema
const listingSchema = new mongoose.Schema({
  address: {},
  address_two: String,
  about: String,
  photos: Array,
  price: Number,
  bedrooms: Number,
  bathrooms: Number,
  agent: {
    agency: String,
    name: String,
    email: String,
    phone: String
  },

  userid: mongoose.ObjectId,
  status: {
    type: String,
    default: "Unpublished"
  },
  views: Array,
  coords: {
    lat: String,
    lng: String
  }
}, {
  timestamps: true
});

listingSchema.statics.findListingsByUser = function (userid) {
  return this.find({
    userid: userid
  });
};

listingSchema.methods.findSimilar = async function (model, doc) {
  const similar = await model
    .find({
      "address.zip": doc.address.zip,
      _id: {
        $ne: doc._id
      }
    })
    .lean()
    .exec();
  return similar;
};

// get address_two

listingSchema.virtual("listingAddress").get(function () {
  const {
    street,
    city,
    state,
    zip
  } = this.address;
  return street + " " + city + " " + state + " " + zip;
});

module.exports = mongoose.model("Listing", listingSchema);