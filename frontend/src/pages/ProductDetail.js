import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getProductById, addRecentlyViewed } from '../services/productService';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { productId } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = await user.getIdToken();
        const productData = await getProductById(productId, token);
        setProduct(productData);
        
        await addRecentlyViewed(user.uid, productId, token);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [user, productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="product-detail">
    <h5>{product.category}</h5>
    {product.imageUrl && (
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        className="product-image" 
      />
    )}
      <h2>{product.name}</h2>
      <p>Price: ${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
};

export default ProductDetail;