const validateProductId = (productId) => {
  if (!productId || typeof productId !== 'string') {
    throw new Error('Invalid product ID');
  }
  return true;
};

const validateUserId = (userId) => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }
  return true;
};

module.exports = {
  validateProductId,
  validateUserId
};