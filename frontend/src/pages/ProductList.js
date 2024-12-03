import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { AuthContext } from '../context/AuthContext';
import styled from 'styled-components';

const ProductListContainer = styled.div`
  padding: 2rem;
  background-color: #f8f8f8;
`;

const ProductListTitle = styled.h2`
  color: #333;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
`;

const ProductCard = styled(Link)`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const ProductThumbnail = styled.div`
  width: 100%;
  height: 200px;
  background-image: ${props => props.imageUrl ? `url(${props.imageUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  color: #555;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ProductCategory = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
`;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await user.getIdToken();
        const data = await getProducts(token);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <ProductListContainer>
      <ProductListTitle>Our Products</ProductListTitle>
      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product.id} to={`/products/${product.id}`}>
            <ProductThumbnail imageUrl={product.imageUrl} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>Price: ${product.price}</ProductPrice>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductDescription>{product.description}</ProductDescription>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </ProductListContainer>
  );
};

export default ProductList;