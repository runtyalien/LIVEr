const { db, admin } = require('../src/config/firebase');

const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

const generateRandomProduct = (index) => ({
  name: `Product ${index}`,
  description: `This is a detailed description for product ${index}`,
  price: Math.floor(Math.random() * 1000) + 1,
  category: categories[Math.floor(Math.random() * categories.length)],
  imageUrl: `https://picsum.photos/200/300?random=${index}`,
  createdAt: admin.firestore.FieldValue.serverTimestamp()
});

const seedProducts = async () => {
  try {
    const batch = db.batch();
    
    for (let i = 1; i <= 50; i++) {
      const productRef = db.collection('products').doc();
      batch.set(productRef, generateRandomProduct(i));
    }

    await batch.commit();
    console.log('Successfully seeded 50 products');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

seedProducts();