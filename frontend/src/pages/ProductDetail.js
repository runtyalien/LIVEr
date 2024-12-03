import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getProductById, addRecentlyViewed } from '../services/productService';
import styled from 'styled-components';

const ProductDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProductImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const ProductTitle = styled.h2`
  color: #333;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  color: #666;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  color: #555;
  font-size: 1rem;
  line-height: 1.6;
  text-align: justify;
`;

const ProductCategory = styled.h5`
  color: #888;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

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
    <ProductDetailContainer>
      {product.imageUrl && (
        <ProductImage src={product.imageUrl} alt={product.name} />
      )}
      <ProductCategory>{product.category}</ProductCategory>
      <ProductTitle>{product.name}</ProductTitle>
      <ProductPrice>Price: ${product.price}</ProductPrice>
      <ProductDescription>{product.description}</ProductDescription>
    </ProductDetailContainer>
  );
};

export default ProductDetail;