const User = require("../models/user.model");
const Listing = require("../models/listing.model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const {
  sendMail
} = require("../utils/email");

signup = async (req, res) => {
  try {
    // create a new user and save to db
    const doc = await User.create(req.body);
    res.status(201).json({
      data: doc,
      success: true
    });
  } catch (e) {
    // unable to create and save user
    const {
      name,
      email,
      password
    } = e.errors;
    const data = {
      name: name.message,
      email: email.message,
      password: password.message
    };


    res
      .status(400)
      .json(data)
      .end();
  }
};

login = async (req, res) => {
  const {
    email,
    password
  } = req.body;
  // check if user is in db
  try {
    User.findOne({
      email: email
    }, function (err, u) {
      if (err || !u) {
        return res
          .status(401)
          .json({
            error: "email or password does not exist"
          });
      }
      // check if user password matches one found from database
      u.checkPassword(password).then(function (result) {
        if (result) {
          const {
            _id,
            email,
            name,
            picture,
            phone
          } = u;

          // set token
          const token = jwt.sign({
            id: _id
          }, "secret", {
            expiresIn: 60 * 60
          });

          // set cookie
          res.cookie("t", token, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true
          });

          return res.json({
            token,
            user: {
              id: _id,
              email: email,
              name: name,
              picture: picture,
              phone: phone
            }
          });
        } else {
          return res.status(401).json({
            error: " Invalid email or password"
          });
        }
      });
    });

    // res.json(req.body);
  } catch (error) {
    res.json({
      error
    });
  }
};

logout = async (req, res) => {
  // destroy cookie
  res.clearCookie("t");
  res.json({
    message: "signed out"
  });
};

// send a password to user
forgotPassword = async (req, res) => {
  // mailtrap.io to check if email sent
  var transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "76d682b4d81afd",
      pass: "ee4eb37bcaeb46"
    }
  });

  const {
    email
  } = req.body;
  try {
    /* check if email is db */
    User.findOne({
      email: email
    }, function (err, u) {
      if (err || !u) {
        // no, return message email does not exist in our database

        return res.status(401).json({
          error: "email  does not exist"
        });
      }
      // if yess send an email with a random password
      const randomPassword = Math.random()
        .toString(36)
        .substring(2, 10);
      // send email to user with a random password.

      //update password in db then send the email

      sendMail(
        email,
        "Realtor-z",
        `Your new temporary password is ${randomPassword}`,
        "Temporary password",
        transporter
      );
      res.json({
        status: "ok",
        message: "Your new password was sent. please check your email"
      });
    });
  } catch (e) {
    res
      .status(401)
      .json({
        error: e
      })
      .end();
  }
};

getUserDashboard = async (req, res) => {
  const userId = req.params.userId;
  try {
    Listing.findListingsByUser(userId).then(result => {

      res.json(result);
    });
  } catch (error) { }
};

upload = async (req, res, next) => {
  const userid = req.params.id;
  const path = req.file.filename;

  if (req.error) {
    res.status(400).json({
      status: false,
      message: req.errro
    });
  } else {
    // update user doc in database
    User.findById({
      _id: userid
    }, (error, doc) => {
      doc.picture = path;
      doc.save();
    });
    try { } catch (error) { }

    res.json({
      status: 200,
      message: "upload successfully",
      path: path
    });
  }
};
deleteUserListing = async (req, res) => {
  const message = await Listing.findByIdAndRemove(req.params.id).then(
    () => "Listing deleted"
  );

  res.json({
    message
  });
};

// update a listing based on id received from req.body
update = async (req, res) => {

  try {
    const {
      name,
      phone,
      company,
      photos

    } = req.body;
    const userId = req.body.userId;
    const data = {
      name,
      phone,
      company
    };

    User.findByIdAndUpdate({
      _id: userId
    },
      data, {
      multi: true,
      new: true
    },
      (err, doc) => {
        if (err || !doc) {
          res.json({
            error: "unable yo update User Profile"
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

module.exports = userController = {
  upload,
  getUserDashboard,
  forgotPassword,
  logout,
  login,
  signup,
  deleteUserListing,
  update
};