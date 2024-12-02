const { getAsync, setAsync } = require('../config/redis');
const { fetchAllProducts, fetchProductById } = require('../services/productService');

async function getAllProducts(req, res) {
  try {
    const cachedProducts = await getAsync('all_products');
    if (cachedProducts) return res.json(JSON.parse(cachedProducts));

    const products = await fetchAllProducts();
    await setAsync('all_products', JSON.stringify(products), 'EX', 300);

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

async function getProductById(req, res) {
  try {
    const { productId } = req.params;
    const product = await fetchProductById(productId);

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
};