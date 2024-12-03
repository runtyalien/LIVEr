import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { logout } from '../services/authService';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 1rem;
`;

const NavBrand = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #fff;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
`;

const NavLink = styled(Link)`
  margin-left: 1rem;
  font-size: 1rem;
  text-decoration: none;
  color: #fff;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444;
  }
`;

const LogoutButton = styled.button`
  margin-left: 1rem;
  font-size: 1rem;
  text-decoration: none;
  color: #fff;
  background-color: #e74c3c;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;
  font-family: inherit;

  &:hover {
    background-color: #c0392b;
  }
`;

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
    <NavbarContainer>
      <NavBrand to="/products">Product App</NavBrand>
      {user && (
        <NavLinks>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/recently-viewed">Recently Viewed</NavLink>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </NavLinks>
      )}
    </NavbarContainer>
  );
};

export default Navbar;