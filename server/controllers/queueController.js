const queueService = require('../services/queueService');

// Broadcast helper
const broadcastQueueUpdate = (req, locationId, extraData = {}) => {
  const io = req.app.get('io');
  if (io) {
    io.emit('queue_updated', { locationId, timestamp: new Date(), ...extraData });
    io.to(`location_${locationId}`).emit('queue_updated', { locationId, timestamp: new Date(), ...extraData });
  }
};

/**
 * Join Queue
 * POST /api/queue/join
 */
const joinQueue = async (req, res) => {
  try {
    const { locationId = 'campus-canteen', userName, userPhone, serviceType } = req.body;

    if (!userName || !userName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required to join the queue.',
      });
    }

    const result = await queueService.joinQueue({
      locationId,
      userName,
      userPhone,
      serviceType,
    });

    // Real-time broadcast
    broadcastQueueUpdate(req, locationId, { action: 'USER_JOINED', tokenNumber: result.token.tokenNumber });

    return res.status(201).json({
      success: true,
      message: `Successfully joined queue! Your Token is #${result.token.tokenNumber}`,
      data: result,
    });
  } catch (error) {
    console.error('Error in joinQueue:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to join queue. Please try again.',
    });
  }
};

/**
 * Get Queue Status
 * GET /api/queue/status/:locationId
 */
const getQueueStatus = async (req, res) => {
  try {
    const { locationId = 'campus-canteen' } = req.params;
    const status = await queueService.getQueueStatus(locationId);

    return res.status(200).json({
      success: true,
      data: status,
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
 * Serve Next Customer
 * POST /api/queue/serve-next/:locationId
 */
const serveNext = async (req, res) => {
  try {
    const { locationId = 'campus-canteen' } = req.params;
    const result = await queueService.serveNext(locationId);

    const io = req.app.get('io');
    if (io && result.servedToken) {
      io.emit('token_served', {
        locationId,
        tokenNumber: result.servedToken.tokenNumber,
        userName: result.servedToken.userName,
        timestamp: new Date(),
      });
    }

    // Broadcast queue update to all screens
    broadcastQueueUpdate(req, locationId, {
      action: 'SERVE_NEXT',
      servedToken: result.servedToken,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in serveNext:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to advance queue.',
    });
  }
};

/**
 * Update Queue Configuration
 * PUT /api/queue/config/:locationId
 */
const updateQueueConfig = async (req, res) => {
  try {
    const { locationId = 'campus-canteen' } = req.params;
    const { activeCounters, averageServiceTime, loadFactor } = req.body;

    const updatedStatus = await queueService.updateQueueConfig(locationId, {
      activeCounters,
      averageServiceTime,
      loadFactor,
    });

    broadcastQueueUpdate(req, locationId, { action: 'CONFIG_UPDATED' });

    return res.status(200).json({
      success: true,
      message: 'Queue configuration updated successfully.',
      data: updatedStatus,
    });
  } catch (error) {
    console.error('Error in updateQueueConfig:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update queue settings.',
    });
  }
};

/**
 * Seed Demo Data for Instant Hackathon Demonstration
 * POST /api/queue/seed/:locationId
 */
const seedDemoData = async (req, res) => {
  try {
    const { locationId = 'campus-canteen' } = req.params;
    const seededStatus = await queueService.seedDemoData(locationId);

    broadcastQueueUpdate(req, locationId, { action: 'DEMO_SEEDED' });

    return res.status(200).json({
      success: true,
      message: 'Demo dataset successfully loaded (#12 serving, #13-#17 waiting).',
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
    const { locationId = 'campus-canteen' } = req.params;
    const resetStatus = await queueService.resetQueue(locationId);

    broadcastQueueUpdate(req, locationId, { action: 'QUEUE_RESET' });

    return res.status(200).json({
      success: true,
      message: 'Queue successfully reset to empty.',
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
    const { locationId = 'campus-canteen' } = req.params;
    const analytics = await queueService.getAnalytics(locationId);

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
  joinQueue,
  getQueueStatus,
  serveNext,
  updateQueueConfig,
  seedDemoData,
  resetQueue,
  getAnalytics,
};
