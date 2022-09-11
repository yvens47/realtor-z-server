const express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
const mongoose = require("mongoose");
var jwt = require("express-jwt");
const path = require("path");
var admin = require("sriracha");
const helmet = require('helmet')
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app)
const io = new Server(server)
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
  origin: '*',

}
app.use(helmet())
app.disable('x-powered-by')
app.use(cors(corsOptions));
app.use(morgan("tiny"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/admin", admin());
//endpoints
app.use("/api/users", userRouter);
app.use("/api/listings", listingRouter);
app.use(express.static(path.join(__dirname, "../../realtor-z/build")));



app.get("*", (req, res) => {
  res.json({
    data: "Welcome to Realtor Server API Home page"
  });
  //res.sendFile(path.join(__dirname,"../../realtor-z/build/index.html"));
});


//runserver
var PORT;
if (process.env.NODE_ENV === "production") {
  PORT = process.env.PORT || 3000;
} else {
  PORT = process.env.PORTDEV || 5000;
}


// app.listen(PORT, () => {

//   console.log("server has started " + PORT);
// });
io.on('connection', (socket) => {
  console.log('a user connected');

  io.on('data', (data) => {
    console.log(data)

  })
});

io.on('data', (arg) => {
  console.log(arg)
})



server.listen(PORT, () => {

  console.log("server has started " + PORT);
});