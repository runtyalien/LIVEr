const functions = require('firebase-functions');
const admin = require('firebase-admin');
const emailService = require('../services/email');
const logger = require('../utils/logger');

exports.onProductView = functions.firestore
  .document('users/{userId}/recentlyViewed/{viewId}')
  .onCreate(async (snap, context) => {
    try {
      const { userId } = context.params;
      const viewData = snap.data();

      const viewsRef = admin.firestore()
        .collection('users')
        .doc(userId)
        .collection('recentlyViewed');

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const recentViews = await viewsRef
        .where('productId', '==', viewData.productId)
        .where('timestamp', '>', yesterday)
        .get();

      if (recentViews.size > 2) {
        const userDoc = await admin.firestore()
          .collection('users')
          .doc(userId)
          .get();

        const userData = userDoc.data();

        const productDoc = await admin.firestore()
          .collection('products')
          .doc(viewData.productId)
          .get();

        const productData = productDoc.data();

        await emailService.sendNotification(userId, viewData.productId, recentViews.size);

        logger.info('Product view notification sent', {
          userId,
          productId: viewData.productId,
          viewCount: recentViews.size
        });
      }
    } catch (error) {
      logger.error('Error in product view trigger:', error);
      throw new Error('Failed to process product view');
    }
  });