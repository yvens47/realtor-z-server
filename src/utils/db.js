const mongoose = require("mongoose");
const dbUrl = process.env.MONGODB_URI || 'mongodb+srv://jyvenspierre:yvenstij43gt@cluster0.sjcbu.mongodb.net/realtor-z?retryWrites=true&w=majority'
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
