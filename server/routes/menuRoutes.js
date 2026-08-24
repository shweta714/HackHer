const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// GET /api/menu (supports query: ?canteenId=main-campus&category=Snacks&isVeg=true)
router.get('/', serviceController.getMenu);

// GET /api/menu/:itemId
router.get('/:itemId', serviceController.getFoodItemById);

// GET /api/menu/:itemId/recommendations
router.get('/:itemId/recommendations', serviceController.getRecommendations);

module.exports = router;
