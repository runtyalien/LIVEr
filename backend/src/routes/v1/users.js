const express = require('express');
const router = express.Router();
const { db, admin } = require('../../config/firebase');
const { getAsync, setAsync, client } = require('../../config/redis');
const { authenticateUser } = require('../../middleware/auth');

router.get('/products', authenticateUser, async (req, res) => {
  try {
    const cachedProducts = await getAsync('all_products');
    
    if (cachedProducts) {
      return res.json(JSON.parse(cachedProducts));
    }

    const snapshot = await db.collection('products').get();
    
    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    await setAsync(
      'all_products',
      JSON.stringify(products),
      'EX',
      300
    );

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/products/:productId', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;
    console.log('Requested Product ID:', productId);
    
    console.log('Attempting to fetch product from Firestore');
    
    const productDoc = await db.collection('products').doc(productId).get();
    
    console.log('Product Document Exists:', productDoc.exists);
    console.log('Product Document Data:', productDoc.data());
    
    if (!productDoc.exists) {
      console.log('Product not found for ID:', productId);
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const productData = {
      id: productDoc.id,
      ...productDoc.data()
    };
    
    console.log('Returning Product Data:', productData);
    
    res.json(productData);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId/recentlyViewed', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const cachedData = await getAsync(`recentlyViewed:${userId}`);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const recentlyViewedSnapshot = await db
      .collection('users')
      .doc(userId)
      .collection('recentlyViewed')
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const uniqueProducts = new Map();
    
    for (const doc of recentlyViewedSnapshot.docs) {
      const recentViewData = doc.data();
      
      if (!uniqueProducts.has(recentViewData.productId)) {
        try {
          const productDoc = await db.collection('products').doc(recentViewData.productId).get();
          
          if (productDoc.exists) {
            const productData = productDoc.data();
            
            uniqueProducts.set(recentViewData.productId, {
              id: doc.id,
              productId: recentViewData.productId,
              name: productData.name || '',
              timestamp: recentViewData.timestamp,
              viewCount: recentViewData.viewCount
            });
          }
        } catch (productFetchError) {
          console.error(`Error fetching product ${recentViewData.productId}:`, productFetchError);
        }
      }
    }

    const products = Array.from(uniqueProducts.values())
      .sort((a, b) => b.timestamp._seconds - a.timestamp._seconds);

    await setAsync(
      `recentlyViewed:${userId}`,
      JSON.stringify(products),
      'EX',
      300
    );

    res.json(products);
  } catch (error) {
    console.error('Error fetching recently viewed products:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/:userId/recentlyViewed', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    const productDoc = await db.collection('products').doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productData = productDoc.data();
    const name = productData.name;

    await db.runTransaction(async (transaction) => {
      const userRef = db.collection('users').doc(userId);
      const recentlyViewedRef = userRef.collection('recentlyViewed');

      const existingViewQuery = recentlyViewedRef.where('productId', '==', productId);
      const existingViewSnapshot = await transaction.get(existingViewQuery);

      if (!existingViewSnapshot.empty) {
        const existingDocId = existingViewSnapshot.docs[0].id;
        transaction.update(recentlyViewedRef.doc(existingDocId), {
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          viewCount: admin.firestore.FieldValue.increment(1)
        });
      } else {
        const allViewedSnapshot = await transaction.get(
          recentlyViewedRef.orderBy('timestamp', 'desc')
        );

        if (allViewedSnapshot.size >= 10) {
          const oldestDocId = allViewedSnapshot.docs[allViewedSnapshot.size - 1].id;
          transaction.delete(recentlyViewedRef.doc(oldestDocId));
        }

        if(process.env.NODE_ENV == "development"){
          transaction.add(recentlyViewedRef, {
            productId,
            name,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            viewCount: 1
          });
        } else {
          transaction.set(recentlyViewedRef.doc(), {
            productId,
            name,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            viewCount: 1
          });
        }
      }
    });

    await client.del(`recentlyViewed:${userId}`);

    res.status(200).json({ 
      message: 'Product view recorded',
      productId,
      userId
    });

  } catch (error) {
    console.error('Error recording product view:', error);
    res.status(500).json({ 
      error: 'Failed to record product view', 
      details: error.message 
    });
  }
});

module.exports = router;