const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// define UserSchema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, 'name is too short'],
    required: "Please enter name"
  },
  email: {
    type: String,
    required: "Please enter your email",
    unique: true,
    trim: true
  },
  username: {
    type: String,
    //required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: "Please enter password"
  },
  picture: {
    type: String,
    default: ""
  },
  phone: {
    type: String,
    default: ""
  },
  company: {
    type: String,
    default: ""
  },

  role: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }

    this.password = hash;
    next();
  });
});

userSchema.methods.checkPassword = function (password) {
  const passwordHash = this.password;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err);
      }

      resolve(same);
    });
  });
};
module.exports = mongoose.model("User", userSchema);