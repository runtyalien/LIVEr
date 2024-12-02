const { db } = require('../config/firebase');
const { sendNotification } = require('../services/email');

const productViewController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    const recentlyViewedRef = db
      .collection('users')
      .doc(userId)
      .collection('recentlyViewed');

    const doc = await recentlyViewedRef
      .where('productId', '==', productId)
      .get();

    if (!doc.empty) {
      const viewCount = doc.data().viewCount + 1;
      if (viewCount > 2) {
        await sendNotification(userId, productId, viewCount);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { productViewController };