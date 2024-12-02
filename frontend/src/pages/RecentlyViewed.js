import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getRecentlyViewed } from '../services/productService';
import { AuthContext } from '../context/AuthContext';

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
    return <div>Loading...</div>;
  }

  if (recentProducts.length === 0) {
    return (
      <div className="recently-viewed-empty">
        <p>No recently viewed products</p>
        <p>Start exploring products to see your viewing history!</p>
      </div>
    );
  }

  return (
    <div className="recently-viewed">
      <h2>Recently Viewed Products</h2>
      <div className="recently-viewed-carousel">
        {recentProducts.map(product => (
          <div key={product.id} className="recently-viewed-item">
            <Link to={`/products/${product.productId}`}>
              <div className="recently-viewed-card">
                <h3>{product.name}</h3>
                <h5>{product.id}</h5>
                <p>Viewed: {product.viewCount} times</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;