const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Canteens & Services
router.get('/', serviceController.getAllCanteens);
router.get('/canteens', serviceController.getAllCanteens);
router.get('/canteens/:canteenId', serviceController.getCanteenById);

// Menu Items & Food Details
router.get('/menu', serviceController.getMenu);
router.get('/menu/:itemId', serviceController.getFoodItemById);
router.get('/menu/:itemId/recommendations', serviceController.getRecommendations);

// Specific service / item lookup and recommendations
router.get('/:serviceId', serviceController.getCanteenById);
router.get('/:serviceId/recommendations', serviceController.getRecommendations);

module.exports = router;
