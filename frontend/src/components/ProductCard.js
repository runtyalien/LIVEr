import React from 'react';

const ProductCard = ({ product, onView }) => {
  return (
    <div className="product-card" onClick={() => onView(product.id)}>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductCard;