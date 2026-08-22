const recommendationService = require('../services/recommendationService');

/**
 * Get all available canteen services
 * GET /api/services
 */
const getAllServices = async (req, res) => {
  try {
    const services = await recommendationService.getAllServices();
    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve canteen services.',
    });
  }
};

/**
 * Get single service details
 * GET /api/services/:serviceId
 */
const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await recommendationService.getServiceById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service with ID '${serviceId}' was not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve service details.',
    });
  }
};

/**
 * Get ML Content-Based Recommendations using Cosine Similarity
 * GET /api/services/:serviceId/recommendations
 */
const getRecommendations = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const topK = parseInt(req.query.limit || '4', 10);

    const result = await recommendationService.getSimilarServices(serviceId, topK);

    return res.status(200).json({
      success: true,
      serviceId,
      algorithm: 'Content-Based Cosine Similarity (TF Vector Space)',
      vocabularySize: result.vocabulary.length,
      recommendations: result.recommendations,
      targetService: result.targetService,
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
  getAllServices,
  getServiceById,
  getRecommendations,
};
