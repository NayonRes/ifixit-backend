let createError = require("http-errors");
const responseBuilder = require('./builder/responseBuilder');
let express = require("express");
const fs = require('fs');
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const conntectDB = require("./db/database");

const errorMiddleware = require("./middleware/error");
// Database connection

conntectDB();

let app = express();

let whitelist = [
  "https://digital-shop-admin-panel.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
];
let corsOptions = {
  // origin: "https://ifixit-backend.onrender.com",

  origin: function (origin, callback) {
    console.log("origin", origin);
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionSuccessStatus: 200,
};
// app.use(cors());

app.use(cors(corsOptions));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload({ useTempFiles: true }));
const routesPath = path.join(__dirname, 'routes');
fs.readdirSync(routesPath).forEach((file) => {
  const route = require(path.join(routesPath, file));
  if (typeof route === 'function') {
    app.use('/', route);
  } else {
    console.error(`Route in file ${file} is not a valid route handler.`);
  }
});

// Function to list all routes
function listRoutes(app) {
  console.log('Registered Routes:');
  app._router.stack
      .filter((r) => r.route) // Filter out non-route middleware
      .forEach((r) => {
        const methods = Object.keys(r.route.methods).map((method) => method.toUpperCase());
        console.log(`${methods.join(', ')} ${r.route.path}`);
      });
}

// Call the function to list routes
listRoutes(app);

// catch 404 and forward to error handler
app.use(errorMiddleware);
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
