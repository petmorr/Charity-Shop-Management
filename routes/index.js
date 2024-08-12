const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

// Export a function that takes itemsDb and logger as parameters
module.exports = (itemsDb, logger) => {
  // Define route for the home page
  router.get("/", (req, res) => indexController.getIndex(req, res, logger));

  // Define route for the about page
  router.get("/about", (req, res) =>
    indexController.getAbout(req, res, logger),
  );

  // Define route for the items page
  router.get("/items", (req, res) =>
    indexController.getItems(req, res, itemsDb, logger),
  );

  // Return the configured router
  return router;
};
