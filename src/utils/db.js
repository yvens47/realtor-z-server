const mongoose = require("mongoose");
const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/realtor-z";
const connect = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    console.log(error);
  }
  mongoose.connection.on("error", err => {
    console.log(err);
  });
};

exports.connect = connect;
