"use client";

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

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

const Navbar2 = () => {
  return (
    <NavbarContainer>
      <NavBrand href="/">Formulytic</NavBrand>
      <NavLinks>
        <NavLinkItem><NavLinkA href="/signin">Sign In</NavLinkA></NavLinkItem>
        <NavLinkItem><NavLinkA href="/signup">Sign Up</NavLinkA></NavLinkItem>
        <NavLinkItem><NavLinkA href="/admin-signup">Admin</NavLinkA></NavLinkItem>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar2;
