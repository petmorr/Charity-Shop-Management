const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");

module.exports = (itemsDb, logger) => {
  router.get("/", (req, res) => indexController.getIndex(req, res, logger));
  router.get("/about", (req, res) =>
    indexController.getAbout(req, res, logger),
  );
  router.get("/items", (req, res) =>
    indexController.getItems(req, res, itemsDb, logger),
  );
  return router;
};
