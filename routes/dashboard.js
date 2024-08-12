const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// Export a function that takes a logger as an argument
module.exports = (logger) => {
  // Define a route for the root path that uses the dashboardController's getDashboard method
  router.get("/", (req, res) =>
    dashboardController.getDashboard(req, res, logger),
  );
  return router; // Return the configured router
};
