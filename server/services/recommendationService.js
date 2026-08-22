const queueService = require('./queueService');

/**
 * 8 Realistic Canteen Services / Counters with rich, overlapping and distinct tag sets
 */
const CANTEEN_SERVICES = [
  {
    id: 'canteen-snacks',
    name: 'Main Canteen - Snacks',
    category: 'Snacks',
    description: 'Hot samosas, crispy veg patties, kathi rolls, and fast canteen finger food.',
    tags: ['snacks', 'quick-service', 'fast-food', 'vegetarian'],
    locationId: 'campus-canteen',
    averageServiceTime: 2.0,
    activeCounters: 2,
    baseQueueLength: 7,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'canteen-meals',
    name: 'Main Canteen - Meals',
    category: 'Meals',
    description: 'Fresh North & South Indian thalis, rice bowls, dal makhani, and full lunch platters.',
    tags: ['meals', 'lunch', 'vegetarian', 'healthy', 'thali'],
    locationId: 'campus-canteen',
    averageServiceTime: 3.5,
    activeCounters: 2,
    baseQueueLength: 5,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'coffee-counter',
    name: 'Coffee & Brew Bar',
    category: 'Beverages',
    description: 'Artisan filter coffee, cappuccino, iced lattes, and quick bakery biscuits.',
    tags: ['beverages', 'coffee', 'quick-service', 'snacks', 'desserts'],
    locationId: 'snack-bar',
    averageServiceTime: 1.5,
    activeCounters: 2,
    baseQueueLength: 3,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'juice-counter',
    name: 'Fresh Juice & Smoothies',
    category: 'Beverages',
    description: 'Cold-pressed seasonal fruit juices, protein shakes, and healthy citrus coolers.',
    tags: ['beverages', 'juice', 'healthy', 'quick-service', 'vegetarian'],
    locationId: 'snack-bar',
    averageServiceTime: 2.0,
    activeCounters: 1,
    baseQueueLength: 4,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'fast-food-counter',
    name: 'Fast Food Express',
    category: 'Fast Food',
    description: 'Crispy burgers, cheesy fries, grilled sandwiches, and spicy noodle bowls.',
    tags: ['fast-food', 'snacks', 'quick-service', 'takeaway'],
    locationId: 'campus-canteen',
    averageServiceTime: 2.5,
    activeCounters: 2,
    baseQueueLength: 8,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'bakery-counter',
    name: 'Bakery & Pastry Counter',
    category: 'Bakery',
    description: 'Freshly baked chocolate croissants, muffins, tea cakes, and savory puffs.',
    tags: ['bakery', 'desserts', 'snacks', 'quick-service', 'coffee'],
    locationId: 'snack-bar',
    averageServiceTime: 1.5,
    activeCounters: 1,
    baseQueueLength: 2,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'healthy-counter',
    name: 'Healthy Greens & Salad Bar',
    category: 'Healthy',
    description: 'Custom protein salads, sprout chaat, fruit bowls, and detox drink mixes.',
    tags: ['healthy', 'vegetarian', 'meals', 'quick-service', 'juice'],
    locationId: 'campus-canteen',
    averageServiceTime: 2.0,
    activeCounters: 1,
    baseQueueLength: 2,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'takeaway-counter',
    name: 'Campus Takeaway Express',
    category: 'Takeaway',
    description: 'Pre-packed express meals, wraps, and quick grab-and-go combos for busy students.',
    tags: ['takeaway', 'fast-food', 'meals', 'quick-service'],
    locationId: 'campus-canteen',
    averageServiceTime: 1.5,
    activeCounters: 2,
    baseQueueLength: 4,
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&auto=format&fit=crop&q=80',
  },
];

/**
 * 1. Extract Global Feature Tag Vocabulary
 * V = [ 'beverages', 'coffee', 'juice', 'quick-service', 'snacks', 'meals', 'fast-food', 'healthy', 'bakery', 'takeaway', 'desserts', 'vegetarian', 'lunch', 'thali' ]
 */
function buildVocabulary(services = CANTEEN_SERVICES) {
  const vocabSet = new Set();
  services.forEach(service => {
    service.tags.forEach(tag => vocabSet.add(tag.toLowerCase().trim()));
  });
  return Array.from(vocabSet).sort();
}

/**
 * 2. Convert a service into a binary feature vector based on vocabulary
 * @param {Array<string>} tags
 * @param {Array<string>} vocabulary
 * @returns {Array<number>} Binary vector [1, 0, 1, 1, ...]
 */
