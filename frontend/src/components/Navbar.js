import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/authService';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      history.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/products">Product App</Link>
      </div>
      {user && (
        <div className="nav-links">
          <Link to="/products">Products</Link>
          <Link to="/recently-viewed">Recently Viewed</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;