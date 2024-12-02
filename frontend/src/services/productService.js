import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/v1';

export const getProducts = async (token) => {
  const response = await axios.get(`${API_URL}/users/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getRecentlyViewed = async (userId, token) => {
  const response = await axios.get(`${API_URL}/users/${userId}/recentlyViewed`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  console.log(response.data);
  return response.data;
};

export const addRecentlyViewed = async (userId, productId, token) => {
  const response = await axios.post(
    `${API_URL}/users/${userId}/recentlyViewed`, 
    { productId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const getProductById = async (productId, token) => {
    const response = await axios.get(`${API_URL}/users/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data;
  };