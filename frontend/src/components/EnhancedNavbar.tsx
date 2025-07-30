"use client";

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { theme } from '@/styles/theme';
import { User, Menu, X, LogOut, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';

const NavbarContainer = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  .dark & {
    background: rgba(15, 23, 42, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const NavBrand = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary[600]};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;

  &:hover {
    color: ${theme.colors.primary[700]};
    transform: scale(1.05) rotate(1deg);
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background: ${theme.colors.primary.gradient};
    transition: width 0.3s ease;
    border-radius: ${theme.borderRadius.full};
  }

  &:hover::after {
    width: 100%;
  }

  .dark & {
    color: ${theme.colors.primary[400]};
    
    &:hover {
      color: ${theme.colors.primary[300]};
    }
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const BrandIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${theme.colors.primary.gradient};
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.sm};
  position: relative;
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transform: rotate(45deg);
    transition: all 0.6s ease;
    opacity: 0;
  }

  &:hover::before {
    animation: shimmer 0.6s ease-in-out;
    opacity: 1;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
    100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  }
`;

const DesktopNavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLinkItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.base};
  transition: all 0.2s ease;
  position: relative;
  padding: ${theme.spacing.sm} 0;

  &:hover {
    color: ${theme.colors.primary[600]};
  }

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background: linear-gradient(90deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]});
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #0f172a;
  font-weight: 500;

  .dark & {
    color: #f1f5f9;
  }

  @media (max-width: 640px) {
    display: none;
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.primary[600]} 100%);
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.md};
  }
`;

const LogoutButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${theme.colors.text.secondary};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-size: ${theme.typography.fontSize.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.error[50]};
    color: ${theme.colors.error[600]};
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: ${theme.spacing.xs};
    
    span {
      display: none;
    }
  }
`;

const AuthButtonsWrapper = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
`;

const SignInButton = styled(motion(Link))`
  padding: ${theme.spacing.sm} ${theme.spacing.base};
  border-radius: ${theme.borderRadius.md};
  background: transparent;
  border: 1px solid ${theme.colors.primary[300]};
  color: ${theme.colors.primary[600]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    background: ${theme.colors.primary[600]};
    color: white;
    border-color: ${theme.colors.primary[600]};
  }
`;

const SignUpButton = styled(motion(Link))`
  padding: ${theme.spacing.sm} ${theme.spacing.base};
  border-radius: ${theme.borderRadius.md};
  background: ${theme.colors.primary[600]};
  color: white;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const AdminButton = styled(motion(Link))`
  padding: ${theme.spacing.sm} ${theme.spacing.base};
  border-radius: ${theme.borderRadius.md};
  background: transparent;
  border: 1px solid ${theme.colors.secondary[400]};
  color: ${theme.colors.secondary[600]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    background: ${theme.colors.secondary[600]};
    color: white;
    border-color: ${theme.colors.secondary[600]};
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.text.primary};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.colors.secondary[100]};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.colors.border.light};
  box-shadow: ${theme.shadows.lg};
  padding: ${theme.spacing.base};
`;

const MobileNavLinks = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const MobileNavLink = styled(Link)`
  text-decoration: none;
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
  padding: ${theme.spacing.base};
  border-radius: ${theme.borderRadius.md};
  transition: all 0.2s ease;
  display: block;

  &:hover {
    background-color: ${theme.colors.primary[50]};
    color: ${theme.colors.primary[600]};
  }
`;

const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const { t } = useTranslation(); // Translation hook
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const getUserInitials = (email: string) => {
    // For email, we'll take the first character of the email
    return email.charAt(0).toUpperCase();
  };

  return (
    <NavbarContainer
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavBrand href="/">
        <BrandIcon>F</BrandIcon>
        Formulytic
      </NavBrand>

      {/* <DesktopNavLinks>
        {isLoggedIn ? (
          <>
            <NavLinkItem>
              <NavLink href="/questionnaire">Questionnaires</NavLink>
            </NavLinkItem>
            {user?.role === 'admin' && (
              <NavLinkItem>
                <NavLink href="/admin-dashboard">Dashboard</NavLink>
              </NavLinkItem>
            )}
          </>
        ) : (
          <>
            <NavLinkItem>
              <NavLink href="/signin">Sign In</NavLink>
            </NavLinkItem>
            <NavLinkItem>
              <NavLink href="/signup">Sign Up</NavLink>
            </NavLinkItem>
            <NavLinkItem>
              <NavLink href="/admin-login">Admin Login</NavLink>
            </NavLinkItem>
          </>
        )}
      </DesktopNavLinks> */}

      <UserSection>
        <LanguageToggle />
        <ThemeToggle />
        {isLoggedIn && user ? (
          <>
            <UserInfo>
              <span>Welcome, {user.email}</span>
              <UserAvatar>
                {getUserInitials(user.email)}
              </UserAvatar>
            </UserInfo>
            <LogoutButton
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </LogoutButton>
          </>
        ) : (
          <AuthButtonsWrapper>
            <SignInButton 
              href="/signin"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </SignInButton>
            <SignUpButton 
              href="/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </SignUpButton>
            <AdminButton 
              href="/admin-login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Admin
            </AdminButton>
          </AuthButtonsWrapper>
        )}

        <MobileMenuButton
          onClick={toggleMobileMenu}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </MobileMenuButton>
      </UserSection>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <MobileNavLinks>
              {isLoggedIn ? (
                <>
                  <li>
                    <MobileNavLink href="/questionnaire" onClick={() => setIsMobileMenuOpen(false)}>
                      Questionnaires
                    </MobileNavLink>
                  </li>
                  {user?.role === 'admin' && (
                    <li>
                      <MobileNavLink href="/admin-dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        Dashboard
                      </MobileNavLink>
                    </li>
                  )}
                  <li>
                    <MobileNavLink href="#" onClick={handleLogout}>
                      Logout
                    </MobileNavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <MobileNavLink href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </MobileNavLink>
                  </li>
                  <li>
                    <MobileNavLink href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </MobileNavLink>
                  </li>
                  <li>
                    <MobileNavLink href="/admin-login" onClick={() => setIsMobileMenuOpen(false)}>
                      Admin Login
                    </MobileNavLink>
                  </li>
                </>
              )}
            </MobileNavLinks>
          </MobileMenu>
        )}
      </AnimatePresence>
    </NavbarContainer>
  );
};

export default Navbar;
