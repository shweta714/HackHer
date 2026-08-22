const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// List all services / counters
router.get('/', serviceController.getAllServices);

// Get single service details
router.get('/:serviceId', serviceController.getServiceById);

// Get ML Content-Based Recommendations for a service
router.get('/:serviceId/recommendations', serviceController.getRecommendations);

module.exports = router;
