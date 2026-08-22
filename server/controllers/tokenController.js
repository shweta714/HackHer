const queueService = require('../services/queueService');

/**
 * Get Token tracking details
 * GET /api/token/:tokenNumber
 */
const getTokenDetails = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const { locationId = 'campus-canteen' } = req.query;

    const details = await queueService.getTokenDetails(tokenNumber, locationId);

    if (!details) {
      return res.status(404).json({
        success: false,
        message: `Token #${tokenNumber} was not found for location '${locationId}'.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: details,
    });
  } catch (error) {
    console.error('Error in getTokenDetails:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch token details.',
    });
  }
};

/**
 * Cancel Token
 * DELETE /api/token/:tokenNumber
 */
const cancelToken = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const { locationId = 'campus-canteen' } = req.query;

    const result = await queueService.cancelToken(tokenNumber, locationId);

    const io = req.app.get('io');
    if (io) {
      io.emit('queue_updated', { locationId, action: 'TOKEN_CANCELLED', tokenNumber });
    }

    return res.status(200).json({
      success: true,
      message: `Token #${tokenNumber} has been successfully cancelled.`,
      data: result,
    });
  } catch (error) {
    console.error('Error in cancelToken:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel token.',
    });
  }
};

module.exports = {
  getTokenDetails,
  cancelToken,
};
