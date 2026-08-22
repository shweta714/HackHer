const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Join Queue
router.post('/join', queueController.joinQueue);

// Get Queue Live Status
router.get('/status/:locationId', queueController.getQueueStatus);

// Serve Next Customer
router.post('/serve-next/:locationId', queueController.serveNext);

// Update Queue Settings (Counters, Avg Time)
router.put('/config/:locationId', queueController.updateQueueConfig);

// Seed Demo Data for Instant Hackathon Presentation
router.post('/seed/:locationId', queueController.seedDemoData);

// Reset Queue
router.post('/reset/:locationId', queueController.resetQueue);

// Get Queue Analytics
router.get('/analytics/:locationId', queueController.getAnalytics);

module.exports = router;
