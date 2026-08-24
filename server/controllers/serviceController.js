const recommendationService = require('../services/recommendationService');

/**
 * Get All Canteens
 * GET /api/canteens or GET /api/services
 */
const getAllCanteens = async (req, res) => {
  try {
    const canteens = await recommendationService.getAllCanteens();
    return res.status(200).json({
      success: true,
      count: canteens.length,
      data: canteens,
    });
  } catch (error) {
    console.error('Error fetching canteens:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve canteen locations.',
    });
  }
};

/**
 * Get Single Canteen By ID
 * GET /api/canteens/:canteenId
 */
const getCanteenById = async (req, res) => {
  try {
    const { canteenId, serviceId } = req.params;
    const targetId = canteenId || serviceId;
    const canteen = await recommendationService.getCanteenById(targetId);

    if (!canteen) {
      return res.status(404).json({
        success: false,
        message: `Canteen with ID '${targetId}' was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: canteen,
    });
  } catch (error) {
    console.error('Error fetching canteen:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve canteen details.',
    });
  }
};

/**
 * Get Menu Items
 * GET /api/menu
 */
const getMenu = async (req, res) => {
  try {
    const { canteenId, category, isVeg, search } = req.query;
    const items = await recommendationService.getMenuItems({ canteenId, category, isVeg, search });

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve menu items.',
    });
  }
};

/**
 * Get Single Food Item
 * GET /api/menu/:itemId
 */
const getFoodItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await recommendationService.getFoodItemById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Food item '${itemId}' was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error fetching food item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve food item.',
    });
  }
};

/**
 * Get ML Recommendations for Food Item
 * GET /api/menu/:itemId/recommendations or GET /api/services/:serviceId/recommendations
 */
const getRecommendations = async (req, res) => {
  try {
    const { itemId, serviceId } = req.params;
    const targetId = itemId || serviceId;
    const limit = parseInt(req.query.limit || '4', 10);
    const { canteenId } = req.query;

    const result = await recommendationService.getFoodRecommendations(targetId, limit, canteenId);

    return res.status(200).json({
      success: true,
      itemId: targetId,
      algorithm: 'Content-Based Cosine Similarity (TF Vector Space)',
      vocabularySize: result.vocabularyLength,
      recommendations: result.recommendations,
      targetItem: result.targetItem,
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return res.status(error.message.includes('not found') ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to compute ML recommendations.',
    });
  }
};

module.exports = {
  getAllCanteens,
  getCanteenById,
  getMenu,
  getFoodItemById,
  getRecommendations,
  // Backward compatibility aliases
  getAllServices: getAllCanteens,
  getServiceById: getCanteenById,
};
