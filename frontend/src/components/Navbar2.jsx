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








const Navbar2 = () => {
  return (
    <NavbarContainer>
      <NavBrand to="/">Logo</NavBrand> {/* Link to the landing page */}
      <NavLinks>
        <NavLinkItem><NavLinkA to="/AdminDashboard">Questionnaire</NavLinkA></NavLinkItem> {/* Link to home, which is your questionnaire section for now */}
      </NavLinks>

    </NavbarContainer>
  );
};

export default Navbar2;