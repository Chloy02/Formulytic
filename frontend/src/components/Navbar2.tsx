"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 15px 15px;
  }
`;

const NavBrand = styled(Link)`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-decoration: none;

  &:hover {
    color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 600px) {
    display: none;
  }
`;

const NavLinkItem = styled.li`
  margin-left: 30px;

  @media (max-width: 768px) {
    margin-left: 15px;
  }
`;

const NavLinkA = styled(Link)`
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: #333;
  font-weight: 500;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const Username = styled.span`
  color: #007bff;
  font-weight: 600;
  
  @media (max-width: 600px) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #c82333;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
`;

const Navbar2 = () => {
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <NavbarContainer>
      <NavBrand href="/">Formulytic</NavBrand>
      <NavLinks>
        {isLoggedIn && user ? (
          <NavLinkItem>
            <UserInfo>
              <Username>Welcome, {user.username}</Username>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </UserInfo>
          </NavLinkItem>
        ) : (
          <>
            <NavLinkItem><NavLinkA href="/signin">Sign In</NavLinkA></NavLinkItem>
            <NavLinkItem><NavLinkA href="/signup">Sign Up</NavLinkA></NavLinkItem>
            <NavLinkItem><NavLinkA href="/admin-signup">Admin</NavLinkA></NavLinkItem>
          </>
        )}
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar2;
