const express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
const mongoose = require("mongoose");
var jwt = require("express-jwt");
const path = require("path");
var admin = require("sriracha");

const app = express();
require("dotenv").config();
// routers
const userRouter = require("./routes/userRouter");
const listingRouter = require("./routes/listingRouter");

// utils
const {
  connect
} = require("./utils/db");
// database connection
connect();
var corsOptions = {
  origin: "*"
};
app.use(cors());
app.use(morgan("combined"));
// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// parse application/json
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/admin", admin());
//endpoints
app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);
app.use(express.static(path.join(__dirname, "../../realtor-z/build")));

app.get("*", (req, res) => {
  const endPoints = [{
      users: ['/api/users', ],
      listings: ['/api/listings']

    }

  ];
  res.json({
    endPoints
  });
  //res.sendFile(path.join(__dirname,"../../realtor-z/build/index.html"));
});

//runserver
var PORT;
if (process.env.NODE_ENV === "production") {
  PORT = process.env.PORT || 3000;
} else {
  PORT = process.env.PORT || 5000;
}
app.listen(PORT, () => {
  console.log("server has started");
});