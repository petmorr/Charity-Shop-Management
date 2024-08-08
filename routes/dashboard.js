const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

module.exports = (logger) => {
  router.get('/', (req, res) => dashboardController.getDashboard(req, res, logger));
  return router;
};