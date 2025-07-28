"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../styles/theme';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${theme.colors.border.light};
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all ${theme.transitions.normal};

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 1rem;
  }
`;

const NavBrand = styled(Link)`
  font-size: 1.75rem;
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.text.primary};
  text-decoration: none;
  background: ${theme.colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: 1.5rem;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: ${theme.colors.text.primary};
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.background.secondary};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 1001;
  display: none;

  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

const MobileMenuContent = styled(motion.div)`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 280px;
  background: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: ${theme.shadows.xl};
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  padding: 0.5rem 1rem;
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};
  position: relative;

  &:hover {
    color: ${theme.colors.primary[600]};
    background: ${theme.colors.background.secondary};
  }

  &.active {
    color: ${theme.colors.primary[600]};
    background: ${theme.colors.primary[50]};
  }
`;

const MobileNavLink = styled(Link)`
  color: ${theme.colors.text.primary};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  padding: 1rem;
  border-radius: ${theme.borderRadius.md};
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;

  &:hover {
    color: ${theme.colors.primary[600]};
    background: ${theme.colors.background.secondary};
    transform: translateX(8px);
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: ${theme.borderRadius.md};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.medium};
  transition: all ${theme.transitions.fast};

  &:hover {
    background: ${theme.colors.background.secondary};
    color: ${theme.colors.text.primary};
  }
`;

const LogoutButton = styled.button`
  background: ${theme.colors.error.gradient};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${theme.borderRadius.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const Navbar2: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { href: '/', label: 'Home', icon: <User size={20} /> },
    { href: '/questionnaire', label: 'Questionnaire', icon: <Settings size={20} /> },
    ...(user?.role === 'admin' ? [{ href: '/admin-dashboard', label: 'Admin Dashboard', icon: <Settings size={20} /> }] : []),
  ];

  return (
    <>
      <NavbarContainer>
        <NavBrand href="/">Formulytic</NavBrand>
        
        <DesktopNav>
          <NavLinks>
            {menuItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </NavLinks>
          
          {user ? (
            <UserMenu>
              <LogoutButton onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </LogoutButton>
            </UserMenu>
          ) : (
            <NavLinks>
              <NavLink href="/signin">Sign In</NavLink>
              <NavLink href="/signup">Sign Up</NavLink>
            </NavLinks>
          )}
        </DesktopNav>

        <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </MobileMenuButton>
      </NavbarContainer>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenu
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
          >
            <MobileMenuContent
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              <MobileMenuHeader>
                <NavBrand href="/" onClick={closeMobileMenu}>Formulytic</NavBrand>
                <button
                  onClick={closeMobileMenu}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    color: theme.colors.text.primary,
                  }}
                >
                  <X size={24} />
                </button>
              </MobileMenuHeader>

              {menuItems.map((item) => (
                <MobileNavLink key={item.href} href={item.href} onClick={closeMobileMenu}>
                  {item.icon}
                  {item.label}
                </MobileNavLink>
              ))}

              {user ? (
                <LogoutButton onClick={handleLogout} style={{ marginTop: 'auto' }}>
                  <LogOut size={18} />
                  Logout
                </LogoutButton>
              ) : (
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <MobileNavLink href="/signin" onClick={closeMobileMenu}>
                    <User size={20} />
                    Sign In
                  </MobileNavLink>
                  <MobileNavLink href="/signup" onClick={closeMobileMenu}>
                    <Settings size={20} />
                    Sign Up
                  </MobileNavLink>
                </div>
              )}
            </MobileMenuContent>
          </MobileMenu>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar2;
