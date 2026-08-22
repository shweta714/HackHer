const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Get User Token Position & Live ETA
router.get('/:tokenNumber', tokenController.getTokenDetails);

// Cancel User Token
router.delete('/:tokenNumber', tokenController.cancelToken);

module.exports = router;
