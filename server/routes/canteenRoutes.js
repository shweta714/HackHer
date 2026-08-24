const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// GET /api/canteens
router.get('/', serviceController.getAllCanteens);

// GET /api/canteens/:canteenId
router.get('/:canteenId', serviceController.getCanteenById);

module.exports = router;
