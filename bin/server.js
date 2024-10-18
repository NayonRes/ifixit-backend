#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require("../app");
const debug = require("debug")("ifixit-backend:server");
const http = require("http");

/**
 * Get port from environment and store in Express.
 */
console.log("env working", process.env.PORT);
// var port = normalizePort(process.env.PORT || "3000");
const port = process.env.PORT || 3000;
const hostname = process.env.HOST || "127.0.0.1";
app.set("port", port);
console.log("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * 0Listen on provided port, on all network interfaces.
 */

// server.listen(port);

server.listen(port, hostname, () => {
  // console.log("Server Running on port " + hostname + ":" + port);
  console.log("Server Running on port :" + port);
});
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}