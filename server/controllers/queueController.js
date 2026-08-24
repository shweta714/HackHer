const queueService = require('../services/queueService');

const normalizeCanteenId = (id) => {
  if (!id) return 'main-campus';
  if (id === 'campus-canteen' || id === 'main') return 'main-campus';
  if (id === 'snack-bar' || id === 'blockb') return 'block-b';
  return id;
};

const broadcastQueueUpdate = (req, canteenId, extraData = {}) => {
  const io = req.app.get('io');
  if (io) {
    const payload = { canteenId, timestamp: new Date(), ...extraData };
    io.emit('queue_updated', payload);
    io.to(`location_${canteenId}`).emit('queue_updated', payload);
    if (extraData.orderId) {
      io.emit(`order_${extraData.orderId}`, payload);
    }
  }
};

/**
 * Place Order & Join Queue
 * POST /api/queue/order
 */
const createOrder = async (req, res) => {
  try {
    const {
      canteenId = 'main-campus',
      locationId,
      customerName,
      userName,
      customerPhone,
      userPhone,
      items,
      serviceType,
      notes,
    } = req.body;

    const targetCanteen = normalizeCanteenId(canteenId || locationId);
    const name = customerName || userName;
    const phone = customerPhone || userPhone || '';

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Customer name is required to place an order.',
      });
    }

    let orderItems = items;
    if (!orderItems || orderItems.length === 0) {
      orderItems = [
        {
          id: targetCanteen === 'main-campus' ? 'mc-paneer-roll' : 'bb-paneer-wrap',
          name: serviceType || (targetCanteen === 'main-campus' ? 'Paneer Kathi Roll' : 'Spicy Paneer Tikka Wrap'),
          price: 70,
          quantity: 1,
          preparationTime: 6,
        },
      ];
    }

    const result = await queueService.createOrder({
      canteenId: targetCanteen,
      customerName: name,
      customerPhone: phone,
      items: orderItems,
      notes,
    });

    broadcastQueueUpdate(req, targetCanteen, {
      action: 'ORDER_PLACED',
      orderId: result.orderId,
      tokenNumber: result.tokenNumber,
    });

    return res.status(201).json({
      success: true,
      message: `Order confirmed! Your Token is #${result.tokenNumber} (Order ${result.orderId})`,
      data: {
        ...result,
        token: {
          tokenNumber: result.tokenNumber,
          orderId: result.orderId,
          userName: result.order.customerName,
          serviceType: result.order.items.map(i => `${i.name} (x${i.quantity})`).join(', '),
          status: result.order.status,
          locationId: targetCanteen,
        },
      },
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order.',
    });
  }
};

/**
 * Get Canteen Live Queue Status
 * GET /api/queue/status/:locationId
 */
const getQueueStatus = async (req, res) => {
  try {
    const { locationId = 'main-campus' } = req.params;
    const targetCanteen = normalizeCanteenId(locationId);

    const status = await queueService.getQueueStatus(targetCanteen);

    return res.status(200).json({
      success: true,
      data: {
        ...status,
        locationId: targetCanteen,
        locationName: status.canteenName,
        peopleWaiting: status.activeQueueCount,
      },
    });
  } catch (error) {
    console.error('Error in getQueueStatus:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch queue status.',
    });
  }
};

/**
 * Get Specific Order Tracking Details
 * GET /api/queue/order/:orderId
 */
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { canteenId, locationId } = req.query;
    const targetCanteen = canteenId || locationId ? normalizeCanteenId(canteenId || locationId) : null;

    const details = await queueService.getOrderDetails(orderId, targetCanteen);

    if (!details) {
      return res.status(404).json({
        success: false,
        message: `Order #${orderId} was not found.`,
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
          serviceType: details.items.map(i => `${i.name} (x${i.quantity})`).join(', '),
        },
      },
    });
  } catch (error) {
    console.error('Error in getOrderDetails:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch order details.',
    });
  }
};

/**
 * Admin: Update Order Status
 * PUT /api/queue/order/:orderId/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, canteenId } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'New status is required.',
      });
    }

    const result = await queueService.updateOrderStatus(orderId, status, canteenId);

    broadcastQueueUpdate(req, result.order.canteenId, {
      action: 'STATUS_UPDATED',
      orderId: result.order.orderId,
      tokenNumber: result.order.tokenNumber,
      newStatus: status,
    });

    return res.status(200).json({
      success: true,
      message: `Order #${orderId} status updated to '${status}'.`,
      data: result,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status.',
    });
  }
};

/**
 * Admin: Remove Order from Queue / History
 * DELETE /api/queue/order/:orderId
 */
const removeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { canteenId = 'main-campus' } = req.query;
    const targetCanteen = normalizeCanteenId(canteenId);

    const updatedQueue = await queueService.removeOrder(orderId, targetCanteen);

    broadcastQueueUpdate(req, targetCanteen, {
      action: 'ORDER_REMOVED',
      orderId,
    });

    return res.status(200).json({
      success: true,
      message: `Order #${orderId} removed from queue.`,
      data: updatedQueue,
    });
  } catch (error) {
    console.error('Error removing order:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove order.',
    });
  }
};

/**
 * Admin: Update Active Counters & Settings
 * PUT /api/queue/config/:locationId
 */
const updateQueueConfig = async (req, res) => {
  try {
    const { locationId = 'main-campus' } = req.params;
    const targetCanteen = normalizeCanteenId(locationId);
    const { activeCounters, averageServiceTime, loadFactor } = req.body;

    const updatedQueue = await queueService.updateQueueConfig(targetCanteen, {
      activeCounters,
      averageServiceTime,
      loadFactor,
    });

    broadcastQueueUpdate(req, targetCanteen, { action: 'CONFIG_UPDATED' });

    return res.status(200).json({
      success: true,
      message: 'Canteen counter configuration updated.',
      data: updatedQueue,
    });
  } catch (error) {
    console.error('Error updating config:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update configuration.',
    });
  }
};

/**
 * Serve Next Order
 * POST /api/queue/serve-next/:locationId
 */
const serveNext = async (req, res) => {
  try {
    const { locationId = 'main-campus' } = req.params;
    const targetCanteen = normalizeCanteenId(locationId);

    const queueStatus = await queueService.getQueueStatus(targetCanteen);
    const nextOrder = queueStatus.activeOrders[0];

    if (!nextOrder) {
      return res.status(200).json({
        success: true,
        message: 'No active orders waiting in the queue.',
      });
    }

    let nextState = 'ready';
    if (nextOrder.status === 'placed') nextState = 'preparing';
    else if (nextOrder.status === 'preparing') nextState = 'almost_ready';
    else if (nextOrder.status === 'almost_ready') nextState = 'ready';

    const result = await queueService.updateOrderStatus(nextOrder.orderId, nextState, targetCanteen);

    broadcastQueueUpdate(req, targetCanteen, {
      action: 'SERVE_NEXT',
      orderId: nextOrder.orderId,
      tokenNumber: nextOrder.tokenNumber,
      newStatus: nextState,
    });

    return res.status(200).json({
      success: true,
      message: `Order #${nextOrder.orderId} is now '${nextState}'!`,
      data: result,
    });
  } catch (error) {
    console.error('Error in serveNext:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to advance queue.',
    });
  }
};

/**
 * Seed Demo Data
 * POST /api/queue/seed/:locationId
 */
const seedDemoData = async (req, res) => {
  try {
    const { locationId = 'main-campus' } = req.params;
    const targetCanteen = normalizeCanteenId(locationId);

    const seededStatus = await queueService.seedDemoData(targetCanteen);

    broadcastQueueUpdate(req, targetCanteen, { action: 'DEMO_SEEDED' });

    return res.status(200).json({
      success: true,
      message: `Demo orders successfully loaded for ${seededStatus.canteenName}.`,
      data: seededStatus,
    });
  } catch (error) {
    console.error('Error in seedDemoData:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to seed demo data.',
    });
  }
};

/**
 * Reset Queue
 * POST /api/queue/reset/:locationId
 */
const resetQueue = async (req, res) => {
  try {
    const { locationId = 'main-campus' } = req.params;
    const targetCanteen = normalizeCanteenId(locationId);

    const resetStatus = await queueService.resetQueue(targetCanteen);

    broadcastQueueUpdate(req, targetCanteen, { action: 'QUEUE_RESET' });

    return res.status(200).json({
      success: true,
      message: 'Queue has been cleanly reset to empty.',
      data: resetStatus,
    });
  } catch (error) {
    console.error('Error in resetQueue:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to reset queue.',
    });
  }
};

/**
 * Get Analytics
 * GET /api/queue/analytics/:locationId
 */
const getAnalytics = async (req, res) => {
  try {
    const { locationId = 'main-campus' } = req.params;
    const targetCanteen = normalizeCanteenId(locationId);

    const analytics = await queueService.getAnalytics(targetCanteen);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve analytics.',
    });
  }
};

module.exports = {
  createOrder,
  getQueueStatus,
  getOrderDetails,
  updateOrderStatus,
  removeOrder,
  updateQueueConfig,
  serveNext,
  seedDemoData,
  resetQueue,
  getAnalytics,
};
