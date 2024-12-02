const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../../middleware/auth');
const productController = require('../../controllers/productController');
const recentlyViewedController = require('../../controllers/recentlyViewedController');

router.get('/products', authenticateUser, productController.getAllProducts);
router.get('/products/:productId', authenticateUser, productController.getProductById);
router.get('/:userId/recentlyViewed', authenticateUser, recentlyViewedController.getRecentlyViewed);
router.post('/:userId/recentlyViewed', authenticateUser, recentlyViewedController.recordRecentlyViewed);

module.exports = router;