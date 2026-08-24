const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Create Order / Join Queue
router.post('/order', queueController.createOrder);
router.post('/join', queueController.createOrder);

// Get Live Queue Status per Canteen
router.get('/status/:locationId', queueController.getQueueStatus);

// Get Order Tracking Details
router.get('/order/:orderId', queueController.getOrderDetails);

// Update Order Status (Admin)
router.put('/order/:orderId/status', queueController.updateOrderStatus);

// Remove / Clear Order (Admin user remover)
router.delete('/order/:orderId', queueController.removeOrder);

// Update Active Counters and Service Times
router.put('/config/:locationId', queueController.updateQueueConfig);

// Advance Queue / Serve Next
router.post('/serve-next/:locationId', queueController.serveNext);

// Seed Demo Orders
router.post('/seed/:locationId', queueController.seedDemoData);

// Reset Queue
router.post('/reset/:locationId', queueController.resetQueue);

// Canteen Queue Analytics
router.get('/analytics/:locationId', queueController.getAnalytics);

module.exports = router;
