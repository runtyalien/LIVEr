const { db, admin } = require('../config/firebase');

async function getRecentlyViewedProducts(userId) {
  const snapshot = await db.collection('users').doc(userId).collection('recentlyViewed')
    .orderBy('timestamp', 'desc').limit(10).get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

async function recordRecentlyViewedProduct(userId, productId) {

  const productDoc = await db.collection('products').doc(productId).get();
  if (!productDoc.exists) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const productData = productDoc.data();
  const productName = productData.name;

  const userRef = db.collection('users').doc(userId);
  const recentlyViewedRef = userRef.collection('recentlyViewed');

  return db.runTransaction(async transaction => {
    const existingViewQuery = recentlyViewedRef.where('productId', '==', productId);
    const existingViewSnapshot = await transaction.get(existingViewQuery);

    if (!existingViewSnapshot.empty) {
      const existingDocId = existingViewSnapshot.docs[0].id;
      transaction.update(recentlyViewedRef.doc(existingDocId), {
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        viewCount: admin.firestore.FieldValue.increment(1),
      });
    } else {
      const allViewedSnapshot = await transaction.get(
        recentlyViewedRef.orderBy('timestamp', 'desc'),
      );

      if (allViewedSnapshot.size >= 10) {
        const oldestDocId = allViewedSnapshot.docs[allViewedSnapshot.size - 1].id;
        transaction.delete(recentlyViewedRef.doc(oldestDocId));
      }

      transaction.set(recentlyViewedRef.doc(), {
        productId,
        name: productName,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        viewCount: 1,
      });
    }
  });
}

module.exports = {
  getRecentlyViewedProducts,
  recordRecentlyViewedProduct,
};