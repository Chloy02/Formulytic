"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/TranslationContext';
import { useRouter } from 'next/navigation';
import EnhancedNavbar from '../../components/EnhancedNavbar';
import axios from 'axios';
import { FaUser, FaChartLine, FaUsers, FaClipboardCheck, FaCommentDots, FaChild } from 'react-icons/fa';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif;
  
  .dark & {
    background-color: #0f172a;
  }
`;

const PageContainer = styled.div`
  flex: 1;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

// Floating Christ University Logo (top-right)
const FloatingChristLogo = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }

  .dark & {
    background: rgba(30, 41, 59, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    top: 75px;
    right: 15px;
    padding: 6px;
  }

  @media (max-width: 480px) {
    top: 70px;
    right: 10px;
    padding: 4px;
  }
`;

// Karnataka Government Logo (top-left)
const FloatingKarnatakaLogo = styled.div`
  position: fixed;
  top: 80px;
  left: 20px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
  }

  .dark & {
    background: rgba(30, 41, 59, 0.95);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    top: 75px;
    left: 15px;
    padding: 6px;
  }

  @media (max-width: 480px) {
    top: 70px;
    left: 10px;
    padding: 4px;
  }
`;

const FloatingLogoImage = styled.img`
  height: 60px;
  width: auto;
  object-fit: contain;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    height: 50px;
  }

  @media (max-width: 480px) {
    height: 45px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  color: #1a202c;
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.2;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.2rem;
  margin-bottom: 20px;
  line-height: 1.6;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const TimeEstimate = styled.div`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #e6f3ff 0%, #cce7ff 100%);
  color: #1e40af;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 25px;
  border: 1px solid #bfdbfe;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 6px 12px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 4px 10px;
    gap: 6px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 16px;
  background-color: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px 0;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #4299e1, #3182ce, #2b6cb0);
  width: ${props => props.progress}%;
  transition: width 0.5s ease;
  position: relative;
  
  &::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const ProgressSteps = styled.div`
  display: flex;
  margin: 15px 0;
  position: relative;
`;

const ProgressStep = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px 4px;
  border-radius: 8px;
  
  &:hover {
    background-color: rgba(66, 153, 225, 0.05);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:not(:last-child)::after {
    position: absolute;
    top: 15px;
    left: 60%;
    right: -40%;
    height: 2px;
    background-color: ${props => props.isCompleted ? '#48bb78' : '#e2e8f0'};
    z-index: 1;
  }
`;

const StepNumber = styled.div<{ isActive: boolean; isCompleted: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => 
    props.isCompleted ? '#48bb78' : 
    props.isActive ? '#3182ce' : '#e2e8f0'
  };
  color: ${props => 
    props.isCompleted || props.isActive ? 'white' : '#a0aec0'
  };
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 0.875rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: ${props => 
    props.isActive ? '0 0 0 4px rgba(66, 153, 225, 0.2)' : 
    props.isCompleted ? '0 0 0 4px rgba(72, 187, 120, 0.2)' : 'none'
  };
  
  ${ProgressStep}:hover & {
    transform: scale(1.1);
    box-shadow: ${props => 
      props.isCompleted ? '0 0 0 4px rgba(72, 187, 120, 0.3)' :
      '0 0 0 4px rgba(66, 153, 225, 0.15)'
    };
  }
`;

const StepLabel = styled.span<{ isActive: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.isActive ? '#3182ce' : '#666'};
  font-weight: ${props => props.isActive ? '600' : '400'};
  margin-top: 8px;
  text-align: center;
  max-width: 80px;
  transition: all 0.2s ease;
  
  ${ProgressStep}:hover & {
    color: #3182ce;
    font-weight: 500;
  }
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    margin: 0 10px;
    border-radius: 8px;
    box-shadow: 0 2px 15px rgba(0,0,0,0.08);
  }

  @media (max-width: 480px) {
    margin: 0 5px;
    border-radius: 6px;
  }
`;

const SectionHeader = styled.div`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-left: 4px solid #667eea;
  color: #2d3748;
  padding: 20px 30px;
  margin-bottom: 0;
  position: relative;
  
  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    opacity: 0.3;
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    border-left-width: 3px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: #2d3748;
  letter-spacing: -0.025em;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SectionContent = styled.div`
  padding: 40px;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 24px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const QuestionCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  position: relative;
  animation: slideInUp 0.5s ease-out;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    transform: translateY(-1px);
    border-color: #e2e8f0;
  }

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    border-color: #4299e1;
  }

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 8px;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h4 {
    position: relative;
    
    &::after {
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #4299e1, #3182ce);
      border-radius: 2px;
      transition: width 0.3s ease;
    }
  }

  &:hover h4::after {
    width: 60px;
  }
`;

const QuestionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 28px;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const FieldSuccess = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #48bb78;
  font-size: 18px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  
  &.show {
    opacity: 1;
  }
`;

const SectionTransition = styled.div`
  opacity: 1;
  transform: translateX(0);
  transition: all 0.4s ease-in-out;
  
  &.fade-enter {
    opacity: 0;
    transform: translateX(20px);
  }
  
  &.fade-exit {
    opacity: 0;
    transform: translateX(-20px);
  }
`;

