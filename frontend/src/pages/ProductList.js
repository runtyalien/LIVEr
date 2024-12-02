import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { AuthContext } from '../context/AuthContext';

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
    <div className="product-list">
      <h2>Our Products</h2>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <Link to={`/products/${product.id}`}>
              {product.imageUrl && (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="product-thumbnail" 
                />
              )}
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>{product.category}</p>
              <p>{product.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;