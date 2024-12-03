import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getRecentlyViewed } from '../services/productService';
import { AuthContext } from '../context/AuthContext';
import styled from 'styled-components';

const RecentlyViewedContainer = styled.div`
  padding: 2rem;
  background-color: #f8f8f8;
  max-width: 1200px;
  margin: 0 auto;
`;

const RecentlyViewedTitle = styled.h2`
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ProductName = styled.h3`
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductId = styled.h5`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ViewCount = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin: 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 2rem auto;
  max-width: 600px;

  p {
    color: #666;
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }
`;

const LoadingState = styled(EmptyState)`
  padding: 2rem;
`;

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const token = await user.getIdToken();
        const data = await getRecentlyViewed(user.uid, token);
        setRecentProducts(data);
      } catch (error) {
        console.error('Failed to fetch recent products', error);
        setRecentProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, [user]);

  if (loading) {
    return (
      <RecentlyViewedContainer>
        <LoadingState>Loading...</LoadingState>
      </RecentlyViewedContainer>
    );
  }

  if (recentProducts.length === 0) {
    return (
      <RecentlyViewedContainer>
        <EmptyState>
          <p>No recently viewed products</p>
          <p>Start exploring products to see your viewing history!</p>
        </EmptyState>
      </RecentlyViewedContainer>
    );
  }

  return (
    <RecentlyViewedContainer>
      <RecentlyViewedTitle>Recently Viewed Products</RecentlyViewedTitle>
      <ProductGrid>
        {recentProducts.map(product => (
          <ProductCard key={product.id} to={`/products/${product.productId}`}>
            <ProductName>{product.name}</ProductName>
            <ProductId>{product.id}</ProductId>
            <ViewCount>Viewed: {product.viewCount} times</ViewCount>
          </ProductCard>
        ))}
      </ProductGrid>
    </RecentlyViewedContainer>
  );
};

export default RecentlyViewed;