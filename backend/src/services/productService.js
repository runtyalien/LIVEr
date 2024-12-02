const { db } = require('../config/firebase');

async function fetchAllProducts() {
  const snapshot = await db.collection('products').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function fetchProductById(productId) {
  const productDoc = await db.collection('products').doc(productId).get();
  if (!productDoc.exists) throw new Error('Product not found');
  return { id: productDoc.id, ...productDoc.data() };
}

module.exports = {
  fetchAllProducts,
  fetchProductById,
};