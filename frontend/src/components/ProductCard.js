import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CardContainer = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.5s ease-in-out;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ProductTitle = styled.h3`
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ProductCard = ({ product, onView }) => {
  return (
    <CardContainer onClick={() => onView(product.id)}>
      <ProductTitle>{product.name}</ProductTitle>
      <ProductPrice>Price: ${product.price}</ProductPrice>
      <ProductDescription>{product.description}</ProductDescription>
    </CardContainer>
  );
};

export default ProductCard;