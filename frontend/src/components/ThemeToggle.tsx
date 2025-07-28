"use client";

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ToggleContainer = styled.button`
  position: relative;
  width: 56px;
  height: 28px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  padding: 2px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #cbd5e1;
  }

  .dark & {
    background: #334155;
    
    &:hover {
      background: #475569;
    }
  }
`;

const ToggleSlider = styled(motion.div)`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .dark & {
    background: #1e293b;
  }
`;

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleContainer onClick={toggleTheme}>
      <ToggleSlider
        animate={{ x: theme === 'dark' ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {theme === 'light' ? (
          <Sun size={14} color="#f59e0b" />
        ) : (
          <Moon size={14} color="#60a5fa" />
        )}
      </ToggleSlider>
    </ToggleContainer>
  );
};

export default ThemeToggle;