const LoadingDots = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  span {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #4299e1;
    border-radius: 50%;
    animation: loadingDots 1.4s ease-in-out infinite both;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
  
  @keyframes loadingDots {
    0%, 80%, 100% {
      transform: scale(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: 1px solid #e2e8f0;
  color: #718096;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background-color: #f7fafc;
    border-color: #cbd5e0;
    color: #4a5568;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.1);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
  font-size: 1rem;
  line-height: 1.5;
  letter-spacing: 0.025em;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }
`;

const Input = styled.input<{ isValid?: boolean }>`
  width: 100%;
  padding: 14px 40px 14px 16px;
  border: 2px solid ${props => props.isValid ? '#48bb78' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  transition: all 0.3s ease;
  box-sizing: border-box;
  line-height: 1.5;
  background-color: #ffffff;
  position: relative;

  &::placeholder {
    color: #a0aec0;
    font-weight: 400;
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.isValid ? '#38a169' : '#4299e1'};
    box-shadow: 0 0 0 3px ${props => props.isValid ? 'rgba(72, 187, 120, 0.1)' : 'rgba(66, 153, 225, 0.1)'};
    background-color: #f7fafc;
  }

  &:hover:not(:focus) {
    border-color: ${props => props.isValid ? '#38a169' : '#cbd5e0'};
  }

  @media (max-width: 768px) {
    padding: 12px 36px 12px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
  }

  @media (max-width: 480px) {
    padding: 10px 32px 10px 12px;
    border-radius: 6px;
  }
`;

const Select = styled.select<{ isValid?: boolean }>`
  width: 100%;
  padding: 14px 40px 14px 16px;
  border: 2px solid ${props => props.isValid ? '#48bb78' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  color: #2d3748;
  transition: all 0.3s ease;
  box-sizing: border-box;
  line-height: 1.5;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.isValid ? '#38a169' : '#4299e1'};
    box-shadow: 0 0 0 3px ${props => props.isValid ? 'rgba(72, 187, 120, 0.1)' : 'rgba(66, 153, 225, 0.1)'};
    background-color: #f7fafc;
  }

  &:hover:not(:focus) {
    border-color: ${props => props.isValid ? '#38a169' : '#cbd5e0'};
  }

  @media (max-width: 768px) {
    padding: 12px 36px 12px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
  }

  @media (max-width: 480px) {
    padding: 10px 32px 10px 12px;
    border-radius: 6px;
  }

  option {
    color: #2d3748;
    background-color: white;
    padding: 8px;
  }
`;

const TextArea = styled.textarea<{ isValid?: boolean }>`
  width: 100%;
  padding: 14px 40px 14px 16px;
  border: 2px solid ${props => props.isValid ? '#48bb78' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.6;

  &::placeholder {
    color: #a0aec0;
    font-weight: 400;
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.isValid ? '#38a169' : '#4299e1'};
    box-shadow: 0 0 0 3px ${props => props.isValid ? 'rgba(72, 187, 120, 0.1)' : 'rgba(66, 153, 225, 0.1)'};
    background-color: #f7fafc;
  }

  &:hover:not(:focus) {
    border-color: ${props => props.isValid ? '#38a169' : '#cbd5e0'};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  color: #2d3748;
  font-size: 1rem;
  line-height: 1.5;
  min-height: 48px; /* Touch-friendly target */

  &:hover {
    background-color: #f7fafc;
  }

  &:active {
    background-color: #edf2f7;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const RadioItem = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  color: #2d3748;
  font-size: 1rem;
  line-height: 1.5;
  min-height: 48px; /* Touch-friendly target */

  &:hover {
    background-color: #f7fafc;
  }

  &:active {
    background-color: #edf2f7;
  }

  @media (max-width: 768px) {
    padding: 14px 10px;
    font-size: 0.95rem;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
    font-size: 0.9rem;
    gap: 8px;
    border-radius: 6px;
  }
`;

const Radio = styled.input.attrs({ type: 'radio' })`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
  flex-shrink: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  padding: 20px 30px;
  background-color: #f8f9fa;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 16px 20px;
    gap: 12px;
    flex-direction: column;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    gap: 10px;
    margin-top: 20px;
  }
`;

const FloatingBackButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1001;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 15px 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 140px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  }

  &:active {
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3), 0 6px 25px rgba(102, 126, 234, 0.4);
  }

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(-2px);
  }

  .dark & {
    background: linear-gradient(135deg, #4c51bf 0%, #553c9a 100%);
    box-shadow: 0 4px 20px rgba(76, 81, 191, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #434190 0%, #4c3788 100%);
      box-shadow: 0 6px 25px rgba(76, 81, 191, 0.4);
    }
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    font-size: 0.9rem;
    min-width: 120px;
  }

  @media (max-width: 480px) {
    bottom: 15px;
    right: 15px;
    padding: 10px 16px;
    font-size: 0.85rem;
    min-width: 100px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  min-height: 44px; /* Better touch target */
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #4299e1;
          color: white;
          &:hover {
            background-color: #3182ce;
            transform: translateY(-1px);
          }
        `;
      case 'success':
        return `
          background-color: #48bb78;
          color: white;
          &:hover {
            background-color: #38a169;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background-color: #e2e8f0;
          color: #4a5568;
          &:hover {
            background-color: #cbd5e0;
          }
        `;
    }
  }}

  @media (max-width: 768px) {
    padding: 14px 20px;
    font-size: 0.95rem;
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 12px 16px;
    font-size: 0.9rem;
    border-radius: 6px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fed7d7;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 20px 0;
  font-weight: 500;
`;

const SuccessMessage = styled.div`
  background-color: #c6f6d5;
  color: #2f855a;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 20px 0;
  font-weight: 500;
`;

const NavigationButtons = styled.div`
  display: flex;
  align-items: center;
`;

const StepperContainer = styled.div`
  margin: 32px 0 0 0;
  overflow-x: auto;
  width: 100%;

  @media (max-width: 768px) {
    margin: 20px 0 0 0;
  }
`;

const Stepper = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    gap: 8px;
    overflow-x: auto;
    padding: 0 10px;
    flex-wrap: nowrap;
  }

  @media (max-width: 480px) {
    gap: 6px;
    padding: 0 5px;
  }
`;
const StepButton = styled.button<{ active: boolean }>`
  background: ${({ active }) => (active ? 'linear-gradient(90deg, #667eea, #764ba2)' : '#f3f4f6')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border: none;
  border-radius: 24px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  min-width: 140px;
  box-shadow: ${({ active }) => (active ? '0 4px 16px rgba(102,126,234,0.15)' : 'none')};
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  outline: ${({ active }) => (active ? '2px solid #667eea' : 'none')};
  white-space: nowrap;
  
  &:hover, &:focus {
    background: ${({ active }) => (active ? 'linear-gradient(90deg, #667eea, #764ba2)' : '#e2e8f0')};
    color: #222;
  }

  @media (max-width: 768px) {
    min-width: 120px;
    padding: 10px 20px;
    font-size: 1rem;
    gap: 8px;
  }

  @media (max-width: 480px) {
    min-width: 100px;
    padding: 8px 16px;
    font-size: 0.9rem;
    gap: 6px;
    border-radius: 18px;
  }
`;

const AnimatedProgressFill = styled(ProgressFill)`
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ModernFormContainer = styled(FormContainer)`
  margin-top: 32px;
  padding: 0 0 32px 0;
  @media (max-width: 600px) {
    padding: 0 0 16px 0;
  }
`;

const ModernSectionHeader = styled(SectionHeader)`
  position: sticky;
  top: 0;
  z-index: 2;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 2px 8px rgba(102,126,234,0.08);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ModernSectionTitle = styled(SectionTitle)`
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.25em;
`;

const ModernSectionDesc = styled.div`
  font-size: 1.1rem;
  font-weight: 400;
  margin-top: 4px;
  color: rgba(255,255,255,0.92);
`;

interface FormData {
  section1: {
    respondentName: string;
    district: string;
    age: string;
    gender: string;
    education: string;
    employmentBefore: string;
    occupationBefore: string;
    incomeBefore: string;
    receivedBenefit: string;
    schemes: string[];
    otherBenefits: string;
    dateOfBenefit: string;
    utilization: string[];
    casteCategory: string;
    subCaste: string;
    tribeIdentity: string;
    marriageOpposed: string;
    relocated: string;
    aadhaarProvided: string;
  };
  section2: {
    occupationAfter: string;
    incomeAfter: string;
    socioEconomicStatusBefore: string;
    financialSecurityScale: string;
    spouseEmploymentAfter: string;
    socioEconomicStatusAfter: string;
    socialLifeImpact: string;
    fundDecisionMaker: string;
    financialDependencyReduced: string;
    startedNewLivelihood: string;
  };
  section3: {
    progressiveChangeScale: string;
    feltSociallyAccepted: string;
    discriminationReduction: string;
    feltMoreSecure: string;
    livingWithInLaws: string;
    inLawDiscrimination: string;
    inLawDiscriminationDetails: string;
    filedPoliceComplaint: string;
    supportFromNgosOrOfficials: string;
  };
  section4: {
    schemeAwarenessSource: string;
    officialsSupportive: string;
    applicationDifficulty: string;
    timeToReceiveBenefit: string;
    disbursementEffectiveness: string;
    awareOfSchemeDetails: string;
    applicationStatus: string;
    pendingDuration: string;
    rejectionReasonCommunicated: string;
    rejectionReason: string;
    qualityOfInformation: string;
  };
  section5: {
    schemeSuccessCasteDiscrimination: string;
    schemeSuccessSecurity: string;
    areasForImprovement: string[];
    shouldReviseIncentive: string;
    experiencedBenefits: string[];
    shouldContinueScheme: string;
    encourageIntercasteMarriage: string;
    schemeHelpedReduceDiscriminationInArea: string;
    futureSupportExpected: string[];
  };
  section6_DevadasiChildren: {
    childAgeAtMarriage: string;
    schemeImprovedDignity: string;
    treatmentDifference: string;
    spouseCaste: string;
    ownsPropertyNow: string;
    inLawAcceptabilityScale: string;
    facedStigma: string;
  };
}

const defaultFormData: FormData = {
  section1: {
    respondentName: '',
    district: '',
    age: '',
    gender: '',
    education: '',
    employmentBefore: '',
    occupationBefore: '',
    incomeBefore: '',
    receivedBenefit: '',
    schemes: [],
    otherBenefits: '',
    dateOfBenefit: '',
    utilization: [],
    casteCategory: '',
    subCaste: '',
    tribeIdentity: '',
    marriageOpposed: '',
    relocated: '',
    aadhaarProvided: '',
  },
  section2: {
    occupationAfter: '',
    incomeAfter: '',
    socioEconomicStatusBefore: '',
    financialSecurityScale: '',
    spouseEmploymentAfter: '',
    socioEconomicStatusAfter: '',
    socialLifeImpact: '',
    fundDecisionMaker: '',
    financialDependencyReduced: '',
    startedNewLivelihood: '',
  },
  section3: {
    progressiveChangeScale: '',
    feltSociallyAccepted: '',
    discriminationReduction: '',
    feltMoreSecure: '',
    livingWithInLaws: '',
    inLawDiscrimination: '',
    inLawDiscriminationDetails: '',
    filedPoliceComplaint: '',
    supportFromNgosOrOfficials: '',
  },
  section4: {
    schemeAwarenessSource: '',
    officialsSupportive: '',
    applicationDifficulty: '',
    timeToReceiveBenefit: '',
    disbursementEffectiveness: '',
    awareOfSchemeDetails: '',
    applicationStatus: '',
    pendingDuration: '',
    rejectionReasonCommunicated: '',
    rejectionReason: '',
    qualityOfInformation: '',
  },
  section5: {
    schemeSuccessCasteDiscrimination: '',
    schemeSuccessSecurity: '',
    areasForImprovement: [],
    shouldReviseIncentive: '',
    experiencedBenefits: [],
    shouldContinueScheme: '',
    encourageIntercasteMarriage: '',
    schemeHelpedReduceDiscriminationInArea: '',
    futureSupportExpected: [],
  },
  section6_DevadasiChildren: {
    childAgeAtMarriage: '',
    schemeImprovedDignity: '',
    treatmentDifference: '',
    spouseCaste: '',
    ownsPropertyNow: '',
    inLawAcceptabilityScale: '',
    facedStigma: '',
  },
};

const SECTION_ICONS = [
  <FaUser key="user" />, <FaChartLine key="chart" />, <FaUsers key="users" />, <FaClipboardCheck key="clipboard" />, <FaCommentDots key="comments" />, <FaChild key="child" />
];
const SECTIONS = [
  { title: 'Basic Information', description: 'Demographics and background' },
  { title: 'Socio-Economic Impact', description: 'Changes after scheme' },
  { title: 'Social Impact', description: 'Social acceptance and challenges' },
  { title: 'Scheme Experience', description: 'Experience with the process' },
  { title: 'Feedback', description: 'Suggestions and improvements' },
  { title: 'Devadasi Children', description: 'Special section for Devadasi children' },
];

export default function QuestionnairePage() {
  const { isLoggedIn, user } = useAuth();
  const { t } = useTranslation(); // Main translation hook
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [validFields, setValidFields] = useState(new Set());

  // Helper function to check if a field has a valid value
  const isFieldValid = (value: string | string[] | null | undefined) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== null && value !== undefined;
  };

  // Update form data and track valid fields
  const updateFormData = (key: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    const newValidFields = new Set(validFields);
    if (isFieldValid(value)) {
      newValidFields.add(key);
    } else {
      newValidFields.delete(key);
    }
    setValidFields(newValidFields);
  };

  // Navigate to specific section
  const navigateToSection = (sectionNumber: number) => {
    if (sectionNumber >= 1 && sectionNumber <= 6) {
      setCurrentSection(sectionNumber);
    }
  };

  // Section validation functions
  const validateSection1 = (data: FormData['section1']) => {
    const requiredFields = [
      'respondentName', 'district', 'age', 'gender', 'education',
      'employmentBefore', 'occupationBefore', 'incomeBefore', 
      'receivedBenefit', 'casteCategory', 'aadhaarProvided'
    ];
    
    const requiredArrayFields = ['schemes'];
    
    return requiredFields.every(field => isFieldValid(data[field as keyof typeof data])) &&
           requiredArrayFields.every(field => isFieldValid(data[field as keyof typeof data]));
  };

  const validateSection2 = (data: FormData['section2']) => {
    const requiredFields = [
      'occupationAfter', 'incomeAfter', 'socioEconomicStatusBefore',
      'financialSecurityScale', 'spouseEmploymentAfter', 'socioEconomicStatusAfter',
      'socialLifeImpact', 'fundDecisionMaker', 'financialDependencyReduced',
      'startedNewLivelihood'
    ];
    
    return requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
  };

  const validateSection3 = (data: FormData['section3']) => {
    const requiredFields = [
      'progressiveChangeScale', 'feltSociallyAccepted', 'discriminationReduction',
      'feltMoreSecure', 'livingWithInLaws', 'filedPoliceComplaint',
      'supportFromNgosOrOfficials'
    ];
    
    return requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
  };

  const validateSection4 = (data: FormData['section4']) => {
    const requiredFields = [
      'schemeAwarenessSource', 'officialsSupportive', 'applicationDifficulty',
      'timeToReceiveBenefit', 'disbursementEffectiveness', 'awareOfSchemeDetails',
      'applicationStatus', 'qualityOfInformation'
    ];
    
    return requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
  };

  const validateSection5 = (data: FormData['section5']) => {
    const requiredFields = [
      'schemeSuccessCasteDiscrimination', 'schemeSuccessSecurity',
      'shouldReviseIncentive', 'shouldContinueScheme', 'encourageIntercasteMarriage',
      'schemeHelpedReduceDiscriminationInArea'
    ];
    
    const requiredArrayFields = ['areasForImprovement', 'experiencedBenefits', 'futureSupportExpected'];
    
    return requiredFields.every(field => isFieldValid(data[field as keyof typeof data])) &&
           requiredArrayFields.every(field => isFieldValid(data[field as keyof typeof data]));
  };

  const validateSection6 = (data: FormData['section6_DevadasiChildren']) => {
    const requiredFields = [
      'childAgeAtMarriage', 'schemeImprovedDignity', 'treatmentDifference',
      'spouseCaste', 'ownsPropertyNow', 'inLawAcceptabilityScale', 'facedStigma'
    ];
    
    return requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
  };

  // Check if a section is completed
  const isSectionCompleted = (sectionNumber: number) => {
    switch (sectionNumber) {
      case 1: return validateSection1(formData.section1);
      case 2: return validateSection2(formData.section2);
      case 3: return validateSection3(formData.section3);
      case 4: return validateSection4(formData.section4);
      case 5: return validateSection5(formData.section5);
      case 6: return validateSection6(formData.section6_DevadasiChildren);
      default: return false;
    }
  };
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    section1: {
      respondentName: '',
      district: '',
      age: '',
      gender: '',
      education: '',
      employmentBefore: '',
      occupationBefore: '',
      incomeBefore: '',
      receivedBenefit: '',
      schemes: [],
      otherBenefits: '',
      dateOfBenefit: '',
      utilization: [],
      casteCategory: '',
      subCaste: '',
      tribeIdentity: '',
      marriageOpposed: '',
      relocated: '',
      aadhaarProvided: '',
    },
    section2: {
      occupationAfter: '',
      incomeAfter: '',
      socioEconomicStatusBefore: '',
      financialSecurityScale: '',
      spouseEmploymentAfter: '',
      socioEconomicStatusAfter: '',
      socialLifeImpact: '',
      fundDecisionMaker: '',
      financialDependencyReduced: '',
      startedNewLivelihood: '',
    },
    section3: {
      progressiveChangeScale: '',
      feltSociallyAccepted: '',
      discriminationReduction: '',
      feltMoreSecure: '',
      livingWithInLaws: '',
      inLawDiscrimination: '',
      inLawDiscriminationDetails: '',
      filedPoliceComplaint: '',
      supportFromNgosOrOfficials: '',
    },
    section4: {
      schemeAwarenessSource: '',
      officialsSupportive: '',
      applicationDifficulty: '',
      timeToReceiveBenefit: '',
      disbursementEffectiveness: '',
      awareOfSchemeDetails: '',
      applicationStatus: '',
      pendingDuration: '',
      rejectionReasonCommunicated: '',
      rejectionReason: '',
      qualityOfInformation: '',
    },
    section5: {
      schemeSuccessCasteDiscrimination: '',
      schemeSuccessSecurity: '',
      areasForImprovement: [],
      shouldReviseIncentive: '',
      experiencedBenefits: [],
      shouldContinueScheme: '',
      encourageIntercasteMarriage: '',
      schemeHelpedReduceDiscriminationInArea: '',
      futureSupportExpected: [],
    },
    section6_DevadasiChildren: {
      childAgeAtMarriage: '',
      schemeImprovedDignity: '',
      treatmentDifference: '',
      spouseCaste: '',
      ownsPropertyNow: '',
      inLawAcceptabilityScale: '',
      facedStigma: '',
    },
  });

  useEffect(() => {
    // Only redirect if we're sure about the authentication state
    // Wait a moment for auth context to initialize
    const checkAuth = async () => {
      // Add a small delay to ensure auth context has loaded
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isLoggedIn && isLoggedIn !== null) {
        router.push('/signin');
        return;
      }

      if (user && user.role === 'admin') {
        router.push('/admin-dashboard');
        return;
      }

      // Only load draft if user is logged in
      if (isLoggedIn && user) {
        loadDraft();
      }
    };

    checkAuth();
  }, [isLoggedIn, user, router]);

  const loadDraft = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/responses/draft', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data) {
        setFormData({
          ...defaultFormData,
          ...response.data.answers,
        });
        setSuccess('Draft loaded successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch {
      // No draft found, continue with empty form
      console.log('No draft found');
    }
  };

  const handleInputChange = (section: keyof FormData, field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (section: keyof FormData, field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const sectionData = prev[section] as Record<string, unknown>;
      const currentArray = (sectionData[field] as string[]) || [];
      const newArray = checked
        ? [...currentArray, value]
        : currentArray.filter((item: string) => item !== value);
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray,
        },
      };
    });
  };

  const saveDraft = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/responses/draft', 
        { answers: formData },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess('Draft saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Failed to save draft. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/responses', 
        { answers: formData },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess(t('Response submitted successfully!'));
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch {
      setError(t('Failed to submit response. Please try again.'));
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const nextSection = () => {
    if (currentSection < 6) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const backToHome = () => {
    router.push('/');
  };

  // Calculate progress based on completed sections plus current section progress
  const completedSections = [1, 2, 3, 4, 5, 6].filter(section => isSectionCompleted(section)).length;
  const progress = (completedSections / 6) * 100;

  // Recalculate validation whenever form data changes
  React.useEffect(() => {
    // Force re-render to update checkmarks when form data changes
    // This ensures the validation state is always current
  }, [formData]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <PageWrapper>
      <EnhancedNavbar />
      
      {/* Floating Logos */}
      <FloatingChristLogo>
        <FloatingLogoImage 
          src="/images/christ.svg" 
          alt="Christ University"
        />
      </FloatingChristLogo>
      
      <FloatingKarnatakaLogo>
        <FloatingLogoImage 
          src="/images/Seal_of_Karnataka.svg" 
          alt="Karnataka Government"
        />
      </FloatingKarnatakaLogo>

      <PageContainer>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '15px' }}>
          <BackButton onClick={backToHome}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {t("Back to Home")}
          </BackButton>
        </div>
        <Title>{t("SCSP/TSP Impact Evaluation Questionnaire")}</Title>
        <Subtitle>{t("Your responses will help us improve these important social programs")}</Subtitle>
        <TimeEstimate>⏱️ {t("Takes less than 8 minutes")}</TimeEstimate>
        
        <ProgressSteps>
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <ProgressStep 
              key={step}
              isActive={currentSection === step}
              isCompleted={isSectionCompleted(step)}
              onClick={() => navigateToSection(step)}
              title={`Go to section ${step}`}
            >
              <StepNumber 
                isActive={currentSection === step}
                isCompleted={isSectionCompleted(step)}
              >
                {isSectionCompleted(step) ? '✓' : step}
              </StepNumber>
              <StepLabel isActive={currentSection === step}>
                {step === 1 && t('Basic Info')}
                {step === 2 && t('Demographics')}
                {step === 3 && t('Scheme Details')}
                {step === 4 && t('Benefits')}
                {step === 5 && t('Impact')}
                {step === 6 && t('Feedback')}
              </StepLabel>
            </ProgressStep>
          ))}
        </ProgressSteps>
        
        <ProgressBar>
          <AnimatedProgressFill progress={progress} />
        </ProgressBar>
        <div style={{ fontWeight: 600, color: '#667eea', marginBottom: 8 }}>{t('Section')} {currentSection} {t('of')} 6</div>
        <StepperContainer>
          <Stepper>
            {SECTIONS.map((section, idx) => (
              <StepButton
                key={section.title}
                active={currentSection === idx + 1}
                onClick={() => setCurrentSection(idx + 1)}
                aria-current={currentSection === idx + 1 ? 'step' : undefined}
                tabIndex={0}
              >
                <span style={{ fontSize: 20, display: 'flex', alignItems: 'center' }}>{SECTION_ICONS[idx]}</span>
                <span style={{ marginLeft: 8 }}>{section.title}</span>
              </StepButton>
            ))}
          </Stepper>
        </StepperContainer>
      </Header>

      <ModernFormContainer>
        {/* Section 1: Basic Information */}
        {currentSection === 1 && (
          <>
            <ModernSectionHeader>
              <ModernSectionTitle>{t("Section 1: Basic Information & Demographics")}</ModernSectionTitle>
              <ModernSectionDesc>{t("Demographics and background")}</ModernSectionDesc>
            </ModernSectionHeader>
            <SectionContent>
              <div style={{
                background: '#f0f7ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '30px',
                fontSize: '0.95rem',
                lineHeight: '1.6'
              }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#1e40af', fontSize: '1.1rem' }}>
                  {t("About This Survey")}
                </h3>
                <p style={{ margin: '0 0 10px 0', color: '#000000' }}>
                  {t("This survey evaluates the effectiveness of government welfare schemes in Karnataka:")}
                </p>
                <ul style={{ margin: '0', paddingLeft: '20px', color: '#000000' }}>
                  <li><strong>SCSP (Scheduled Caste Sub Plan)</strong> - {t("Programs for Scheduled Caste communities")}</li>
                  <li><strong>TSP (Tribal Sub Plan)</strong> - {t("Programs for Scheduled Tribe communities")}</li>
                </ul>
                <p style={{ margin: '15px 0 0 0', fontSize: '0.9rem', color: '#000000' }}>
                  {t("Your responses will help improve these welfare programs and their impact on community development.")}
                </p>
              </div>

              <QuestionGroup>
                <QuestionCard>
                  <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                    {t("Personal Information")}
                  </h4>
                  <FormGroup>
                    <Label>{t("Full Name")}</Label>
                    <Input
                      type="text"
                      value={formData.section1.respondentName}
                      onChange={(e) => handleInputChange('section1', 'respondentName', e.target.value)}
                      placeholder={t("Enter your full name")}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>{t("Age")}</Label>
                    <Input
                      type="number"
                      value={formData.section1.age}
                      onChange={(e) => handleInputChange('section1', 'age', e.target.value)}
                      placeholder={t("Enter your age")}
                    />
                  </FormGroup>
                </QuestionCard>

                <QuestionCard>
                  <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                    {t("Location & Demographics")}
                  </h4>
                  <FormGroup>
                    <Label>{t("District/Taluk")}</Label>
                    <Input
                      type="text"
                      value={formData.section1.district}
                      onChange={(e) => handleInputChange('section1', 'district', e.target.value)}
                      placeholder={t("Enter your district and taluk")}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>{t("Gender")}</Label>
                    <RadioGroup>
                      <RadioItem>
                        <Radio
                          name="gender"
                          value="male"
                          checked={formData.section1.gender === 'male'}
                          onChange={(e) => handleInputChange('section1', 'gender', e.target.value)}
                        />
                        {t("Male")}
                      </RadioItem>
                      <RadioItem>
                        <Radio
                          name="gender"
                          value="female"
                          checked={formData.section1.gender === 'female'}
                          onChange={(e) => handleInputChange('section1', 'gender', e.target.value)}
                        />
                        {t("Female")}
                      </RadioItem>
                      <RadioItem>
                        <Radio
                          name="gender"
                          value="other"
                          checked={formData.section1.gender === 'other'}
                          onChange={(e) => handleInputChange('section1', 'gender', e.target.value)}
                        />
                        {t("Other")}
                      </RadioItem>
                    </RadioGroup>
                  </FormGroup>
                </QuestionCard>

                <QuestionCard>
                  <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                    {t("Background Information")}
                  </h4>
                  <FormGroup>
                    <Label>{t("Caste")}</Label>
                    <Select
                      value={formData.section1.subCaste}
                      onChange={(e) => handleInputChange('section1', 'subCaste', e.target.value)}
                    >
                      <option value="">{t("Select caste")}</option>
                      <option value="sc">{t("Scheduled Caste (SC)")}</option>
                      <option value="st">{t("Scheduled Tribe (ST)")}</option>
                      <option value="obc">{t("Other Backward Classes (OBC)")}</option>
                      <option value="general">{t("General")}</option>
                      <option value="others">{t("Others")}</option>
                    </Select>
                  </FormGroup>

              <FormGroup>
                <Label>{t("Education Level")}</Label>
                <Select
                  value={formData.section1.education}
                  onChange={(e) => handleInputChange('section1', 'education', e.target.value)}
                >
                  <option value="">{t("Select education level")}</option>
                  <option value="below_8th">{t("Below 8th Standard")}</option>
                  <option value="up_to_12th">{t("Up to 12th Standard")}</option>
                  <option value="graduation">{t("Graduation")}</option>
                  <option value="post_graduation">{t("Post Graduation")}</option>
                  <option value="others">{t("Others")}</option>
                </Select>
              </FormGroup>
                </QuestionCard>

                <QuestionCard>
                  <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                    {t("Employment & Income")}
                  </h4>
              <FormGroup>
                <Label>{t("Were you employed before receiving the scheme benefits?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="employmentBefore"
                      value="yes"
                      checked={formData.section1.employmentBefore === 'yes'}
                      onChange={(e) => handleInputChange('section1', 'employmentBefore', e.target.value)}
                    />
                    {t("Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="employmentBefore"
                      value="no"
                      checked={formData.section1.employmentBefore === 'no'}
                      onChange={(e) => handleInputChange('section1', 'employmentBefore', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              {formData.section1.employmentBefore === 'yes' && (
                <FormGroup>
                  <Label>{t("What was your occupation before?")}</Label>
                  <Input
                    type="text"
                    value={formData.section1.occupationBefore}
                    onChange={(e) => handleInputChange('section1', 'occupationBefore', e.target.value)}
                    placeholder={t('Enter your previous occupation')}
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label>{t("Income Level Before Scheme")}</Label>
                <Select
                  value={formData.section1.incomeBefore}
                  onChange={(e) => handleInputChange('section1', 'incomeBefore', e.target.value)}
                >
                  <option value="">{t("Select income level")}</option>
                  <option value="below_50k">{t("Below ₹50,000")}</option>
                  <option value="50k_1l">{t("₹50,000 - ₹1,00,000")}</option>
                  <option value="1l_2l">{t("₹1,00,000 - ₹2,00,000")}</option>
                  <option value="2l_3l">{t("₹2,00,000 - ₹3,00,000")}</option>
                  <option value="3l_5l">{t("₹3,00,000 - ₹5,00,000")}</option>
                  <option value="above_5l">{t("Above ₹5,00,000")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("Have you received benefits from any scheme?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="receivedBenefit"
                      value="yes"
                      checked={formData.section1.receivedBenefit === 'yes'}
                      onChange={(e) => handleInputChange('section1', 'receivedBenefit', e.target.value)}
                    />
                    {t("Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="receivedBenefit"
                      value="no"
                      checked={formData.section1.receivedBenefit === 'no'}
                      onChange={(e) => handleInputChange('section1', 'receivedBenefit', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              {formData.section1.receivedBenefit === 'yes' && (
                <>
                  <FormGroup>
                    <Label>{t("Which schemes have you benefited from? (Select all that apply)")}</Label>
                    <CheckboxGroup>
                      {['inter_caste_marriage', 'widow_remarriage', 'others_scheme'].map((scheme) => (
                        <CheckboxItem key={scheme}>
                          <Checkbox
                            checked={formData.section1.schemes.includes(scheme)}
                            onChange={(e) => handleCheckboxChange('section1', 'schemes', scheme, e.target.checked)}
                          />
                          {scheme === 'inter_caste_marriage' && t("Inter-caste Marriage Scheme")}
                          {scheme === 'widow_remarriage' && t("Widow Remarriage Scheme")}
                          {scheme === 'others_scheme' && t("Other Schemes")}
                        </CheckboxItem>
                      ))}
                    </CheckboxGroup>
                  </FormGroup>

                  <FormGroup>
                    <Label>{t("Date of Benefit Received")}</Label>
                    <Input
                      type="date"
                      value={formData.section1.dateOfBenefit}
                      onChange={(e) => handleInputChange('section1', 'dateOfBenefit', e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>{t("How did you utilize the scheme benefits? (Select all that apply)")}</Label>
                    <CheckboxGroup>
                      {['housing', 'business', 'savings', 'daily_needs', 'education'].map((utilization) => (
                        <CheckboxItem key={utilization}>
                          <Checkbox
                            checked={formData.section1.utilization.includes(utilization)}
                            onChange={(e) => handleCheckboxChange('section1', 'utilization', utilization, e.target.checked)}
                          />
                          {t(utilization.charAt(0).toUpperCase() + utilization.slice(1).replace('_', ' '))}
                        </CheckboxItem>
                      ))}
                    </CheckboxGroup>
                  </FormGroup>
                </>
              )}

              <FormGroup>
                <Label>{t("Caste Category")}</Label>
                <Select
                  value={formData.section1.casteCategory}
                  onChange={(e) => handleInputChange('section1', 'casteCategory', e.target.value)}
                >
                  <option value="">{t("Select caste category")}</option>
                  <option value="sc">{t("Scheduled Caste (SC)")}</option>
                  <option value="st">{t("Scheduled Tribe (ST)")}</option>
                  <option value="obc">{t("Other Backward Class (OBC)")}</option>
                  <option value="general">{t("General")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("Was your marriage opposed by family/community?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="marriageOpposed"
                      value="yes"
                      checked={formData.section1.marriageOpposed === 'yes'}
                      onChange={(e) => handleInputChange('section1', 'marriageOpposed', e.target.value)}
                    />
                    {t("Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="marriageOpposed"
                      value="no"
                      checked={formData.section1.marriageOpposed === 'no'}
                      onChange={(e) => handleInputChange('section1', 'marriageOpposed', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Did you have to relocate after marriage?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="relocated"
                      value="yes"
                      checked={formData.section1.relocated === 'yes'}
                      onChange={(e) => handleInputChange('section1', 'relocated', e.target.value)}
                    />
                    {t("Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="relocated"
                      value="no"
                      checked={formData.section1.relocated === 'no'}
                      onChange={(e) => handleInputChange('section1', 'relocated', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Did you provide Aadhaar details for the scheme?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="aadhaarProvided"
                      value="yes"
                      checked={formData.section1.aadhaarProvided === 'yes'}
                      onChange={(e) => handleInputChange('section1', 'aadhaarProvided', e.target.value)}
                    />
                    {t("Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="aadhaarProvided"
                      value="no"
                      checked={formData.section1.aadhaarProvided === 'no'}
                      onChange={(e) => handleInputChange('section1', 'aadhaarProvided', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>
                </QuestionCard>
              </QuestionGroup>
            </SectionContent>
          </>
        )}

        {/* Section 2: Socio-Economic Impact */}
        {currentSection === 2 && (
          <>
            <ModernSectionHeader>
              <ModernSectionTitle>{t("Section 2: Socio-Economic Impact")}</ModernSectionTitle>
              <ModernSectionDesc>{t("Changes after scheme")}</ModernSectionDesc>
            </ModernSectionHeader>
            <SectionContent>
              <QuestionGroup>
                <QuestionCard>
                  <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                    {t("Current Employment Status")}
                  </h4>
                  <FormGroup>
                    <Label>{t("What is your current occupation?")}</Label>
                    <Input
                      type="text"
                      value={formData.section2.occupationAfter}
                      onChange={(e) => handleInputChange('section2', 'occupationAfter', e.target.value)}
                      placeholder={t("Enter your current occupation")}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>{t("Current Income Level")}</Label>
                    <Select
                      value={formData.section2.incomeAfter}
                      onChange={(e) => handleInputChange('section2', 'incomeAfter', e.target.value)}
                    >
                      <option value="">{t("Select current income level")}</option>
                      <option value="below_50k">{t("Below ₹50,000")}</option>
                      <option value="50k_1l">{t("₹50,000 - ₹1,00,000")}</option>
                      <option value="1l_2l">{t("₹1,00,000 - ₹2,00,000")}</option>
                      <option value="2l_3l">{t("₹2,00,000 - ₹3,00,000")}</option>
                      <option value="3l_5l">{t("₹3,00,000 - ₹5,00,000")}</option>
                      <option value="above_5l">{t("Above ₹5,00,000")}</option>
                    </Select>
                  </FormGroup>
                </QuestionCard>

                <QuestionCard>
                  <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                    {t("Quality of Life Assessment")}
                  </h4>
              <FormGroup>
                <Label>{t("How would you describe your socio-economic status before the scheme?")}</Label>
                <Select
                  value={formData.section2.socioEconomicStatusBefore}
                  onChange={(e) => handleInputChange('section2', 'socioEconomicStatusBefore', e.target.value)}
                >
                  <option value="">{t("Select status")}</option>
                  <option value="very_poor">{t("Very Poor")}</option>
                  <option value="poor">{t("Poor")}</option>
                  <option value="average">{t("Average")}</option>
                  <option value="good">{t("Good")}</option>
                  <option value="very_good">{t("Very Good")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("On a scale of 1-5, how financially secure do you feel now? (1=Very Insecure, 5=Very Secure)")}</Label>
                <Select
                  value={formData.section2.financialSecurityScale}
                  onChange={(e) => handleInputChange('section2', 'financialSecurityScale', e.target.value)}
                >
                  <option value="">{t("Select rating")}</option>
                  <option value="1">{t("1 - Very Insecure")}</option>
                  <option value="2">{t("2 - Insecure")}</option>
                  <option value="3">{t("3 - Neutral")}</option>
                  <option value="4">{t("4 - Secure")}</option>
                  <option value="5">{t("5 - Very Secure")}</option>
                </Select>
              </FormGroup>

                  <FormGroup>
                    <Label>{t("Is your spouse currently employed?")}</Label>
                    <RadioGroup>
                      <RadioItem>
                        <Radio
                          name="spouseEmploymentAfter"
                          value="yes"
                          checked={formData.section2.spouseEmploymentAfter === 'yes'}
                          onChange={(e) => handleInputChange('section2', 'spouseEmploymentAfter', e.target.value)}
                        />
                        {t("Yes")}
                      </RadioItem>
                      <RadioItem>
                        <Radio
                          name="spouseEmploymentAfter"
                          value="no"
                          checked={formData.section2.spouseEmploymentAfter === 'no'}
                          onChange={(e) => handleInputChange('section2', 'spouseEmploymentAfter', e.target.value)}
                        />
                        {t("No")}
                      </RadioItem>
                      <RadioItem>
                        <Radio
                          name="spouseEmploymentAfter"
                          value="not_applicable"
                          checked={formData.section2.spouseEmploymentAfter === 'not_applicable'}
                          onChange={(e) => handleInputChange('section2', 'spouseEmploymentAfter', e.target.value)}
                        />
                        {t("Not Applicable")}
                      </RadioItem>
                    </RadioGroup>
                  </FormGroup>

              <FormGroup>
                <Label>{t("How would you describe your current socio-economic status?")}</Label>
                <Select
                  value={formData.section2.socioEconomicStatusAfter}
                  onChange={(e) => handleInputChange('section2', 'socioEconomicStatusAfter', e.target.value)}
                >
                  <option value="">{t("Select status")}</option>
                  <option value="very_poor">{t("Very Poor")}</option>
                  <option value="poor">{t("Poor")}</option>
                  <option value="average">{t("Average")}</option>
                  <option value="good">{t("Good")}</option>
                  <option value="very_good">{t("Very Good")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("How has the scheme impacted your social life?")}</Label>
                <Select
                  value={formData.section2.socialLifeImpact}
                  onChange={(e) => handleInputChange('section2', 'socialLifeImpact', e.target.value)}
                >
                  <option value="">{t("Select impact")}</option>
                  <option value="significantly_improved">{t("Significantly Improved")}</option>
                  <option value="moderately_improved">{t("Moderately Improved")}</option>
                  <option value="slightly_improved">{t("Slightly Improved")}</option>
                  <option value="no_change">{t("No Change")}</option>
                  <option value="worsened">{t("Worsened")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("Who makes decisions about how to use the scheme funds in your household?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="fundDecisionMaker"
                      value="self"
                      checked={formData.section2.fundDecisionMaker === 'self'}
                      onChange={(e) => handleInputChange('section2', 'fundDecisionMaker', e.target.value)}
                    />
                    {t("Myself")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="fundDecisionMaker"
                      value="spouse"
                      checked={formData.section2.fundDecisionMaker === 'spouse'}
                      onChange={(e) => handleInputChange('section2', 'fundDecisionMaker', e.target.value)}
                    />
                    {t("Spouse")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="fundDecisionMaker"
                      value="joint"
                      checked={formData.section2.fundDecisionMaker === 'joint'}
                      onChange={(e) => handleInputChange('section2', 'fundDecisionMaker', e.target.value)}
                    />
                    {t("Joint Decision")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="fundDecisionMaker"
                      value="family_elders"
                      checked={formData.section2.fundDecisionMaker === 'family_elders'}
                      onChange={(e) => handleInputChange('section2', 'fundDecisionMaker', e.target.value)}
                    />
                    {t("Family Elders")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Has the scheme reduced your financial dependency on others?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="financialDependencyReduced"
                      value="yes_significantly"
                      checked={formData.section2.financialDependencyReduced === 'yes_significantly'}
                      onChange={(e) => handleInputChange('section2', 'financialDependencyReduced', e.target.value)}
                    />
                    {t("Yes, Significantly")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="financialDependencyReduced"
                      value="yes_somewhat"
                      checked={formData.section2.financialDependencyReduced === 'yes_somewhat'}
                      onChange={(e) => handleInputChange('section2', 'financialDependencyReduced', e.target.value)}
                    />
                    {t("Yes, Somewhat")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="financialDependencyReduced"
                      value="no"
                      checked={formData.section2.financialDependencyReduced === 'no'}
                      onChange={(e) => handleInputChange('section2', 'financialDependencyReduced', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Have you started any new livelihood activities with the scheme benefits?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="startedNewLivelihood"
                      value="yes"
                      checked={formData.section2.startedNewLivelihood === 'yes'}
                      onChange={(e) => handleInputChange('section2', 'startedNewLivelihood', e.target.value)}
                    />
                    {t("Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="startedNewLivelihood"
                      value="no"
                      checked={formData.section2.startedNewLivelihood === 'no'}
                      onChange={(e) => handleInputChange('section2', 'startedNewLivelihood', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>
                </QuestionCard>
              </QuestionGroup>
            </SectionContent>
          </>
        )}

        {/* Section 3: Social Impact */}
        {currentSection === 3 && (
          <>
            <ModernSectionHeader>
              <ModernSectionTitle>{t("Section 3: Social Impact")}</ModernSectionTitle>
              <ModernSectionDesc>{t("Social acceptance and challenges")}</ModernSectionDesc>
            </ModernSectionHeader>
            <SectionContent>
              <QuestionGroup>
                <QuestionCard>
                  <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                    {t("Social Progress Assessment")}
                  </h4>
                  <FormGroup>
                    <Label>{t("On a scale of 1-5, how much progressive change have you experienced? (1=No Change, 5=Significant Change)")}</Label>
                    <Select
                  value={formData.section3.progressiveChangeScale}
                  onChange={(e) => handleInputChange('section3', 'progressiveChangeScale', e.target.value)}
                >
                  <option value="">{t("Select rating")}</option>
                  <option value="1">{t("1 - No Change")}</option>
                  <option value="2">{t("2 - Little Change")}</option>
                  <option value="3">{t("3 - Moderate Change")}</option>
                  <option value="4">{t("4 - Good Change")}</option>
                  <option value="5">{t("5 - Significant Change")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("Do you feel more socially accepted in your community now?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="feltSociallyAccepted"
                      value="yes_much_more"
                      checked={formData.section3.feltSociallyAccepted === 'yes_much_more'}
                      onChange={(e) => handleInputChange('section3', 'feltSociallyAccepted', e.target.value)}
                    />
                    {t("Yes, Much More")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="feltSociallyAccepted"
                      value="yes_somewhat"
                      checked={formData.section3.feltSociallyAccepted === 'yes_somewhat'}
                      onChange={(e) => handleInputChange('section3', 'feltSociallyAccepted', e.target.value)}
                    />
                    {t("Yes, Somewhat")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="feltSociallyAccepted"
                      value="no_change"
                      checked={formData.section3.feltSociallyAccepted === 'no_change'}
                      onChange={(e) => handleInputChange('section3', 'feltSociallyAccepted', e.target.value)}
                    />
                    {t("No Change")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="feltSociallyAccepted"
                      value="less_accepted"
                      checked={formData.section3.feltSociallyAccepted === 'less_accepted'}
                      onChange={(e) => handleInputChange('section3', 'feltSociallyAccepted', e.target.value)}
                    />
                    {t("Less Accepted")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Has caste-based discrimination reduced in your experience?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="discriminationReduction"
                      value="yes_significantly"
                      checked={formData.section3.discriminationReduction === 'yes_significantly'}
                      onChange={(e) => handleInputChange('section3', 'discriminationReduction', e.target.value)}
                    />
                    {t("Yes, Significantly")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="discriminationReduction"
                      value="yes_somewhat"
                      checked={formData.section3.discriminationReduction === 'yes_somewhat'}
                      onChange={(e) => handleInputChange('section3', 'discriminationReduction', e.target.value)}
                    />
                    {t("Yes, Somewhat")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="discriminationReduction"
                      value="no_change"
                      checked={formData.section3.discriminationReduction === 'no_change'}
                      onChange={(e) => handleInputChange('section3', 'discriminationReduction', e.target.value)}
                    />
                    {t("No Change")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="discriminationReduction"
                      value="increased"
                      checked={formData.section3.discriminationReduction === 'increased'}
                      onChange={(e) => handleInputChange('section3', 'discriminationReduction', e.target.value)}
                    />
                    {t("Increased")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Do you feel more secure in your community now?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="feltMoreSecure"
                      value="yes"
                      checked={formData.section3.feltMoreSecure === 'yes'}
                      onChange={(e) => handleInputChange('section3', 'feltMoreSecure', e.target.value)}
                    />
                    {t("Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="feltMoreSecure"
                      value="no"
                      checked={formData.section3.feltMoreSecure === 'no'}
                      onChange={(e) => handleInputChange('section3', 'feltMoreSecure', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="feltMoreSecure"
                      value="same_as_before"
                      checked={formData.section3.feltMoreSecure === 'same_as_before'}
                      onChange={(e) => handleInputChange('section3', 'feltMoreSecure', e.target.value)}
                    />
                    {t("Same as Before")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Are you currently living with your in-laws?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="livingWithInLaws"
                      value="yes"
                      checked={formData.section3.livingWithInLaws === 'yes'}
                      onChange={(e) => handleInputChange('section3', 'livingWithInLaws', e.target.value)}
                    />
                    {t("Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="livingWithInLaws"
                      value="no"
                      checked={formData.section3.livingWithInLaws === 'no'}
                      onChange={(e) => handleInputChange('section3', 'livingWithInLaws', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="livingWithInLaws"
                      value="sometimes"
                      checked={formData.section3.livingWithInLaws === 'sometimes'}
                      onChange={(e) => handleInputChange('section3', 'livingWithInLaws', e.target.value)}
                    />
                    {t("Sometimes")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Have you faced discrimination from in-laws?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="inLawDiscrimination"
                      value="yes"
                      checked={formData.section3.inLawDiscrimination === 'yes'}
                      onChange={(e) => handleInputChange('section3', 'inLawDiscrimination', e.target.value)}
                    />
                    {t("Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="inLawDiscrimination"
                      value="no"
                      checked={formData.section3.inLawDiscrimination === 'no'}
                      onChange={(e) => handleInputChange('section3', 'inLawDiscrimination', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              {formData.section3.inLawDiscrimination === 'yes' && (
                <FormGroup>
                  <Label>{t("Please describe the discrimination you faced:")}</Label>
                  <TextArea
                    value={formData.section3.inLawDiscriminationDetails}
                    onChange={(e) => handleInputChange('section3', 'inLawDiscriminationDetails', e.target.value)}
                    placeholder={t("Describe the discrimination you experienced")}
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label>{t("Have you filed any police complaint regarding discrimination?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="filedPoliceComplaint"
                      value="yes"
                      checked={formData.section3.filedPoliceComplaint === 'yes'}
                      onChange={(e) => handleInputChange('section3', 'filedPoliceComplaint', e.target.value)}
                    />
                    {t("Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="filedPoliceComplaint"
                      value="no"
                      checked={formData.section3.filedPoliceComplaint === 'no'}
                      onChange={(e) => handleInputChange('section3', 'filedPoliceComplaint', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Have you received support from NGOs or government officials?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="supportFromNgosOrOfficials"
                      value="yes_ngos"
                      checked={formData.section3.supportFromNgosOrOfficials === 'yes_ngos'}
                      onChange={(e) => handleInputChange('section3', 'supportFromNgosOrOfficials', e.target.value)}
                    />
                    {t("Yes, from NGOs")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="supportFromNgosOrOfficials"
                      value="yes_officials"
                      checked={formData.section3.supportFromNgosOrOfficials === 'yes_officials'}
                      onChange={(e) => handleInputChange('section3', 'supportFromNgosOrOfficials', e.target.value)}
                    />
                    {t("Yes, from Government Officials")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="supportFromNgosOrOfficials"
                      value="yes_both"
                      checked={formData.section3.supportFromNgosOrOfficials === 'yes_both'}
                      onChange={(e) => handleInputChange('section3', 'supportFromNgosOrOfficials', e.target.value)}
                    />
                    {t("Yes, from Both")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="supportFromNgosOrOfficials"
                      value="no"
                      checked={formData.section3.supportFromNgosOrOfficials === 'no'}
                      onChange={(e) => handleInputChange('section3', 'supportFromNgosOrOfficials', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>
                </QuestionCard>
              </QuestionGroup>
            </SectionContent>
          </>
        )}

        {/* Section 4: Scheme Experience */}
        {currentSection === 4 && (
          <>
            <ModernSectionHeader>
              <ModernSectionTitle>{t("Section 4: Scheme Experience")}</ModernSectionTitle>
              <ModernSectionDesc>{t("Experience with the process")}</ModernSectionDesc>
            </ModernSectionHeader>
            <SectionContent>
              <QuestionGroup>
                <QuestionCard>
                  <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                    {t("Scheme Awareness & Access")}
                  </h4>
                  <FormGroup>
                    <Label>{t("How did you become aware of the scheme?")}</Label>
                    <Select
                      value={formData.section4.schemeAwarenessSource}
                      onChange={(e) => handleInputChange('section4', 'schemeAwarenessSource', e.target.value)}
                    >
                  <option value="">{t("Select source")}</option>
                  <option value="government_officials">{t("Government Officials")}</option>
                  <option value="ngo">{t("NGO")}</option>
                  <option value="friends_family">{t("Friends/Family")}</option>
                  <option value="media">{t("Media")}</option>
                  <option value="community_leaders">{t("Community Leaders")}</option>
                  <option value="others">{t("Others")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("Were the officials supportive during the application process?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="officialsSupportive"
                      value="very_supportive"
                      checked={formData.section4.officialsSupportive === 'very_supportive'}
                      onChange={(e) => handleInputChange('section4', 'officialsSupportive', e.target.value)}
                    />
                    {t("Very Supportive")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="officialsSupportive"
                      value="somewhat_supportive"
                      checked={formData.section4.officialsSupportive === 'somewhat_supportive'}
                      onChange={(e) => handleInputChange('section4', 'officialsSupportive', e.target.value)}
                    />
                    {t("Somewhat Supportive")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="officialsSupportive"
                      value="neutral"
                      checked={formData.section4.officialsSupportive === 'neutral'}
                      onChange={(e) => handleInputChange('section4', 'officialsSupportive', e.target.value)}
                    />
                    {t("Neutral")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="officialsSupportive"
                      value="unsupportive"
                      checked={formData.section4.officialsSupportive === 'unsupportive'}
                      onChange={(e) => handleInputChange('section4', 'officialsSupportive', e.target.value)}
                    />
                    {t("Unsupportive")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("How difficult was the application process?")}</Label>
                <Select
                  value={formData.section4.applicationDifficulty}
                  onChange={(e) => handleInputChange('section4', 'applicationDifficulty', e.target.value)}
                >
                  <option value="">{t("Select difficulty level")}</option>
                  <option value="very_easy">{t("Very Easy")}</option>
                  <option value="easy">{t("Easy")}</option>
                  <option value="moderate">{t("Moderate")}</option>
                  <option value="difficult">{t("Difficult")}</option>
                  <option value="very_difficult">{t("Very Difficult")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("How long did it take to receive the benefit after applying?")}</Label>
                <Select
                  value={formData.section4.timeToReceiveBenefit}
                  onChange={(e) => handleInputChange('section4', 'timeToReceiveBenefit', e.target.value)}
                >
                  <option value="">{t("Select time period")}</option>
                  <option value="within_1_month">{t("Within 1 Month")}</option>
                  <option value="1_3_months">{t("1-3 Months")}</option>
                  <option value="3_6_months">{t("3-6 Months")}</option>
                  <option value="6_12_months">{t("6-12 Months")}</option>
                  <option value="more_than_1_year">{t("More than 1 Year")}</option>
                  <option value="still_waiting">{t("Still Waiting")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("How effective was the disbursement process?")}</Label>
                <Select
                  value={formData.section4.disbursementEffectiveness}
                  onChange={(e) => handleInputChange('section4', 'disbursementEffectiveness', e.target.value)}
                >
                  <option value="">{t("Select effectiveness")}</option>
                  <option value="very_effective">{t("Very Effective")}</option>
                  <option value="effective">{t("Effective")}</option>
                  <option value="moderately_effective">{t("Moderately Effective")}</option>
                  <option value="ineffective">{t("Ineffective")}</option>
                  <option value="very_ineffective">{t("Very Ineffective")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("Were you fully aware of all scheme details before applying?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="awareOfSchemeDetails"
                      value="fully_aware"
                      checked={formData.section4.awareOfSchemeDetails === 'fully_aware'}
                      onChange={(e) => handleInputChange('section4', 'awareOfSchemeDetails', e.target.value)}
                    />
                    {t("Fully Aware")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="awareOfSchemeDetails"
                      value="partially_aware"
                      checked={formData.section4.awareOfSchemeDetails === 'partially_aware'}
                      onChange={(e) => handleInputChange('section4', 'awareOfSchemeDetails', e.target.value)}
                    />
                    {t("Partially Aware")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="awareOfSchemeDetails"
                      value="not_aware"
                      checked={formData.section4.awareOfSchemeDetails === 'not_aware'}
                      onChange={(e) => handleInputChange('section4', 'awareOfSchemeDetails', e.target.value)}
                    />
                    {t("Not Aware")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("What is the current status of your application?")}</Label>
                <Select
                  value={formData.section4.applicationStatus}
                  onChange={(e) => handleInputChange('section4', 'applicationStatus', e.target.value)}
                >
                  <option value="">{t("Select status")}</option>
                  <option value="approved_received">{t("Approved and Received")}</option>
                  <option value="approved_pending">{t("Approved but Pending")}</option>
                  <option value="under_review">{t("Under Review")}</option>
                  <option value="rejected">{t("Rejected")}</option>
                  <option value="resubmitted">{t("Resubmitted")}</option>
                </Select>
              </FormGroup>

              {formData.section4.applicationStatus === 'approved_pending' && (
                <FormGroup>
                  <Label>{t("How long has it been pending?")}</Label>
                  <Input
                    type="text"
                    value={formData.section4.pendingDuration}
                    onChange={(e) => handleInputChange('section4', 'pendingDuration', e.target.value)}
                    placeholder={t("e.g., 6 months")}
                  />
                </FormGroup>
              )}

              {formData.section4.applicationStatus === 'rejected' && (
                <>
                  <FormGroup>
                    <Label>{t("Was the reason for rejection clearly communicated to you?")}</Label>
                    <RadioGroup>
                      <RadioItem>
                        <Radio
                          name="rejectionReasonCommunicated"
                          value="yes"
                          checked={formData.section4.rejectionReasonCommunicated === 'yes'}
                          onChange={(e) => handleInputChange('section4', 'rejectionReasonCommunicated', e.target.value)}
                        />
                        {t("Yes")}
                      </RadioItem>
                      <RadioItem>
                        <Radio
                          name="rejectionReasonCommunicated"
                          value="no"
                          checked={formData.section4.rejectionReasonCommunicated === 'no'}
                          onChange={(e) => handleInputChange('section4', 'rejectionReasonCommunicated', e.target.value)}
                        />
                        {t("No")}
                      </RadioItem>
                    </RadioGroup>
                  </FormGroup>

                  <FormGroup>
                    <Label>{t("What was the reason for rejection?")}</Label>
                    <TextArea
                      value={formData.section4.rejectionReason}
                      onChange={(e) => handleInputChange('section4', 'rejectionReason', e.target.value)}
                      placeholder={t("Please describe the reason for rejection")}
                    />
                  </FormGroup>
                </>
              )}

              <FormGroup>
                <Label>{t("How would you rate the quality of information provided about the scheme?")}</Label>
                <Select
                  value={formData.section4.qualityOfInformation}
                  onChange={(e) => handleInputChange('section4', 'qualityOfInformation', e.target.value)}
                >
                  <option value="">{t("Select rating")}</option>
                  <option value="excellent">{t("Excellent")}</option>
                  <option value="good">{t("Good")}</option>
                  <option value="average">{t("Average")}</option>
                  <option value="poor">{t("Poor")}</option>
                  <option value="very_poor">{t("Very Poor")}</option>
                </Select>
              </FormGroup>
                </QuestionCard>
              </QuestionGroup>
            </SectionContent>
          </>
        )}

        {/* Section 5: Feedback */}
        {currentSection === 5 && (
          <>
            <ModernSectionHeader>
              <ModernSectionTitle>{t("Section 5: Feedback")}</ModernSectionTitle>
              <ModernSectionDesc>{t("Suggestions and improvements")}</ModernSectionDesc>
            </ModernSectionHeader>
            <SectionContent>
              <QuestionGroup>
                <QuestionCard>
                  <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                    {t("Scheme Impact Assessment")}
                  </h4>
                  <FormGroup>
                    <Label>{t("Do you think the scheme is successful in reducing caste-based discrimination?")}</Label>
                    <RadioGroup>
                      <RadioItem>
                        <Radio
                          name="schemeSuccessCasteDiscrimination"
                          value="very_successful"
                          checked={formData.section5.schemeSuccessCasteDiscrimination === 'very_successful'}
                          onChange={(e) => handleInputChange('section5', 'schemeSuccessCasteDiscrimination', e.target.value)}
                        />
                        {t("Very Successful")}
                      </RadioItem>
                      <RadioItem>
                    <Radio
                      name="schemeSuccessCasteDiscrimination"
                      value="somewhat_successful"
                      checked={formData.section5.schemeSuccessCasteDiscrimination === 'somewhat_successful'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessCasteDiscrimination', e.target.value)}
                    />
                    {t("Somewhat Successful")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessCasteDiscrimination"
                      value="not_successful"
                      checked={formData.section5.schemeSuccessCasteDiscrimination === 'not_successful'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessCasteDiscrimination', e.target.value)}
                    />
                    {t("Not Successful")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessCasteDiscrimination"
                      value="uncertain"
                      checked={formData.section5.schemeSuccessCasteDiscrimination === 'uncertain'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessCasteDiscrimination', e.target.value)}
                    />
                    {t("Uncertain")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Has the scheme improved your sense of security and dignity?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessSecurity"
                      value="significantly_improved"
                      checked={formData.section5.schemeSuccessSecurity === 'significantly_improved'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessSecurity', e.target.value)}
                    />
                    {t("Significantly Improved")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessSecurity"
                      value="moderately_improved"
                      checked={formData.section5.schemeSuccessSecurity === 'moderately_improved'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessSecurity', e.target.value)}
                    />
                    {t("Moderately Improved")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessSecurity"
                      value="slightly_improved"
                      checked={formData.section5.schemeSuccessSecurity === 'slightly_improved'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessSecurity', e.target.value)}
                    />
                    {t("Slightly Improved")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeSuccessSecurity"
                      value="no_change"
                      checked={formData.section5.schemeSuccessSecurity === 'no_change'}
                      onChange={(e) => handleInputChange('section5', 'schemeSuccessSecurity', e.target.value)}
                    />
                    {t("No Change")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("What areas of the scheme need improvement? (Select all that apply)")}</Label>
                <CheckboxGroup>
                  {[
                    'application_process',
                    'disbursement_speed',
                    'information_quality',
                    'official_support',
                    'scheme_amount',
                    'follow_up_support',
                    'awareness_campaigns',
                    'documentation_requirements'
                  ].map((area) => (
                    <CheckboxItem key={area}>
                      <Checkbox
                        checked={formData.section5.areasForImprovement.includes(area)}
                        onChange={(e) => handleCheckboxChange('section5', 'areasForImprovement', area, e.target.checked)}
                      />
                      {area.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Should the incentive amount be revised?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="shouldReviseIncentive"
                      value="increase_significantly"
                      checked={formData.section5.shouldReviseIncentive === 'increase_significantly'}
                      onChange={(e) => handleInputChange('section5', 'shouldReviseIncentive', e.target.value)}
                    />
                    {t("Should be Increased Significantly")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldReviseIncentive"
                      value="increase_moderately"
                      checked={formData.section5.shouldReviseIncentive === 'increase_moderately'}
                      onChange={(e) => handleInputChange('section5', 'shouldReviseIncentive', e.target.value)}
                    />
                    {t("Should be Increased Moderately")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldReviseIncentive"
                      value="current_amount_adequate"
                      checked={formData.section5.shouldReviseIncentive === 'current_amount_adequate'}
                      onChange={(e) => handleInputChange('section5', 'shouldReviseIncentive', e.target.value)}
                    />
                    {t("Current Amount is Adequate")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldReviseIncentive"
                      value="can_be_reduced"
                      checked={formData.section5.shouldReviseIncentive === 'can_be_reduced'}
                      onChange={(e) => handleInputChange('section5', 'shouldReviseIncentive', e.target.value)}
                    />
                    {t("Can be Reduced")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("What benefits have you experienced from the scheme? (Select all that apply)")}</Label>
                <CheckboxGroup>
                  {[
                    'financial_security',
                    'social_acceptance',
                    'reduced_discrimination',
                    'improved_confidence',
                    'better_livelihood',
                    'family_support',
                    'community_respect',
                    'educational_opportunities'
                  ].map((benefit) => (
                    <CheckboxItem key={benefit}>
                      <Checkbox
                        checked={formData.section5.experiencedBenefits.includes(benefit)}
                        onChange={(e) => handleCheckboxChange('section5', 'experiencedBenefits', benefit, e.target.checked)}
                      />
                      {t(benefit.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Should this scheme be continued in the future?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="shouldContinueScheme"
                      value="definitely_yes"
                      checked={formData.section5.shouldContinueScheme === 'definitely_yes'}
                      onChange={(e) => handleInputChange('section5', 'shouldContinueScheme', e.target.value)}
                    />
                    {t("Definitely Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldContinueScheme"
                      value="yes_with_improvements"
                      checked={formData.section5.shouldContinueScheme === 'yes_with_improvements'}
                      onChange={(e) => handleInputChange('section5', 'shouldContinueScheme', e.target.value)}
                    />
                    {t("Yes, with Improvements")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldContinueScheme"
                      value="uncertain"
                      checked={formData.section5.shouldContinueScheme === 'uncertain'}
                      onChange={(e) => handleInputChange('section5', 'shouldContinueScheme', e.target.value)}
                    />
                    {t("Uncertain")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="shouldContinueScheme"
                      value="no"
                      checked={formData.section5.shouldContinueScheme === 'no'}
                      onChange={(e) => handleInputChange('section5', 'shouldContinueScheme', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Would you encourage others to pursue inter-caste marriage?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="encourageIntercasteMarriage"
                      value="definitely_yes"
                      checked={formData.section5.encourageIntercasteMarriage === 'definitely_yes'}
                      onChange={(e) => handleInputChange('section5', 'encourageIntercasteMarriage', e.target.value)}
                    />
                    {t("Definitely Yes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="encourageIntercasteMarriage"
                      value="yes_with_caution"
                      checked={formData.section5.encourageIntercasteMarriage === 'yes_with_caution'}
                      onChange={(e) => handleInputChange('section5', 'encourageIntercasteMarriage', e.target.value)}
                    />
                    {t("Yes, with Caution")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="encourageIntercasteMarriage"
                      value="neutral"
                      checked={formData.section5.encourageIntercasteMarriage === 'neutral'}
                      onChange={(e) => handleInputChange('section5', 'encourageIntercasteMarriage', e.target.value)}
                    />
                    {t("Neutral")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="encourageIntercasteMarriage"
                      value="no"
                      checked={formData.section5.encourageIntercasteMarriage === 'no'}
                      onChange={(e) => handleInputChange('section5', 'encourageIntercasteMarriage', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Has the scheme helped reduce discrimination in your area overall?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="schemeHelpedReduceDiscriminationInArea"
                      value="yes_significantly"
                      checked={formData.section5.schemeHelpedReduceDiscriminationInArea === 'yes_significantly'}
                      onChange={(e) => handleInputChange('section5', 'schemeHelpedReduceDiscriminationInArea', e.target.value)}
                    />
                    {t("Yes, Significantly")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeHelpedReduceDiscriminationInArea"
                      value="yes_somewhat"
                      checked={formData.section5.schemeHelpedReduceDiscriminationInArea === 'yes_somewhat'}
                      onChange={(e) => handleInputChange('section5', 'schemeHelpedReduceDiscriminationInArea', e.target.value)}
                    />
                    {t("Yes, Somewhat")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeHelpedReduceDiscriminationInArea"
                      value="no_change"
                      checked={formData.section5.schemeHelpedReduceDiscriminationInArea === 'no_change'}
                      onChange={(e) => handleInputChange('section5', 'schemeHelpedReduceDiscriminationInArea', e.target.value)}
                    />
                    {t("No Change")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeHelpedReduceDiscriminationInArea"
                      value="uncertain"
                      checked={formData.section5.schemeHelpedReduceDiscriminationInArea === 'uncertain'}
                      onChange={(e) => handleInputChange('section5', 'schemeHelpedReduceDiscriminationInArea', e.target.value)}
                    />
                    {t("Uncertain")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("What kind of future support do you expect? (Select all that apply)")}</Label>
                <CheckboxGroup>
                  {[
                    'continued_financial_support',
                    'employment_opportunities',
                    'educational_support',
                    'healthcare_benefits',
                    'housing_assistance',
                    'skill_development',
                    'legal_support',
                    'counseling_services'
                  ].map((support) => (
                    <CheckboxItem key={support}>
                      <Checkbox
                        checked={formData.section5.futureSupportExpected.includes(support)}
                        onChange={(e) => handleCheckboxChange('section5', 'futureSupportExpected', support, e.target.checked)}
                      />
                      {t(support.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))}
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              </FormGroup>
                </QuestionCard>
              </QuestionGroup>
            </SectionContent>
          </>
        )}

        {/* Section 6: Devadasi Children */}
        {currentSection === 6 && (
          <>
            <ModernSectionHeader>
              <ModernSectionTitle>{t("Section 6: Devadasi Children")}</ModernSectionTitle>
              <ModernSectionDesc>{t("Special section for Devadasi children")}</ModernSectionDesc>
            </ModernSectionHeader>
            <SectionContent>
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f4f8', borderRadius: '8px', borderLeft: '4px solid #4299e1' }}>
                <strong>{t("Note")}:</strong> {t("This section is specifically for children of Devadasi women who have benefited from marriage incentive schemes. If this doesn't apply to you, you can skip this section.")}
              </div>

              <QuestionGroup>
                <QuestionCard>
                  <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
                    {t("Marriage & Social Impact")}
                  </h4>
                  <FormGroup>
                    <Label>{t("At what age did you get married?")}</Label>
                    <Input
                      type="number"
                      value={formData.section6_DevadasiChildren.childAgeAtMarriage}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'childAgeAtMarriage', e.target.value)}
                      placeholder={t("Enter your age at marriage")}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>{t("Has the scheme improved your dignity and social standing?")}</Label>
                    <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="schemeImprovedDignity"
                      value="significantly_improved"
                      checked={formData.section6_DevadasiChildren.schemeImprovedDignity === 'significantly_improved'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'schemeImprovedDignity', e.target.value)}
                    />
                    {t("Significantly Improved")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeImprovedDignity"
                      value="moderately_improved"
                      checked={formData.section6_DevadasiChildren.schemeImprovedDignity === 'moderately_improved'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'schemeImprovedDignity', e.target.value)}
                    />
                    {t("Moderately Improved")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeImprovedDignity"
                      value="slightly_improved"
                      checked={formData.section6_DevadasiChildren.schemeImprovedDignity === 'slightly_improved'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'schemeImprovedDignity', e.target.value)}
                    />
                    {t("Slightly Improved")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="schemeImprovedDignity"
                      value="no_change"
                      checked={formData.section6_DevadasiChildren.schemeImprovedDignity === 'no_change'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'schemeImprovedDignity', e.target.value)}
                    />
                    {t("No Change")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("Do you feel you are treated differently because of your mother's background?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="treatmentDifference"
                      value="yes_negatively"
                      checked={formData.section6_DevadasiChildren.treatmentDifference === 'yes_negatively'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'treatmentDifference', e.target.value)}
                    />
                    {t("Yes, Negatively")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="treatmentDifference"
                      value="sometimes"
                      checked={formData.section6_DevadasiChildren.treatmentDifference === 'sometimes'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'treatmentDifference', e.target.value)}
                    />
                    {t("Sometimes")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="treatmentDifference"
                      value="no"
                      checked={formData.section6_DevadasiChildren.treatmentDifference === 'no'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'treatmentDifference', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="treatmentDifference"
                      value="not_sure"
                      checked={formData.section6_DevadasiChildren.treatmentDifference === 'not_sure'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'treatmentDifference', e.target.value)}
                    />
                    {t("Not Sure")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("What is your spouse's caste background?")}</Label>
                <Select
                  value={formData.section6_DevadasiChildren.spouseCaste}
                  onChange={(e) => handleInputChange('section6_DevadasiChildren', 'spouseCaste', e.target.value)}
                >
                  <option value="">{t("Select caste category")}</option>
                  <option value="same_caste">{t("Same Caste")}</option>
                  <option value="different_sc">{t("Different SC")}</option>
                  <option value="st">{t("ST")}</option>
                  <option value="obc">{t("OBC")}</option>
                  <option value="general">{t("General")}</option>
                  <option value="prefer_not_to_say">{t("Prefer not to say")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("Do you own any property now (land, house, etc.)?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="ownsPropertyNow"
                      value="yes_independently"
                      checked={formData.section6_DevadasiChildren.ownsPropertyNow === 'yes_independently'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'ownsPropertyNow', e.target.value)}
                    />
                    {t("Yes, Independently")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="ownsPropertyNow"
                      value="yes_jointly"
                      checked={formData.section6_DevadasiChildren.ownsPropertyNow === 'yes_jointly'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'ownsPropertyNow', e.target.value)}
                    />
                    {t("Yes, Jointly")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="ownsPropertyNow"
                      value="no"
                      checked={formData.section6_DevadasiChildren.ownsPropertyNow === 'no'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'ownsPropertyNow', e.target.value)}
                    />
                    {t("No")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>

              <FormGroup>
                <Label>{t("On a scale of 1-5, how accepted are you by your in-laws? (1=Not at all, 5=Completely accepted)")}</Label>
                <Select
                  value={formData.section6_DevadasiChildren.inLawAcceptabilityScale}
                  onChange={(e) => handleInputChange('section6_DevadasiChildren', 'inLawAcceptabilityScale', e.target.value)}
                >
                  <option value="">{t("Select rating")}</option>
                  <option value="1">{t("1 - Not at all accepted")}</option>
                  <option value="2">{t("2 - Poorly accepted")}</option>
                  <option value="3">{t("3 - Moderately accepted")}</option>
                  <option value="4">{t("4 - Well accepted")}</option>
                  <option value="5">{t("5 - Completely accepted")}</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>{t("Have you faced any stigma related to your background since marriage?")}</Label>
                <RadioGroup>
                  <RadioItem>
                    <Radio
                      name="facedStigma"
                      value="frequently"
                      checked={formData.section6_DevadasiChildren.facedStigma === 'frequently'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'facedStigma', e.target.value)}
                    />
                    {t("Frequently")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="facedStigma"
                      value="occasionally"
                      checked={formData.section6_DevadasiChildren.facedStigma === 'occasionally'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'facedStigma', e.target.value)}
                    />
                    {t("Occasionally")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="facedStigma"
                      value="rarely"
                      checked={formData.section6_DevadasiChildren.facedStigma === 'rarely'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'facedStigma', e.target.value)}
                    />
                    {t("Rarely")}
                  </RadioItem>
                  <RadioItem>
                    <Radio
                      name="facedStigma"
                      value="never"
                      checked={formData.section6_DevadasiChildren.facedStigma === 'never'}
                      onChange={(e) => handleInputChange('section6_DevadasiChildren', 'facedStigma', e.target.value)}
                    />
                    {t("Never")}
                  </RadioItem>
                </RadioGroup>
              </FormGroup>
                </QuestionCard>
              </QuestionGroup>
            </SectionContent>
          </>
        )}

        {/* Add the navigation buttons */}
        <ButtonGroup>
          <NavigationButtons>
            <Button onClick={prevSection} disabled={currentSection === 1}>
              {t('Previous')}
            </Button>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="secondary" onClick={saveDraft} disabled={loading}>
                {loading ? t('Saving...') : t('Save Draft')}
              </Button>
              
              {currentSection === 6 ? (
                <Button variant="success" onClick={submitForm} disabled={loading}>
                  {loading ? t('Submitting...') : t('Submit Response')}
                </Button>
              ) : (
                <Button variant="primary" onClick={nextSection}>
                  {t('Next')}
                </Button>
              )}
            </div>
          </NavigationButtons>
        </ButtonGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
      </ModernFormContainer>
    </PageContainer>

    {/* Floating Back to Home Button */}
    <FloatingBackButton onClick={backToHome} title="Go back to home page">
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
      </svg>
      {t("Back to Home")}
    </FloatingBackButton>

    </PageWrapper>
  );
}


