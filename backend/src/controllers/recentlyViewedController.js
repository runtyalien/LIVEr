const { getAsync, setAsync, client } = require('../config/redis');
const {
  getRecentlyViewedProducts,
  recordRecentlyViewedProduct,
} = require('../services/recentlyViewedService');

async function getRecentlyViewed(req, res) {
  try {
    const { userId } = req.params;
    const cachedData = await getAsync(`recentlyViewed:${userId}`);
    if (cachedData){
      console.log(`fetching from redis...`);
      return res.json(JSON.parse(cachedData));
    }

    const products = await getRecentlyViewedProducts(userId);
    await setAsync(`recentlyViewed:${userId}`, JSON.stringify(products), 'EX', 300);

    res.json(products);
  } catch (error) {
    console.error('Error fetching recently viewed products:', error);
    res.status(500).json({ error: error.message });
  }
}

async function recordRecentlyViewed(req, res) {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    await recordRecentlyViewedProduct(userId, productId);

    await client.del(`recentlyViewed:${userId}`);

    res.status(200).json({ message: 'Product view recorded', productId, userId });
  } catch (error) {
    console.error('Error recording product view:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getRecentlyViewed,
  recordRecentlyViewed,
};