function vectorize(tags, vocabulary) {
  const tagSet = new Set(tags.map(t => t.toLowerCase().trim()));
  return vocabulary.map(word => (tagSet.has(word) ? 1 : 0));
}

/**
 * 3. Exact Mathematical Cosine Similarity
 * CosineSimilarity(A, B) = (A • B) / (||A|| * ||B||)
 * @param {Array<number>} vecA
 * @param {Array<number>} vecB
 * @returns {number} Value between 0.0 and 1.0
 */
function calculateCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

/**
 * Helper to dynamically enrich service with live queue predictions
 */
async function enrichServiceWithLiveQueue(service) {
  try {
    const queueStatus = await queueService.getQueueStatus(service.locationId);
    
    // Calculate live people waiting for this counter
    const activeWaitingCount = queueStatus.peopleWaiting > 0 
      ? queueStatus.peopleWaiting 
      : service.baseQueueLength;

    const predictedWait = queueService.calculateETA(
      activeWaitingCount,
      service.averageServiceTime,
      service.activeCounters,
      1.0
    );

    let crowdLevel = 'Low';
    if (activeWaitingCount >= 7 || predictedWait >= 15) {
      crowdLevel = 'High';
    } else if (activeWaitingCount >= 4 || predictedWait >= 8) {
      crowdLevel = 'Moderate';
    }

    return {
      ...service,
      queueLength: activeWaitingCount,
      predictedWait,
      crowdLevel,
      currentServingToken: queueStatus.currentServingToken,
    };
  } catch (err) {
    return {
      ...service,
      queueLength: service.baseQueueLength,
      predictedWait: Math.round((service.baseQueueLength * service.averageServiceTime) / service.activeCounters),
      crowdLevel: service.baseQueueLength >= 6 ? 'High' : 'Moderate',
      currentServingToken: 12,
    };
  }
}

/**
 * Get all services with live crowd and ETA predictions
 */
async function getAllServices() {
  const enriched = await Promise.all(CANTEEN_SERVICES.map(s => enrichServiceWithLiveQueue(s)));
  return enriched;
}

/**
 * Get single service details
 */
async function getServiceById(serviceId) {
  const service = CANTEEN_SERVICES.find(s => s.id === serviceId);
  if (!service) return null;
  return await enrichServiceWithLiveQueue(service);
}

/**
 * ML Content-Based Recommender using Cosine Similarity
 * @param {string} serviceId
 * @param {number} topK - Number of recommendations to return (3-5)
 */
async function getSimilarServices(serviceId, topK = 4) {
  const targetService = CANTEEN_SERVICES.find(s => s.id === serviceId);
  if (!targetService) {
    throw new Error(`Service with ID '${serviceId}' not found.`);
  }

  const vocabulary = buildVocabulary(CANTEEN_SERVICES);
  const targetVector = vectorize(targetService.tags, vocabulary);
  const targetTagsSet = new Set(targetService.tags.map(t => t.toLowerCase()));

  // Compute similarity with all other services
  const similarities = [];

  for (const candidate of CANTEEN_SERVICES) {
    if (candidate.id === targetService.id) continue; // Exclude current service

    const candidateVector = vectorize(candidate.tags, vocabulary);
    const score = calculateCosineSimilarity(targetVector, candidateVector);

    // Extract overlapping matching features/tags
    const matchingTags = candidate.tags.filter(t => targetTagsSet.has(t.toLowerCase()));

    // Enrich candidate with live queue data
    const enrichedCandidate = await enrichServiceWithLiveQueue(candidate);

    similarities.push({
      ...enrichedCandidate,
      similarityScore: parseFloat(score.toFixed(4)), // e.g. 0.8165
      similarityPercentage: Math.round(score * 100), // e.g. 82%
      matchingTags,
      matchQuality: score >= 0.75 ? 'High Match' : score >= 0.5 ? 'Good Match' : 'Related',
    });
  }

  // Strictly rank by Content-Based Cosine Similarity descending
  similarities.sort((a, b) => b.similarityScore - a.similarityScore);

  // Return top 3 to 5 recommendations
  const recommendations = similarities.slice(0, Math.min(topK, similarities.length));

  return {
    targetService: await enrichServiceWithLiveQueue(targetService),
    vocabulary,
    totalServicesEvaluated: CANTEEN_SERVICES.length - 1,
    recommendations,
  };
}

module.exports = {
  CANTEEN_SERVICES,
  buildVocabulary,
  vectorize,
  calculateCosineSimilarity,
  getAllServices,
  getServiceById,
  getSimilarServices,
};
