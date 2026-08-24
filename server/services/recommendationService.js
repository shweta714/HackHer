const { CANTEENS, FOOD_ITEMS } = require('../data/canteenData');

/**
 * 1. Build Vocabulary from all food tags, categories, and attributes
 */
function buildFoodVocabulary(items = FOOD_ITEMS) {
  const vocabSet = new Set();
  items.forEach(item => {
    if (item.category) vocabSet.add(`cat:${item.category.toLowerCase()}`);
    if (item.spiceLevel) vocabSet.add(`spice:${item.spiceLevel.toLowerCase()}`);
    if (item.isVeg !== undefined) vocabSet.add(item.isVeg ? 'diet:veg' : 'diet:nonveg');
    (item.tags || []).forEach(tag => vocabSet.add(`tag:${tag.toLowerCase().trim()}`));
  });
  return Array.from(vocabSet).sort();
}

/**
 * 2. Convert a food item into a feature vector based on vocabulary
 */
function vectorizeFoodItem(item, vocabulary) {
  const itemFeatures = new Set();
  if (item.category) itemFeatures.add(`cat:${item.category.toLowerCase()}`);
  if (item.spiceLevel) itemFeatures.add(`spice:${item.spiceLevel.toLowerCase()}`);
  if (item.isVeg !== undefined) itemFeatures.add(item.isVeg ? 'diet:veg' : 'diet:nonveg');
  (item.tags || []).forEach(tag => itemFeatures.add(`tag:${tag.toLowerCase().trim()}`));

  return vocabulary.map(word => (itemFeatures.has(word) ? 1 : 0));
}

/**
 * 3. Exact Mathematical Cosine Similarity
 * CosineSimilarity(A, B) = (A • B) / (||A|| * ||B||)
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
 * Get All Canteens
 */
async function getAllCanteens() {
  return CANTEENS.map(c => ({
    ...c,
    activeQueue: c.id === 'main-campus' ? 14 : 6,
    estimatedWait: c.id === 'main-campus' ? 12 : 7,
  }));
}

/**
 * Get Canteen By ID
 */
async function getCanteenById(canteenId) {
  const canteen = CANTEENS.find(c => c.id === canteenId);
  if (!canteen) return null;
  return {
    ...canteen,
    activeQueue: canteen.id === 'main-campus' ? 14 : 6,
    estimatedWait: canteen.id === 'main-campus' ? 12 : 7,
  };
}

/**
 * Get Menu Items (optionally filtered by canteenId, category, isVeg, search)
 */
async function getMenuItems({ canteenId, category, isVeg, search } = {}) {
  let items = [...FOOD_ITEMS];

  if (canteenId) {
    items = items.filter(i => i.canteenId === canteenId);
  }

  if (category && category !== 'All') {
    items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }

  if (isVeg !== undefined) {
    const isVegBool = String(isVeg) === 'true';
    items = items.filter(i => i.isVeg === isVegBool);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase();
    items = items.filter(i => 
      i.name.toLowerCase().includes(q) ||
      (i.description && i.description.toLowerCase().includes(q)) ||
      (i.tags && i.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  return items;
}

/**
 * Get Single Food Item By ID
 */
async function getFoodItemById(itemId) {
  return FOOD_ITEMS.find(i => i.id === itemId) || null;
}

/**
 * ML Content-Based Food Recommender using Cosine Similarity
 */
async function getFoodRecommendations(itemId, topK = 4, targetCanteenId = null) {
  const targetItem = FOOD_ITEMS.find(i => i.id === itemId);
  if (!targetItem) {
    throw new Error(`Food item with ID '${itemId}' not found.`);
  }

  const vocabulary = buildFoodVocabulary(FOOD_ITEMS);
  const targetVector = vectorizeFoodItem(targetItem, vocabulary);
  const targetTagSet = new Set((targetItem.tags || []).map(t => t.toLowerCase()));

  // Pool of candidate items (prioritize same canteen if specified, or all items)
  const candidatePool = targetCanteenId
    ? FOOD_ITEMS.filter(i => i.canteenId === targetCanteenId)
    : FOOD_ITEMS;

  const scoredItems = [];

  for (const candidate of candidatePool) {
    if (candidate.id === targetItem.id) continue;

    const candidateVector = vectorizeFoodItem(candidate, vocabulary);
    const similarity = calculateCosineSimilarity(targetVector, candidateVector);

    const matchingTags = (candidate.tags || []).filter(t => targetTagSet.has(t.toLowerCase()));

    scoredItems.push({
      ...candidate,
      similarityScore: parseFloat(similarity.toFixed(4)),
      similarityPercentage: Math.round(similarity * 100),
      matchingTags,
      matchQuality: similarity >= 0.75 ? 'High Match' : similarity >= 0.5 ? 'Good Match' : 'Related',
    });
  }

  // Sort by Cosine Similarity descending, then by popularity
  scoredItems.sort((a, b) => b.similarityScore - a.similarityScore || (b.popularity || 0) - (a.popularity || 0));

  const recommendations = scoredItems.slice(0, Math.min(topK, scoredItems.length));

  return {
    targetItem,
    vocabularyLength: vocabulary.length,
    recommendations,
  };
}

module.exports = {
  CANTEENS,
  FOOD_ITEMS,
  buildFoodVocabulary,
  vectorizeFoodItem,
  calculateCosineSimilarity,
  getAllCanteens,
  getCanteenById,
  getMenuItems,
  getFoodItemById,
  getFoodRecommendations,
  // Backward compatibility aliases
  getAllServices: getAllCanteens,
  getServiceById: getCanteenById,
  getSimilarServices: (id, topK) => getFoodRecommendations(id, topK),
};
