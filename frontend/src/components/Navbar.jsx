// src/components/Navbar.jsx
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Import Link for navigation

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  position: sticky; /* Makes navbar stick to the top when scrolling */
  top: 0;
  z-index: 1000; /* Ensures navbar stays on top of other content */

  @media (max-width: 768px) {
    padding: 15px 15px;
  }
`;

const NavBrand = styled(Link)` /* Make the logo a clickable link to home */
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-decoration: none; /* Remove underline */

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
    display: none; /* Hide regular nav links on very small screens, or implement a mobile menu */
  }
`;

const NavLinkItem = styled.li`
  margin-left: 30px;

  @media (max-width: 768px) {
    margin-left: 15px;
  }
`;

const NavLinkA = styled(Link)` /* Styled Link for consistency */
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const AuthButtonBase = styled(Link)` /* Base style for auth buttons, using Link */
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none; /* Remove underline */
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 14px;
  }
`;

const SignInButton = styled(AuthButtonBase)`
  background-color: transparent;
  color: #007bff;
  border: 1px solid #007bff;

  &:hover {
    background-color: #e6f0ff;
  }
`;

const SignUpButton = styled(AuthButtonBase)`
  background-color: #007bff;
  color: #fff;

  &:hover {
    background-color: #0056b3;
  }
`;


const Navbar = () => {
  return (
    <NavbarContainer>
      <NavBrand to="/">Logo</NavBrand> {/* Link to the landing page */}
      <NavLinks>
        <NavLinkItem><NavLinkA to="/">Questionnaire</NavLinkA></NavLinkItem> {/* Link to home, which is your questionnaire section for now */}
      </NavLinks>
      <AuthButtons>
        <SignInButton to="/signin">Sign In</SignInButton> {/* Link to Sign In page */}
        <SignUpButton to="/signup">Sign Up</SignUpButton> {/* Link to Sign Up page */}
      </AuthButtons>
    </NavbarContainer>
  );
};

export default Navbar;