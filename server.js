const express = require("express");
const bodyParser = require("body-parser");
const dataBaseConn = require("./config/dbConn");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Dotenv Config
require("dotenv").config({
  path: "./config/config.env",
});

const app = express();

app.use(cookieParser());

//Connecting to the database
dataBaseConn();

//Bodyparser
app.use(bodyParser.json());

// Dev Loggin Middleware
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
}

//Load routes
const authenticationRouter = require("./routes/authentication_route");
const { cookie } = require("express-validator");

//Use routes
app.use("/api/", authenticationRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
