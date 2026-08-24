const queueService = require('../services/queueService');

const normalizeCanteenId = (id) => {
  if (!id) return 'main-campus';
  if (id === 'campus-canteen' || id === 'main') return 'main-campus';
  if (id === 'snack-bar' || id === 'blockb') return 'block-b';
  return id;
};

/**
 * Get Token tracking details
 * GET /api/token/:tokenNumber
 */
const getTokenDetails = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const { locationId, canteenId } = req.query;
    const targetCanteen = locationId || canteenId ? normalizeCanteenId(locationId || canteenId) : null;

    const details = await queueService.getOrderDetails(tokenNumber, targetCanteen);

    if (!details) {
      return res.status(404).json({
        success: false,
        message: `Token #${tokenNumber} was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...details,
        locationId: details.canteenId,
        locationName: details.canteenName,
        token: {
          tokenNumber: details.tokenNumber,
          orderId: details.orderId,
          userName: details.customerName,
          status: details.status,
          serviceType: details.items ? details.items.map(i => `${i.name} (x${i.quantity})`).join(', ') : 'Canteen Order',
        },
      },
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
 * Cancel Token / Order
 * DELETE /api/token/:tokenNumber
 */
const cancelToken = async (req, res) => {
  try {
    const { tokenNumber } = req.params;
    const { locationId, canteenId } = req.query;
    const targetCanteen = normalizeCanteenId(locationId || canteenId);

    const result = await queueService.removeOrder(tokenNumber, targetCanteen);

    const io = req.app.get('io');
    if (io) {
      io.emit('queue_updated', { canteenId: targetCanteen, action: 'ORDER_CANCELLED', tokenNumber });
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
