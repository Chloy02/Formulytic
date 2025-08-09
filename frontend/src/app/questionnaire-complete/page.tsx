"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../contexts/TranslationContext';
import { useRouter } from 'next/navigation';
import { useDynamicTranslation } from '../../hooks/useDynamicTranslation';
import { TranslatedText, TranslatedLabel, TranslatedOption } from '../../components/TranslatedText';
import EnhancedNavbar from '../../components/EnhancedNavbar';
import axios from 'axios';
import { FaUser, FaChartLine, FaUsers, FaClipboardCheck, FaCommentDots, FaChild } from 'react-icons/fa';
// --- FIX: Import the ServerLink ---
import ServerLink from '../../lib/api/serverURL';

// ... (Keep all your styled-components definitions here, they are correct)
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

  &::before {
    content: '⏱️';
    margin-right: 8px;
    font-size: 1rem;
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
    content: '';
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
  justify-content: space-between;
  margin: 15px 0;
  position: relative;
`;

const ProgressStep = styled.div<{ $isActive: boolean; $isCompleted: boolean }>`
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
    content: '';
    position: absolute;
    top: 15px;
    left: 60%;
    right: -40%;
    height: 2px;
    background-color: ${props => props.$isCompleted ? '#48bb78' : '#e2e8f0'};
    z-index: 1;
  }
`;

const StepNumber = styled.div<{
  $isActive: boolean;
  $isCompleted: boolean;
}>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => 
    props.$isCompleted ? '#48bb78' : 
    props.$isActive ? '#3182ce' : '#e2e8f0'
  };
  color: ${props => 
    props.$isCompleted || props.$isActive ? 'white' : '#a0aec0'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow: ${props => 
    props.$isActive ? '0 0 0 4px rgba(66, 153, 225, 0.2)' : 
    props.$isCompleted ? '0 0 0 4px rgba(72, 187, 120, 0.2)' : 'none'
  };

  ${ProgressStep}:hover & {
    transform: scale(1.1);
    box-shadow: ${props =>
      props.$isCompleted
        ? '0 0 0 4px rgba(72, 187, 120, 0.3)'
        : '0 0 0 4px rgba(66, 153, 225, 0.15)'};
  }
`;


const StepLabel = styled.span<{ $isActive: boolean }>`
  font-size: 0.75rem;
  color: ${props => props.$isActive ? '#3182ce' : '#666'};
  font-weight: ${props => props.$isActive ? '600' : '400'};
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
`;

const SectionHeader = styled.div`
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-left: 4px solid #667eea;
  color: #2d3748;
  padding: 20px 30px;
  margin-bottom: 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    opacity: 0.3;
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
      content: '';
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
`;

const FormGroup = styled.div`
  margin-bottom: 28px;
  position: relative;
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

  @media (max-width: 768px) {
    padding: 12px 36px 12px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
    min-height: 100px;
  }

  @media (max-width: 480px) {
    padding: 10px 32px 10px 12px;
    border-radius: 6px;
    min-height: 90px;
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
  justify-content: space-between;
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
  justify-content: space-between;
  align-items: center;
`;

const StepperContainer = styled.div`
  margin: 32px 0 0 0;
  overflow-x: auto;
  width: 100%;
`;
const Stepper = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`;
const StepButton = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? 'linear-gradient(90deg, #667eea, #764ba2)' : '#f3f4f6')};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  border: none;
  border-radius: 24px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  min-width: 140px;
  box-shadow: ${({ $active }) => ($active ? '0 4px 16px rgba(102,126,234,0.15)' : 'none')};
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  outline: ${({ $active }) => ($active ? '2px solid #667eea' : 'none')};
  &:hover, &:focus {
    background: ${({ $active }) => ($active ? 'linear-gradient(90deg, #667eea, #764ba2)' : '#e2e8f0')};
    color: #222;
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

const SubmissionHistorySection = styled.div`
  background: linear-gradient(135deg, rgba(103, 58, 183, 0.1), rgba(156, 39, 176, 0.1));
  border: 1px solid rgba(103, 58, 183, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
`;

const SubmissionCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(103, 58, 183, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(103, 58, 183, 0.1);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SubmissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SubmissionDate = styled.span`
  color: #673ab7;
  font-weight: 600;
  font-size: 0.9rem;
`;

const SubmissionStatus = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${props => props.status === 'submitted' ? '#e8f5e8' : '#fff3e0'};
  color: ${props => props.status === 'submitted' ? '#2e7d32' : '#f57c00'};
`;

const ToggleButton = styled.button`
  background: linear-gradient(135deg, #673ab7, #9c27b0);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(103, 58, 183, 0.3);
  }
`;

// --- Section 4 Types ---
type AwarenessSource = '' | 'government_official' | 'community_leader' | 'panchayat' | 'friends_family' | 'media' | 'social_media' | 'online_portal' | 'other';
type OfficialsSupportiveness = '' | 'not_at_all' | 'slightly' | 'moderately' | 'very' | 'extremely';
type ApplicationProcessDifficulty = '' | 'very_easy' | 'easy' | 'moderate' | 'difficult' | 'very_difficult';
type ApplicationHelpSource = '' | 'department_staff' | 'friend_or_family' | 'on_my_own' | 'other';
type TimeToReceiveBenefit = '' | 'less_than_3_months' | '3_6_months' | '6_12_months' | '1_2_years' | 'still_not_received' | 'cant_remember';
type OverallProcessRating = '' | 'very_easy' | 'easy' | 'moderate' | 'difficult' | 'very_difficult';
type YesNo = '' | 'yes' | 'no';
type InvitedToSpeak = '' | 'yes' | 'no';
type SpeakingPlatform = 'community_meetings' | 'school_college' | 'ngo_events' | 'government_programs' | 'religious_gatherings' | 'media_interviews' | 'other';

interface Section4FormData {
  awarenessSource: AwarenessSource;
  awarenessSourceOther: string;
  officialsSupportiveness: OfficialsSupportiveness;
  applicationProcessDifficulty: ApplicationProcessDifficulty;
  applicationHelpSource: ApplicationHelpSource;
  applicationHelpSourceOther: string;
  timeToReceiveBenefit: TimeToReceiveBenefit;
  overallProcessRating: OverallProcessRating;
  participatedInAwarenessPrograms: YesNo;
  invitedToSpeak: InvitedToSpeak;
  speakingPlatforms: SpeakingPlatform[];
  speakingPlatformsOther: string;
}

interface FormData {
section1: {
    // Q1
    receivedIncentives: string;
    // Q2
    schemes: string[];
    // Q3-6
    applicantName: string;
    spouseName: string;
    applicantGender: string;
    spouseGender: string;
    // Q7-11
    applicantCasteCategory: string;
    scCaste: string;
    scNomadic: string;
    stCaste: string;
    stGroup: string;
    stNomadicTribe: string;
    spouseCaste: string;
    spouseSubCaste: string;
    // Q12-15
    age: string;
    mobileNumber: string;
    marriageDate: string;
    registrationDate: string;
    // Q16
    organizingOrganization: string;
    // Q17-22
    applicationDate: string;
    grantDate: string;
    benefitAmount: string;
    fdCertificateReceived: string;
    jointBankAccount: string;
    creditMonthYear: string;
    // Q23-24
    applicantEducation: string;
    spouseEducation: string;
    // Q25-26
    applicantEmploymentBefore: string;
    applicantOccupationBefore: string;
    spouseEmploymentBefore: string;
    spouseOccupationBefore: string;
    // Q27-30
    residentialAddress: string;
    bothKarnatakaResidents: string;
    otherState?: string; // Add this field for the conditional question in Q28
    homeDescription: string;
    maritalStatus: string;
    // Q31-34
    familyAnnualIncome: string;
    otherSchemeBenefits: string;
    otherSchemeNames: string;
    utilization: string[];
  };
    section2: {
    // Q1: Applicant's occupation after scheme
    applicantOccupationAfter: string;
    applicantOccupationAfterOther?: string; // For the 'Other' option
    // Q2: Spouse's occupation after scheme
    spouseOccupationAfter: string;
    spouseOccupationAfterOther?: string; // For the 'Other' option
    // Q3: Household's combined annual income
    householdAnnualIncomeAfter: string;
    // Q4: Standard of living
    standardOfLivingImproved: string;
    // Q5 (New Q5): Access to basic needs
    accessToBasicNeeds: string;
    // Q6 (New Q6): Social life impact
    socialLifeImpact: string;
  };
   section3: {
    // Q1: Did your family...
    familyOpposedMarriage: string;
    whoOpposed?: string;
    whoOpposedOther?: string;
    // Q2: How did your extended family react?
    extendedFamilyReaction: string;
    // Q3: How did your neighbours...
    neighboursReaction: string;
    // Q4: Have there been any inter-caste marriages...
    interCasteMarriagesInCommunity: string;
    // Q5: Did you and your husband/wife face any challenges...
    challengesAfterMarriage: string;
    challengesList?: string[];
    challengesOther?: string;
    // Q6: Have there been any instances of domestic violence...
    domesticViolence: string;
    // Q7: Did you relocate...
    relocatedAfterMarriage: string;
    relocationReason?: string;
    relocationReasonOther?: string;
    // Q8: Has any police complaint...
    policeComplaint: string;
    policeComplaintDetails?: string;
    // Q9: Who mainly caused the caste-based harassment...
    harassmentCausedBy: string;
    harassmentCausedByOther?: string;
    // Q10: In what ways did you experience discrimination...
    discriminationWays: string[];
    discriminationWaysOther?: string;
    // Q11: Do you feel that you have gained recognition...
    gainedRecognition: string;
    recognitionWays?: string[];
    recognitionWaysOther?: string;
    // Q12: Has receiving the benefit enabled you to have a cordial relationship...
    cordialRelationshipInLaws: string;
    cordialRelationshipWays?: string[];
    cordialRelationshipWaysOther?: string;
    // Q13: This scheme has helped bring about a positive...
    progressiveChangePublicOpinion: string;
    // Q14: Who supported you...
    supportSource: string[];
    supportSourceOther?: string;
    // Q15: Has your marriage influenced others...
    marriageInfluence: string;
    // Q16: Would you suggest or recommend this scheme...
    recommendScheme: string;
    // Q17: Do you feel safe...
    safetyInCommunity: string;
    // Q18: Have you faced any opposition...
    oppositionAfterBenefit: string;
    oppositionDetails?: string;
  };
  section4: Section4FormData;

  section5: {
    // Q1: Scheme success in reducing discrimination
    successInReducingDiscrimination: string;
    // Q2: Scheme success in providing a safe attitude/security
    successInProvidingSecurity: string;
    // Q3: Which aspects need improvement?
    improvementAreas: string[];
    improvementAreasOther?: string;
    // Q4: Should the financial incentive be increased?
    increaseIncentive: string;
    increasedIncentiveAmount?: string;
    // Q5: How has the scheme helped you?
    schemeBenefits: string[];
    // Q6: Should this scheme continue?
    continueScheme: string;
    // Q7: Will marriages become more accepted?
    marriagesMoreAccepted: string;
    // Q8: Would you openly support inter-caste marriages?
    advocateForIntercaste: string;
    // Q9: Would you encourage your children to marry inter-caste?
    encourageChildrenIntercaste: string;
    // Q10: What kind of future support would you like?
    futureSupport: string[];
    futureSupportOther?: string;
    // Q11: Improvements or suggestions
    improvementSuggestions?: string;
  };
 section6_Devadasi: {
    devadasiAgeAtMarriage: string;
    dignityImproved: string;
    familyProblemsWithMarriage: string;
    spouseCaste: string;
    disclosedBackground: string;
    spouseFamilyAcceptance: string;
    problemsAfterMarriage: string;
  };
  section6_NonBeneficiary: {
    awareOfScheme: string;
    applicationStatus?: string;
    pendingDuration?: string;
    rejectionReasonCommunicated?: string;
    rejectionReason?: string;
    informationQuality?: string;
  };
  section6_Widow: { // New object for widow remarriage questions
    remarriageAge: string;
    childrenFromPreviousMarriage: string;
    childrenCount?: string;
    childrenGender?: string;
    husbandChildrenFromPreviousMarriage: string;
    husbandChildrenCount?: string;
    husbandChildrenGender?: string;
    husbandMaritalStatus: string;
    husbandCaste: string;
    husbandCasteOther?: string;
    ownedPropertyBeforeRemarriage: string;
    previousPropertyDetails?: string;
    ownedPropertyAfterRemarriage: string;
    newPropertyDetails?: string;
    familyAcceptanceScale: string;
    facedStigmaAfterRemarriage: string;
    stigmaDetails?: string;
  };
}

const defaultFormData: FormData = {
 section1: {
    // Q1
    receivedIncentives: '',
    // Q2
    schemes: [],
    // Q3-6
    applicantName: '',
    spouseName: '',
    applicantGender: '',
    spouseGender: '',
    // Q7-11
    applicantCasteCategory: '',
    scCaste: '',
    scNomadic: '',
    stCaste: '',
    stGroup: '',
    stNomadicTribe: '',
    spouseCaste: '',
    spouseSubCaste: '',
    // Q12-15
    age: '',
    mobileNumber: '',
    marriageDate: '',
    registrationDate: '',
    // Q16
    organizingOrganization: '',
    // Q17-22
    applicationDate: '',
    grantDate: '',
    benefitAmount: '',
    fdCertificateReceived: '',
    jointBankAccount: '',
    creditMonthYear: '',
    // Q23-24
    applicantEducation: '',
    spouseEducation: '',
    // Q25-26
    applicantEmploymentBefore: '',
    applicantOccupationBefore: '',
    spouseEmploymentBefore: '',
    spouseOccupationBefore: '',
    // Q27-30
    residentialAddress: '',
    bothKarnatakaResidents: '',
    otherState: '',
    homeDescription: '',
    maritalStatus: '',
    // Q31-34
    familyAnnualIncome: '',
    otherSchemeBenefits: '',
    otherSchemeNames: '',
    utilization: [],
  },
  section2: {
    applicantOccupationAfter: '',
    applicantOccupationAfterOther: '',
    spouseOccupationAfter: '',
    spouseOccupationAfterOther: '',
    householdAnnualIncomeAfter: '',
    standardOfLivingImproved: '',
    accessToBasicNeeds: '',
    socialLifeImpact: '',
  },
  section3: {
    familyOpposedMarriage: '',
    whoOpposed: '',
    whoOpposedOther: '',
    extendedFamilyReaction: '',
    neighboursReaction: '',
    interCasteMarriagesInCommunity: '',
    challengesAfterMarriage: '',
    challengesList: [],
    challengesOther: '',
    domesticViolence: '',
    relocatedAfterMarriage: '',
    relocationReason: '',
    relocationReasonOther: '',
    policeComplaint: '',
    policeComplaintDetails: '',
    harassmentCausedBy: '',
    harassmentCausedByOther: '',
    discriminationWays: [],
    discriminationWaysOther: '',
    gainedRecognition: '',
    recognitionWays: [],
    recognitionWaysOther: '',
    cordialRelationshipInLaws: '',
    cordialRelationshipWays: [],
    cordialRelationshipWaysOther: '',
    progressiveChangePublicOpinion: '',
    supportSource: [],
    supportSourceOther: '',
    marriageInfluence: '',
    recommendScheme: '',
    safetyInCommunity: '',
    oppositionAfterBenefit: '',
    oppositionDetails: '',
  },

  section4: {
    awarenessSource: '',
    awarenessSourceOther: '',
    officialsSupportiveness: '',
    applicationProcessDifficulty: '',
    applicationHelpSource: '',
    applicationHelpSourceOther: '',
    timeToReceiveBenefit: '',
    overallProcessRating: '',
    participatedInAwarenessPrograms: '',
    invitedToSpeak: '',
    speakingPlatforms: [],
    speakingPlatformsOther: '',
  },

  section5: {
    successInReducingDiscrimination: '',
    successInProvidingSecurity: '',
    improvementAreas: [],
    improvementAreasOther: '',
    increaseIncentive: '',
    increasedIncentiveAmount: '',
    schemeBenefits: [],
    continueScheme: '',
    marriagesMoreAccepted: '',
    advocateForIntercaste: '',
    encourageChildrenIntercaste: '',
    futureSupport: [],
    futureSupportOther: '',
    improvementSuggestions: '',
  },
   section6_Devadasi: {
    devadasiAgeAtMarriage: '',
    dignityImproved: '',
    familyProblemsWithMarriage: '',
    spouseCaste: '',
    disclosedBackground: '',
    spouseFamilyAcceptance: '',
    problemsAfterMarriage: '',
  },
  section6_NonBeneficiary: {
    awareOfScheme: '',
    applicationStatus: '',
    pendingDuration: '',
    rejectionReasonCommunicated: '',
    rejectionReason: '',
    informationQuality: '',
  },
  section6_Widow: {
    remarriageAge: '',
    childrenFromPreviousMarriage: '',
    childrenCount: '',
    childrenGender: '',
    husbandChildrenFromPreviousMarriage: '',
    husbandChildrenCount: '',
    husbandChildrenGender: '',
    husbandMaritalStatus: '',
    husbandCaste: '',
    husbandCasteOther: '',
    ownedPropertyBeforeRemarriage: '',
    previousPropertyDetails: '',
    ownedPropertyAfterRemarriage: '',
    newPropertyDetails: '',
    familyAcceptanceScale: '',
    facedStigmaAfterRemarriage: '',
    stigmaDetails: '',
  },
};

const SECTION_ICONS = [
  <FaUser />, <FaChartLine />, <FaUsers />, <FaClipboardCheck />, <FaCommentDots />, <FaChild />
];

// Move SECTIONS inside component to access t() function
const getSections = (t: any) => [
  { title: t('Respondent Information & Scheme Details'), description: t('Demographics and background') },
  { title: t('Socio-Economic & Livelihood Impact'), description: t('Changes after scheme') },
  { title: t('Social Inclusion & Security'), description: t('Social acceptance and challenges') },
  { title: t('Awareness, Access & Quality of Service'), description: t('Experience with the process') },
  { title: t('Overall Satisfaction, Challenges & Recommendations'), description: t('Suggestions and improvements') },
  { title: t('A: Specific questions about the marriage of children of Ex Devadasis  B: Questions related to widow remarriage incentive'), description: t('Special section for Devadasi children') },
 ];

export default function QuestionnairePage() {
  const { isLoggedIn, user } = useAuth();
  const { t, language } = useTranslation(); // Translation hook with language
  const { dtSync } = useDynamicTranslation(); // Dynamic translation hook
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);

  // Redirect to Kannada questionnaire if language is Kannada
  useEffect(() => {
    if (language === 'kn') {
      router.push('/questionnaire-kannada');
      return;
    }
  }, [language, router]);
  const [validFields, setValidFields] = useState(new Set());
  const [previousSubmissions, setPreviousSubmissions] = useState<any[]>([]);
  const [showSubmissionHistory, setShowSubmissionHistory] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

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
// A simple validation function for the new Section 1 questions
const validateSection1 = (data: FormData['section1']) => {
    // Define a list of core, non-conditional fields that must always be filled.
    const requiredFields = [
        'receivedIncentives',
        'spouseName',
        'applicantGender',
        'spouseGender',
        'applicantCasteCategory',
        'spouseCaste',
        'age',
        'mobileNumber',
        'marriageDate',
        'registrationDate',
        'applicationDate',
        'grantDate',
        'benefitAmount',
        'jointBankAccount',
        'creditMonthYear',
        'applicantEducation',
        'spouseEducation',
        'applicantEmploymentBefore',
        'spouseEmploymentBefore',
        'residentialAddress',
        'bothKarnatakaResidents',
        'homeDescription',
        'maritalStatus',
        'familyAnnualIncome',
        'otherSchemeBenefits',
        'utilization', // Changed from requiredArrayFields to be simple
    ];


    // Check if every field in the list is valid.
    return requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
};

  // Section validation function for the new Section 2 questions
const validateSection2 = (data: FormData['section2']): boolean => {
    // A. Define all required fields for this section based on the new questions.
    const requiredFields = [
        'applicantOccupationAfter',
        'spouseOccupationAfter',
        'householdAnnualIncomeAfter',
        'standardOfLivingImproved',
        'accessToBasicNeeds',
        'socialLifeImpact',
    ];
    
    // Check if every field in the list is valid using the global isFieldValid helper.
    // The type assertion 'as keyof typeof data' is necessary and correct here.
    const allRequiredPresent = requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
    if (!allRequiredPresent) {
        return false;
    }

    // B. Perform conditional validation for fields that depend on other answers.

    // Q1: 'applicantOccupationAfterOther' is required if 'applicantOccupationAfter' is 'other'.
    if (data.applicantOccupationAfter === 'other' && !isFieldValid(data.applicantOccupationAfterOther)) {
        return false;
    }

    // Q2: 'spouseOccupationAfterOther' is required if 'spouseOccupationAfter' is 'other'.
    if (data.spouseOccupationAfter === 'other' && !isFieldValid(data.spouseOccupationAfterOther)) {
        return false;
    }
    
    // If all checks pass, the section is valid.
    return true;
};

  const validateSection3 = (data: FormData['section3']): boolean => {
    // A. Define all primary required fields for this section.
    const requiredFields = [
        'familyOpposedMarriage',
        'extendedFamilyReaction',
        'neighboursReaction',
        'interCasteMarriagesInCommunity',
        'challengesAfterMarriage',
        'domesticViolence',
        'relocatedAfterMarriage',
        'policeComplaint',
        'harassmentCausedBy',
        'gainedRecognition',
        'cordialRelationshipInLaws',
        'progressiveChangePublicOpinion',
        'marriageInfluence',
        'recommendScheme',
        'safetyInCommunity',
        'oppositionAfterBenefit',
    ];
    return requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
  };

 const validateSection4 = (data: FormData['section4']): boolean => {
    // A. Define all primary required fields for this section.
    const requiredFields = [
        'awarenessSource',
        'officialsSupportiveness',
        'applicationProcessDifficulty',
        'applicationHelpSource',
        'timeToReceiveBenefit',
        'overallProcessRating',
        'participatedInAwarenessPrograms',
        'invitedToSpeak',
    ];
    
   const allRequiredPresent = requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
    if (!allRequiredPresent) return false;
    
    // B. Conditional Validation
    
    // Q1: Awareness source 'other'
    if (data.awarenessSource === 'other' && !isFieldValid(data.awarenessSourceOther)) {
        return false;
    }

    // Q4: Application help 'other'
    if (data.applicationHelpSource === 'other' && !isFieldValid(data.applicationHelpSourceOther)) {
        return false;
    }

    // Q8: Speaking platforms (checkbox) is required if invitedToSpeak is 'yes'
    if (data.invitedToSpeak === 'yes') {
      if ((data.speakingPlatforms || []).length === 0) {
        return false;
      }
      // Check for 'other' platform details
      if ((data.speakingPlatforms || []).includes('other') && !isFieldValid(data.speakingPlatformsOther)) {
        return false;
      }
    }
    
    return true;

  };

const validateSection5 = (data: FormData['section5']): boolean => {
  const requiredFields = [
    'successInReducingDiscrimination',
    'successInProvidingSecurity',
    'increaseIncentive',
    'continueScheme',
    'marriagesMoreAccepted',
    'advocateForIntercaste',
    'encourageChildrenIntercaste',
  ];
    
      const allRequiredPresent = requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
  if (!allRequiredPresent) return false;

  // Q3: `improvementAreas` is a required checkbox field.
  if (data.improvementAreas.length === 0) return false;
  // Q3: Conditional `other` field.
  if (data.improvementAreas.includes('other') && !isFieldValid(data.improvementAreasOther)) {
    return false;
  }

  // Q4: Conditional `increasedIncentiveAmount` field.
  if (data.increaseIncentive === 'yes' && !isFieldValid(data.increasedIncentiveAmount)) {
    return false;
  }
  
  // Q5: `schemeBenefits` is a required checkbox field.
  if (data.schemeBenefits.length === 0) return false;

  // Q10: `futureSupport` is a required checkbox field.
  if (data.futureSupport.length === 0) return false;
  // Q10: Conditional `other` field.
  if (data.futureSupport.includes('other') && !isFieldValid(data.futureSupportOther)) {
    return false;
  }
  
  // Q11: Improvement suggestions is optional, but if filled, should be valid.
  if (isFieldValid(data.improvementSuggestions)) {
    return true;
  }
  
  return true;

  };

 // New validation function for Devadasi Children subsection
const validateSection6Devadasi = (data: FormData['section6_Devadasi']): boolean => {
    const requiredFields = [
      'devadasiAgeAtMarriage', 'dignityImproved', 'familyProblemsWithMarriage',
      'spouseCaste', 'disclosedBackground', 'spouseFamilyAcceptance', 'problemsAfterMarriage'
    ];
    return requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
};

// New validation function for Widow Remarriage subsection
const validateSection6Widow = (data: FormData['section6_Widow']): boolean => {
    const requiredFields = [
      'remarriageAge', 'childrenFromPreviousMarriage', 'husbandChildrenFromPreviousMarriage',
      'husbandMaritalStatus', 'husbandCaste', 'ownedPropertyBeforeRemarriage',
      'ownedPropertyAfterRemarriage', 'familyAcceptanceScale', 'facedStigmaAfterRemarriage'
    ];
    const allRequiredPresent = requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
    if (!allRequiredPresent) return false;

    if (data.childrenFromPreviousMarriage === 'yes' && !isFieldValid(data.childrenCount)) return false;
    if (data.childrenFromPreviousMarriage === 'yes' && !isFieldValid(data.childrenGender)) return false;

    if (data.husbandChildrenFromPreviousMarriage === 'yes' && !isFieldValid(data.husbandChildrenCount)) return false;
    if (data.husbandChildrenFromPreviousMarriage === 'yes' && !isFieldValid(data.husbandChildrenGender)) return false;

    if (data.husbandCaste === 'Different' && !isFieldValid(data.husbandCasteOther)) return false;
    
    if (data.ownedPropertyBeforeRemarriage === 'yes' && !isFieldValid(data.previousPropertyDetails)) return false;
    if (data.ownedPropertyAfterRemarriage === 'yes' && !isFieldValid(data.newPropertyDetails)) return false;

    if (data.facedStigmaAfterRemarriage === 'yes' && !isFieldValid(data.stigmaDetails)) return false;

    return true;
};

// New validation function for Non-Beneficiary subsection
const validateSection6NonBeneficiary = (data: FormData['section6_NonBeneficiary']): boolean => {
    const requiredFields = [
        'awareOfScheme',
    ];
    const allRequiredPresent = requiredFields.every(field => isFieldValid(data[field as keyof typeof data]));
    if (!allRequiredPresent) return false;
    
    if (data.awareOfScheme === 'yes' && !isFieldValid(data.applicationStatus)) return false;
    if (data.awareOfScheme === 'yes' && !isFieldValid(data.informationQuality)) return false;
    
    if (data.applicationStatus === 'pending' && !isFieldValid(data.pendingDuration)) return false;

    if (data.applicationStatus === 'rejected') {
        if (!isFieldValid(data.rejectionReasonCommunicated)) return false;
        if (data.rejectionReasonCommunicated === 'yes' && !isFieldValid(data.rejectionReason)) return false;
    }
    return true;
};

// The main validation function for Section 6, acts as a dispatcher
const validateSection6 = (formData: FormData): boolean => {
    const hasDevadasiScheme = formData.section1.schemes.includes('devadasi_children_marriage');
    const hasWidowScheme = formData.section1.schemes.includes('widow_remarriage');
    const receivedBenefit = formData.section1.receivedIncentives === 'yes';
    
    if (receivedBenefit) {
        if (hasDevadasiScheme) {
            return validateSection6Devadasi(formData.section6_Devadasi);
        } else if (hasWidowScheme) {
            return validateSection6Widow(formData.section6_Widow);
        }
    } else {
        return validateSection6NonBeneficiary(formData.section6_NonBeneficiary);
    }
    
    return true; // Valid if they are a beneficiary of other schemes
};
  // Check if a section is completed
  const isSectionCompleted = (sectionNumber: number) => {
    switch (sectionNumber) {
      case 1: return validateSection1(formData.section1);
      case 2: return validateSection2(formData.section2);
      case 3: return validateSection3(formData.section3);
      case 4: return validateSection4(formData.section4);
      case 5: return validateSection5(formData.section5);
      case 6: return validateSection6(formData);
      default: return false;
    }
  };
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
   section1: {
    receivedIncentives: '', // Q1
    schemes: [], // Q2
    applicantName: '', // Q3
    spouseName: '', // Q4
    applicantGender: '', // Q5
    spouseGender: '', // Q6
    applicantCasteCategory: '', // Q7
    scCaste: '', // Q8
    scNomadic: '', // Q8
    stCaste: '', // Q9
    stGroup: '', // Q9
    stNomadicTribe: '', // Q9
    spouseCaste: '', // Q10
    spouseSubCaste: '', // Q11
    age: '', // Q12
    mobileNumber: '', // Q13
    marriageDate: '', // Q14
    registrationDate: '', // Q15
    organizingOrganization: '', // Q16
    applicationDate: '', // Q17
    grantDate: '', // Q18
    benefitAmount: '', // Q19
    fdCertificateReceived: '', // Q20
    jointBankAccount: '', // Q21
    creditMonthYear: '', // Q22
    applicantEducation: '', // Q23
    spouseEducation: '', // Q24
    applicantEmploymentBefore: '', // Q25
    applicantOccupationBefore: '', // Q25
    spouseEmploymentBefore: '', // Q26
    spouseOccupationBefore: '', // Q26
    residentialAddress: '', // Q27
    bothKarnatakaResidents: '', // Q28
    homeDescription: '', // Q29
    maritalStatus: '', // Q30
    familyAnnualIncome: '', // Q31
    otherSchemeBenefits: '', // Q32
    otherSchemeNames: '', // Q33
    utilization: [], // Q34
  },

   section2: {
    applicantOccupationAfter: '',
    applicantOccupationAfterOther: '',
    spouseOccupationAfter: '',
    spouseOccupationAfterOther: '',
    householdAnnualIncomeAfter: '',
    standardOfLivingImproved: '',
    accessToBasicNeeds: '',
    socialLifeImpact: '',
  },
   section3: {
    familyOpposedMarriage: '',
    whoOpposed: '',
    whoOpposedOther: '',
    extendedFamilyReaction: '',
    neighboursReaction: '',
    interCasteMarriagesInCommunity: '',
    challengesAfterMarriage: '',
    challengesList: [],
    challengesOther: '',
    domesticViolence: '',
    relocatedAfterMarriage: '',
    relocationReason: '',
    relocationReasonOther: '',
    policeComplaint: '',
    policeComplaintDetails: '',
    harassmentCausedBy: '',
    harassmentCausedByOther: '',
    discriminationWays: [],
    discriminationWaysOther: '',
    gainedRecognition: '',
    recognitionWays: [],
    recognitionWaysOther: '',
    cordialRelationshipInLaws: '',
    cordialRelationshipWays: [],
    cordialRelationshipWaysOther: '',
    progressiveChangePublicOpinion: '',
    supportSource: [],
    supportSourceOther: '',
    marriageInfluence: '',
    recommendScheme: '',
    safetyInCommunity: '',
    oppositionAfterBenefit: '',
    oppositionDetails: '',
  },
    section4: {
      awarenessSource: '',
      awarenessSourceOther: '',
      officialsSupportiveness: '',
      applicationProcessDifficulty: '',
      applicationHelpSource: '',
      applicationHelpSourceOther: '',
      timeToReceiveBenefit: '',
      overallProcessRating: '',
      participatedInAwarenessPrograms: '',
      invitedToSpeak: '',
      speakingPlatforms: [],
      speakingPlatformsOther: '',
    },
      section5: {
    successInReducingDiscrimination: '',
    successInProvidingSecurity: '',
    improvementAreas: [],
    improvementAreasOther: '',
    increaseIncentive: '',
    increasedIncentiveAmount: '',
    schemeBenefits: [],
    continueScheme: '',
    marriagesMoreAccepted: '',
    advocateForIntercaste: '',
    encourageChildrenIntercaste: '',
    futureSupport: [],
    futureSupportOther: '',
    improvementSuggestions: '',
  },
     section6_Devadasi: {
    devadasiAgeAtMarriage: '',
    dignityImproved: '',
    familyProblemsWithMarriage: '',
    spouseCaste: '',
    disclosedBackground: '',
    spouseFamilyAcceptance: '',
    problemsAfterMarriage: '',
  },
  section6_NonBeneficiary: {
    awareOfScheme: '',
    applicationStatus: '',
    pendingDuration: '',
    rejectionReasonCommunicated: '',
    rejectionReason: '',
    informationQuality: '',
  },
  section6_Widow: {
    remarriageAge: '',
    childrenFromPreviousMarriage: '',
    childrenCount: '',
    childrenGender: '',
    husbandChildrenFromPreviousMarriage: '',
    husbandChildrenCount: '',
    husbandChildrenGender: '',
    husbandMaritalStatus: '',
    husbandCaste: '',
    husbandCasteOther: '',
    ownedPropertyBeforeRemarriage: '',
    previousPropertyDetails: '',
    ownedPropertyAfterRemarriage: '',
    newPropertyDetails: '',
    familyAcceptanceScale: '',
    facedStigmaAfterRemarriage: '',
    stigmaDetails: '',
  },
  });

  useEffect(() => {
    // Don't run if we're not authenticated yet
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    // Don't load drafts for admin users
    if (user && user.role === 'admin') {
      router.push('/admin-dashboard');
      return;
    }

    // Load draft when we have authentication (even without full user object)
    // This ensures draft loads even on page refresh before user object is fully loaded
    if (isLoggedIn && !draftLoaded) {
      console.log('Authentication confirmed, loading draft...');
      loadDraftWithRetry();
      loadPreviousSubmissions();
      setDraftLoaded(true);
    }
  }, [isLoggedIn, draftLoaded]);

  // Separate useEffect for user-specific actions once user is loaded
  useEffect(() => {
    if (user && user.id && draftLoaded) {
      console.log('User data loaded:', user);
      // Additional user-specific setup can go here
    }
  }, [user?.id, draftLoaded]);

  // Auto-save functionality (like Google Forms)
  useEffect(() => {
    // Clear existing timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Set new timer for auto-save after 3 seconds of inactivity
    const timer = setTimeout(() => {
      if (isLoggedIn && user && draftLoaded) {
        autoSaveDraft();
      }
    }, 3000);

    setAutoSaveTimer(timer);

    // Cleanup timer on unmount
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [formData, isLoggedIn, user, draftLoaded]);

  const loadPreviousSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, cannot load submissions');
        return;
      }

      console.log('Loading previous submissions for user:', user?.id);
      const response = await axios.get('/api/responses/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Previous submissions:', response.data);
      setPreviousSubmissions(response.data || []);
    } catch (error: any) {
      console.log('No previous submissions found or error loading:', error);
      setPreviousSubmissions([]);
    }
  };

  const loadDraftWithRetry = async (retryCount = 0) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, cannot load draft');
        if (retryCount < 3) {
          // Retry after a short delay in case token is still loading
          setTimeout(() => loadDraftWithRetry(retryCount + 1), 1000);
        }
        return;
      }

      console.log('Attempting to load draft (attempt:', retryCount + 1, ')');
      const response = await axios.get('/api/responses/draft', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Draft response:', response.data);
      
      if (response.data && response.data.answers) {
        // Deep merge the loaded draft with default form data
        const loadedData = mergeFormData(defaultFormData, response.data.answers);
        
        setFormData(loadedData);
        setSuccess('✅ Previous draft loaded successfully! All your answers have been restored.');
        console.log('Draft loaded and form populated:', loadedData);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        console.log('No draft data found - starting fresh');
        setSuccess('📝 Welcome! Starting with a fresh questionnaire.');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error: any) {
      console.error('Error loading draft (attempt', retryCount + 1, '):', error);
      
      if (error.response?.status === 404) {
        console.log('No saved draft found - starting with fresh form');
        setSuccess('📝 Welcome! Starting with a fresh questionnaire.');
        setTimeout(() => setSuccess(''), 3000);
      } else if (error.response?.status === 401) {
        console.log('Authentication failed - redirecting to login');
        router.push('/signin');
      } else if (retryCount < 2) {
        // Retry up to 3 times for network errors
        console.log('Retrying draft load in 2 seconds...');
        setTimeout(() => loadDraftWithRetry(retryCount + 1), 2000);
        return;
      } else {
        setError('Failed to load saved draft. Starting with fresh form.');
        setTimeout(() => setError(''), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to deep merge form data
  const mergeFormData = (defaultData: FormData, loadedData: any): FormData => {
    return {
      section1: {
        ...defaultData.section1,
        ...(loadedData.section1 || {}),
        schemes: loadedData.section1?.schemes || [],
        utilization: loadedData.section1?.utilization || [],
      },
      section2: {
        ...defaultData.section2,
        ...(loadedData.section2 || {}),
      },
      section3: {
        ...defaultData.section3,
        ...(loadedData.section3 || {}),
        widowChallenges: loadedData.section3?.widowChallenges || [],
        widowSchemeBenefits: loadedData.section3?.widowSchemeBenefits || [],
        beneficialPrograms: loadedData.section3?.beneficialPrograms || [],
      },
      section4: {
        ...defaultData.section4,
        ...(loadedData.section4 || {}),
      },
      section5: {
        ...defaultData.section5,
        ...(loadedData.section5 || {}),
        areasForImprovement: loadedData.section5?.areasForImprovement || [],
        experiencedBenefits: loadedData.section5?.experiencedBenefits || [],
        futureSupportExpected: loadedData.section5?.futureSupportExpected || [],
      },
       section6_Devadasi: { // Corrected field name
            ...defaultData.section6_Devadasi,
            ...(loadedData.section6_Devadasi || {}),
        },
        section6_NonBeneficiary: { // New field
            ...defaultData.section6_NonBeneficiary,
            ...(loadedData.section6_NonBeneficiary || {}),
        },
        section6_Widow: { // New field
            ...defaultData.section6_Widow,
            ...(loadedData.section6_Widow || {}),
        },
    };
  };

  // Auto-save function (silent, like Google Forms)
  const autoSaveDraft = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const responseId = user?.id ? `draft_${user.id}` : `draft_${Date.now()}`;
      
      await axios.post('/api/responses/draft', 
        { 
          answers: formData,
          responseId: responseId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Auto-saved draft silently');
    } catch (err) {
      console.error('Auto-save failed:', err);
      // Silent failure for auto-save
    }
  };

  // Overload for Section 4 to allow correct types
  const handleInputChange = (
    section: keyof FormData,
    field: string,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Overload for Section 4 to allow correct types
  const handleCheckboxChange = (
    section: keyof FormData,
    field: string,
    value: string,
    checked: boolean
  ) => {
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
      const responseId = user?.id ? `draft_${user.id}` : `draft_${Date.now()}`;
      
      console.log('Manually saving draft for user:', user?.id);
      await axios.post('/api/responses/draft', 
        { 
          answers: formData,
          responseId: responseId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess('💾 Draft saved successfully! Your progress is automatically saved as you type.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Draft save error:', err);
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
      const responseId = user?.id ? `response_${user.id}_${Date.now()}` : `response_${Date.now()}`;
      
      await axios.post('/api/responses', 
        { 
          answers: formData,
          responseId: responseId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess(t('Response submitted successfully!'));
      
      // Reload submissions to show the new submission
      loadPreviousSubmissions();
      
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Failed to submit response. Please try again.');
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

  // Show loading indicator while loading draft
  if (loading) {
    return (
      <PageContainer>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '50vh',
          gap: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f4f6',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>{t('Loading your questionnaire...')}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageWrapper>
      <EnhancedNavbar />
      <PageContainer>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
          <BackButton onClick={backToHome}>
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {t('Back to Home')}
          </BackButton>
          <div></div>
        </div>
        <Title>{t('SCSP/TSP Impact Evaluation Questionnaire')}</Title>
        <Subtitle>{t('Your responses will help us improve these important social programs')}</Subtitle>
        <TimeEstimate>{t('Takes less than 8 minutes')}</TimeEstimate>
        
        {/* Previous Submissions Section */}
        {previousSubmissions.length > 0 && (
          <SubmissionHistorySection>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#673ab7', fontSize: '1.2rem' }}>
                📋 {t('Your Previous Submissions')} ({previousSubmissions.length})
              </h3>
              <ToggleButton onClick={() => setShowSubmissionHistory(!showSubmissionHistory)}>
                {showSubmissionHistory ? t('Hide') : t('Show')} {t('History')}
              </ToggleButton>
            </div>
            
            {showSubmissionHistory && (
              <div>
                {previousSubmissions.map((submission, index) => (
                  <SubmissionCard key={submission._id || index}>
                    <SubmissionHeader>
                      <SubmissionDate>
                        📅 {new Date(submission.submittedAt || submission.lastSaved).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </SubmissionDate>
                      <SubmissionStatus status={submission.status}>
                        {submission.status === 'submitted' ? `✅ ${t('Submitted')}` : `📝 ${t('Draft')}`}
                      </SubmissionStatus>
                    </SubmissionHeader>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>
                      {t('Response ID')}: {submission.responseId}
                    </div>
                    {submission.answers?.section1?.respondentName && (
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        {t('Name')}: {submission.answers.section1.respondentName}
                      </div>
                    )}
                  </SubmissionCard>
                ))}
              </div>
            )}
          </SubmissionHistorySection>
        )}
        
        <ProgressSteps>
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <ProgressStep 
              key={step}
              $isActive={currentSection === step}
              $isCompleted={isSectionCompleted(step)}
              onClick={() => navigateToSection(step)}
              title={`Go to section ${step}`}
            >
              <StepNumber 
                $isActive={currentSection === step}
                $isCompleted={isSectionCompleted(step)}
              >
                {isSectionCompleted(step) ? '✓' : step}
              </StepNumber>
              <StepLabel $isActive={currentSection === step}>
                {step === 1 && t('Basic Info')}
                {step === 2 && t('Demographics')}
                {step === 3 && t('Scheme Details')}
                {step === 4 && t('Benefits')}
                {step === 5 && t('Impact')}
                {step === 6 && t('Specific Questions')}
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
            {getSections(t).map((section, idx) => (
              <StepButton
                key={section.title}
                $active={currentSection === idx + 1}
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

      {/* Section 2: Socio-Economic Impact */}
        {currentSection === 1 && (
  <>
    <ModernSectionHeader>
      <ModernSectionTitle>{t('Section 1: Respondent Information & Scheme Details')}</ModernSectionTitle>
      <ModernSectionDesc>{t('Please provide your details and information about the scheme you received.')}</ModernSectionDesc>
    </ModernSectionHeader>
    <SectionContent>
      <QuestionGroup>

        {/* Q1: Have you received any incentives? */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Have you received any incentives from the Social Welfare/Scheduled Classes Welfare Departments for marriages held in 2020-21 / 2023-24 / 2024-25?" />
            <RadioGroup>
              <RadioItem>
                <Radio
                  name="receivedIncentives"
                  value="yes"
                  checked={formData.section1.receivedIncentives === 'yes'}
                  onChange={(e) => handleInputChange('section1', 'receivedIncentives', e.target.value)}
                />
                <TranslatedText>Yes</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio
                  name="receivedIncentives"
                  value="no"
                  checked={formData.section1.receivedIncentives === 'no'}
                  onChange={(e) => handleInputChange('section1', 'receivedIncentives', e.target.value)}
                />
                <TranslatedText>No</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q2: Which schemes have you benefited from? (Conditional) */}
        {formData.section1.receivedIncentives === 'yes' && (
          <QuestionCard>
            <FormGroup>
              <TranslatedLabel text="If yes, please select the appropriate schemes? (check box with provision of multiple choice)" />
              <CheckboxGroup>
                <CheckboxItem>
                  <Checkbox
                    checked={formData.section1.schemes.includes('inter_caste_marriage')}
                    onChange={(e) => handleCheckboxChange('section1', 'schemes', 'inter_caste_marriage', e.target.checked)}
                  />
                  <TranslatedText>Incentives to Inter-Caste Marriage</TranslatedText>
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    checked={formData.section1.schemes.includes('inter_sub_caste_marriage')}
                    onChange={(e) => handleCheckboxChange('section1', 'schemes', 'inter_sub_caste_marriage', e.target.checked)}
                  />
                  <TranslatedText>Incentives to Inter-Sub Caste Marriage</TranslatedText>
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    checked={formData.section1.schemes.includes('widow_remarriage')}
                    onChange={(e) => handleCheckboxChange('section1', 'schemes', 'widow_remarriage', e.target.checked)}
                  />
                  <TranslatedText>Incentives to Widow Re-marriage</TranslatedText>
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    checked={formData.section1.schemes.includes('simple_mass_marriage')}
                    onChange={(e) => handleCheckboxChange('section1', 'schemes', 'simple_mass_marriage', e.target.checked)}
                  />
                  <TranslatedText>Incentives to Simple Mass Marriage</TranslatedText>
                </CheckboxItem>
                <CheckboxItem>
                  <Checkbox
                    checked={formData.section1.schemes.includes('devadasi_children_marriage')}
                    onChange={(e) => handleCheckboxChange('section1', 'schemes', 'devadasi_children_marriage', e.target.checked)}
                  />
                  <TranslatedText>Incentives to Marriage of Ex-Devadasi Children</TranslatedText>
                </CheckboxItem>
              </CheckboxGroup>
            </FormGroup>
          </QuestionCard>
        )}

        {/* Q3-6: Names and Gender */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Name of the applicant (Optional):" />
            <Input
              type="text"
              value={formData.section1.applicantName}
              onChange={(e) => handleInputChange('section1', 'applicantName', e.target.value)}
              placeholder={t('Enter applicant name')}
            />
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Husband/Wife's Name:" />
            <Input
              type="text"
              value={formData.section1.spouseName}
              onChange={(e) => handleInputChange('section1', 'spouseName', e.target.value)}
              placeholder={t("Enter spouse's name")}
            />
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Gender of the applicant:" />
            <RadioGroup>
              <RadioItem>
                <Radio name="applicantGender" value="male" checked={formData.section1.applicantGender === 'male'} onChange={(e) => handleInputChange('section1', 'applicantGender', e.target.value)} />
                <TranslatedText>Male</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="applicantGender" value="female" checked={formData.section1.applicantGender === 'female'} onChange={(e) => handleInputChange('section1', 'applicantGender', e.target.value)} />
                <TranslatedText>Female</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Gender of the Husband/Wife's:" />
            <RadioGroup>
              <RadioItem>
                <Radio name="spouseGender" value="male" checked={formData.section1.spouseGender === 'male'} onChange={(e) => handleInputChange('section1', 'spouseGender', e.target.value)} />
                <TranslatedText>Male</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="spouseGender" value="female" checked={formData.section1.spouseGender === 'female'} onChange={(e) => handleInputChange('section1', 'spouseGender', e.target.value)} />
                <TranslatedText>Female</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q7-11: Caste Details */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Which category does the applicant belong to?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="applicantCasteCategory" value="sc" checked={formData.section1.applicantCasteCategory === 'sc'} onChange={(e) => handleInputChange('section1', 'applicantCasteCategory', e.target.value)} />
                <TranslatedText>SC</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="applicantCasteCategory" value="st" checked={formData.section1.applicantCasteCategory === 'st'} onChange={(e) => handleInputChange('section1', 'applicantCasteCategory', e.target.value)} />
                <TranslatedText>ST</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>

          {formData.section1.applicantCasteCategory === 'sc' && (
            <>
              <FormGroup>
                <TranslatedLabel text="If SC, enter the SC caste (from the list of 101 castes)" />
                <Input type="text" value={formData.section1.scCaste} onChange={(e) => handleInputChange('section1', 'scCaste', e.target.value)} placeholder={t('Enter SC caste')} />
              </FormGroup>
              <FormGroup>
                <TranslatedLabel text="Do you belong to nomadic/semi-nomadic communities?" />
                <RadioGroup>
                  <RadioItem>
                    <Radio name="scNomadic" value="yes" checked={formData.section1.scNomadic === 'yes'} onChange={(e) => handleInputChange('section1', 'scNomadic', e.target.value)} />
                    <TranslatedText>Yes</TranslatedText>
                  </RadioItem>
                  <RadioItem>
                    <Radio name="scNomadic" value="no" checked={formData.section1.scNomadic === 'no'} onChange={(e) => handleInputChange('section1', 'scNomadic', e.target.value)} />
                    <TranslatedText>No</TranslatedText>
                  </RadioItem>
                </RadioGroup>
              </FormGroup>
            </>
          )}

          {formData.section1.applicantCasteCategory === 'st' && (
            <>
              <FormGroup>
                <TranslatedLabel text="If ST: Enter the caste (from the list of 50 castes)" />
                <Input type="text" value={formData.section1.stCaste} onChange={(e) => handleInputChange('section1', 'stCaste', e.target.value)} placeholder={t('Enter ST caste')} />
              </FormGroup>
              <FormGroup>
                <TranslatedLabel text="Do you belong to the following group among STs?" />
                <RadioGroup>
                  <RadioItem>
                    <Radio name="stGroup" value="pvtg" checked={formData.section1.stGroup === 'pvtg'} onChange={(e) => handleInputChange('section1', 'stGroup', e.target.value)} />
                    <TranslatedText>Specified Particularly Vulnerable Tribal Group (PVTG)</TranslatedText>
                  </RadioItem>
                  <RadioItem>
                    <Radio name="stGroup" value="nomadic" checked={formData.section1.stGroup === 'nomadic'} onChange={(e) => handleInputChange('section1', 'stGroup', e.target.value)} />
                    <TranslatedText>Nomadic/semi-nomadic tribe</TranslatedText>
                  </RadioItem>
                  <RadioItem>
                    <Radio name="stGroup" value="none" checked={formData.section1.stGroup === 'none'} onChange={(e) => handleInputChange('section1', 'stGroup', e.target.value)} />
                    <TranslatedText>None</TranslatedText>
                  </RadioItem>
                </RadioGroup>
              </FormGroup>
            </>
          )}

          <FormGroup>
            <TranslatedLabel text="Which caste does the husband/wife belong to?" />
            <Input type="text" value={formData.section1.spouseCaste} onChange={(e) => handleInputChange('section1', 'spouseCaste', e.target.value)} placeholder={t("Enter spouse's caste")} />
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Which sub-caste does the husband/wife belong to?" />
            <Input type="text" value={formData.section1.spouseSubCaste} onChange={(e) => handleInputChange('section1', 'spouseSubCaste', e.target.value)} placeholder={t("Enter spouse's sub-caste")} />
          </FormGroup>
        </QuestionCard>

        {/* Q12-15: Dates and Contact */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Age/ Date of Birth (at time of interview):" />
            <Input type="text" value={formData.section1.age} onChange={(e) => handleInputChange('section1', 'age', e.target.value)} placeholder={t('Enter age or DOB')} />
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Mobile Number" />
            <Input type="tel" value={formData.section1.mobileNumber} onChange={(e) => handleInputChange('section1', 'mobileNumber', e.target.value)} placeholder={t('Enter mobile number')} />
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Date of Marriage:" />
            <Input type="date" value={formData.section1.marriageDate} onChange={(e) => handleInputChange('section1', 'marriageDate', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Registration Date/Month and year:" />
            <Input type="month" value={formData.section1.registrationDate} onChange={(e) => handleInputChange('section1', 'registrationDate', e.target.value)} />
          </FormGroup>
        </QuestionCard>

        {/* Q16: Mass Marriage Organization (Conditional) */}
        {formData.section1.schemes.includes('simple_mass_marriage') && (
          <QuestionCard>
            <FormGroup>
              <TranslatedLabel text="Name the organization that organized the wedding. (For simple/ mass marriage only)" />
              <Input type="text" value={formData.section1.organizingOrganization} onChange={(e) => handleInputChange('section1', 'organizingOrganization', e.target.value)} placeholder={t('Enter organization name')} />
            </FormGroup>
          </QuestionCard>
        )}

        {/* Q17-22: Application & Benefit Details */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Specify the date/Month & Year of application filing" />
            <Input type="month" value={formData.section1.applicationDate} onChange={(e) => handleInputChange('section1', 'applicationDate', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Enter the date/month and year of grant of facility." />
            <Input type="month" value={formData.section1.grantDate} onChange={(e) => handleInputChange('section1', 'grantDate', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Specify the amount of benefit received" />
            <Input type="number" value={formData.section1.benefitAmount} onChange={(e) => handleInputChange('section1', 'benefitAmount', e.target.value)} placeholder={t('Enter amount in ₹')} />
          </FormGroup>

          {formData.section1.schemes.includes('inter_caste_marriage') && (
            <FormGroup>
              <TranslatedLabel text="If the benefit was received from ICM, 50% of the amount is kept as a Fixed Deposit. Have you received the Deposit Certificate?" />
              <RadioGroup>
                <RadioItem>
                  <Radio name="fdCertificateReceived" value="yes" checked={formData.section1.fdCertificateReceived === 'yes'} onChange={(e) => handleInputChange('section1', 'fdCertificateReceived', e.target.value)} />
                  <TranslatedText>Yes</TranslatedText>
                </RadioItem>
                <RadioItem>
                  <Radio name="fdCertificateReceived" value="no" checked={formData.section1.fdCertificateReceived === 'no'} onChange={(e) => handleInputChange('section1', 'fdCertificateReceived', e.target.value)} />
                  <TranslatedText>No</TranslatedText>
                </RadioItem>
              </RadioGroup>
            </FormGroup>
          )}

          <FormGroup>
            <TranslatedLabel text="Do you and your husband/wife have a joint bank account?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="jointBankAccount" value="yes" checked={formData.section1.jointBankAccount === 'yes'} onChange={(e) => handleInputChange('section1', 'jointBankAccount', e.target.value)} />
                <TranslatedText>Yes</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="jointBankAccount" value="no" checked={formData.section1.jointBankAccount === 'no'} onChange={(e) => handleInputChange('section1', 'jointBankAccount', e.target.value)} />
                <TranslatedText>No</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Specify the month and year when the amount was credited to the applicant's bank account." />
            <Input type="month" value={formData.section1.creditMonthYear} onChange={(e) => handleInputChange('section1', 'creditMonthYear', e.target.value)} />
          </FormGroup>
        </QuestionCard>

        {/* Q23-24: Educational Qualification */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Educational Qualification of the Applicant:" />
            <Select value={formData.section1.applicantEducation} onChange={(e) => handleInputChange('section1', 'applicantEducation', e.target.value)}>
              <TranslatedOption value="">{t('Select education level')}</TranslatedOption>
              <TranslatedOption value="no_schooling">{t('No formal Schooling')}</TranslatedOption>
              <TranslatedOption value="below_5">{t('Below 5th Standard')}</TranslatedOption>
              <TranslatedOption value="below_8">{t('Below 8th Standard')}</TranslatedOption>
              <TranslatedOption value="up_to_12">{t('Below or up to 12th Standard')}</TranslatedOption>
              <TranslatedOption value="graduation">{t('Graduation/ Diploma')}</TranslatedOption>
              <TranslatedOption value="post_graduation">{t('Post Graduation and above')}</TranslatedOption>
            </Select>
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Educational Qualification of the husband/wife:" />
            <Select value={formData.section1.spouseEducation} onChange={(e) => handleInputChange('section1', 'spouseEducation', e.target.value)}>
              <TranslatedOption value="">{t('Select education level')}</TranslatedOption>
              <TranslatedOption value="no_schooling">{t('No formal Schooling')}</TranslatedOption>
              <TranslatedOption value="below_5">{t('Below 5th Standard')}</TranslatedOption>
              <TranslatedOption value="below_8">{t('Below 8th Standard')}</TranslatedOption>
              <TranslatedOption value="up_to_12">{t('Below or up to 12th Standard')}</TranslatedOption>
              <TranslatedOption value="graduation">{t('Graduation/ Diploma')}</TranslatedOption>
              <TranslatedOption value="post_graduation">{t('Post Graduation and above')}</TranslatedOption>
            </Select>
          </FormGroup>
        </QuestionCard>

        {/* Q25-26: Employment Before */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Were you employed before receiving the scheme benefit?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="applicantEmploymentBefore" value="yes" checked={formData.section1.applicantEmploymentBefore === 'yes'} onChange={(e) => handleInputChange('section1', 'applicantEmploymentBefore', e.target.value)} />
                <TranslatedText>Yes</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="applicantEmploymentBefore" value="no" checked={formData.section1.applicantEmploymentBefore === 'no'} onChange={(e) => handleInputChange('section1', 'applicantEmploymentBefore', e.target.value)} />
                <TranslatedText>No</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
          {formData.section1.applicantEmploymentBefore === 'yes' && (
            <FormGroup>
              <TranslatedLabel text="If yes, please specify your occupation prior to receiving the scheme benefit:" />
              <Input type="text" value={formData.section1.applicantOccupationBefore} onChange={(e) => handleInputChange('section1', 'applicantOccupationBefore', e.target.value)} placeholder={t('Enter your occupation')} />
            </FormGroup>
          )}

          <FormGroup>
            <TranslatedLabel text="Was your husband/wife employed before receiving the scheme benefit?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="spouseEmploymentBefore" value="yes" checked={formData.section1.spouseEmploymentBefore === 'yes'} onChange={(e) => handleInputChange('section1', 'spouseEmploymentBefore', e.target.value)} />
                <TranslatedText>Yes</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="spouseEmploymentBefore" value="no" checked={formData.section1.spouseEmploymentBefore === 'no'} onChange={(e) => handleInputChange('section1', 'spouseEmploymentBefore', e.target.value)} />
                <TranslatedText>No</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
          {formData.section1.spouseEmploymentBefore === 'yes' && (
            <FormGroup>
              <TranslatedLabel text="If yes, please specify the husband/wife occupation prior to receiving the scheme benefit:" />
              <Input type="text" value={formData.section1.spouseOccupationBefore} onChange={(e) => handleInputChange('section1', 'spouseOccupationBefore', e.target.value)} placeholder={t("Enter spouse's occupation")} />
            </FormGroup>
          )}
        </QuestionCard>
        
        {/* Q27-30: Home & Marital Status */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Current residential address—" />
            <TextArea value={formData.section1.residentialAddress} onChange={(e) => handleInputChange('section1', 'residentialAddress', e.target.value)} placeholder={t('Enter your full residential address')} />
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="Are both applicants residents of Karnataka?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="bothKarnatakaResidents" value="yes" checked={formData.section1.bothKarnatakaResidents === 'yes'} onChange={(e) => handleInputChange('section1', 'bothKarnatakaResidents', e.target.value)} />
                <TranslatedText>Yes</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="bothKarnatakaResidents" value="no" checked={formData.section1.bothKarnatakaResidents === 'no'} onChange={(e) => handleInputChange('section1', 'bothKarnatakaResidents', e.target.value)} />
                <TranslatedText>No</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
          {formData.section1.bothKarnatakaResidents === 'no' && (
            <FormGroup>
              <TranslatedLabel text="If no, from which state? please specify" />
              <Input type="text" value={formData.section1.otherState} onChange={(e) => handleInputChange('section1', 'otherState', e.target.value)} placeholder={t('Enter state name')} />
            </FormGroup>
          )}
          <FormGroup>
            <TranslatedLabel text="Describe your home?" />
            <Select value={formData.section1.homeDescription} onChange={(e) => handleInputChange('section1', 'homeDescription', e.target.value)}>
              <TranslatedOption value="">{t('Select home type')}</TranslatedOption>
              <TranslatedOption value="own">{t('Own house')}</TranslatedOption>
              <TranslatedOption value="rented">{t('Rented house')}</TranslatedOption>
              <TranslatedOption value="leasehold">{t('Leasehold house')}</TranslatedOption>
              <TranslatedOption value="government_quarters">{t('Government Quarters')}</TranslatedOption>
              <TranslatedOption value="parents_house">{t("Parent's house")}</TranslatedOption>
              <TranslatedOption value="other">{t('Other – Please specify')}</TranslatedOption>
            </Select>
          </FormGroup>
          <FormGroup>
            <TranslatedLabel text="What is your current marital status?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="maritalStatus" value="living_together" checked={formData.section1.maritalStatus === 'living_together'} onChange={(e) => handleInputChange('section1', 'maritalStatus', e.target.value)} />
                <TranslatedText>Living together</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="maritalStatus" value="divorced" checked={formData.section1.maritalStatus === 'divorced'} onChange={(e) => handleInputChange('section1', 'maritalStatus', e.target.value)} />
                <TranslatedText>Divorced</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="maritalStatus" value="separated" checked={formData.section1.maritalStatus === 'separated'} onChange={(e) => handleInputChange('section1', 'maritalStatus', e.target.value)} />
                <TranslatedText>Separated</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="maritalStatus" value="death" checked={formData.section1.maritalStatus === 'death'} onChange={(e) => handleInputChange('section1', 'maritalStatus', e.target.value)} />
                <TranslatedText>Death of husband/wife</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="maritalStatus" value="remarried" checked={formData.section1.maritalStatus === 'remarried'} onChange={(e) => handleInputChange('section1', 'remarried', e.target.value)} />
                <TranslatedText>Remarried</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q31-34: Financial & Utilization */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="What is your family's annual income before receiving this benefit?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="familyAnnualIncome" value="below_50k" checked={formData.section1.familyAnnualIncome === 'below_50k'} onChange={(e) => handleInputChange('section1', 'familyAnnualIncome', e.target.value)} />
                <TranslatedText>Below ₹50,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="familyAnnualIncome" value="50k_1l" checked={formData.section1.familyAnnualIncome === '50k_1l'} onChange={(e) => handleInputChange('section1', 'familyAnnualIncome', e.target.value)} />
                <TranslatedText>₹50,001 – ₹1,00,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="familyAnnualIncome" value="1l_2l" checked={formData.section1.familyAnnualIncome === '1l_2l'} onChange={(e) => handleInputChange('section1', 'familyAnnualIncome', e.target.value)} />
                <TranslatedText>₹1,00,001 – ₹2,00,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="familyAnnualIncome" value="2l_3l" checked={formData.section1.familyAnnualIncome === '2l_3l'} onChange={(e) => handleInputChange('section1', 'familyAnnualIncome', e.target.value)} />
                <TranslatedText>₹2,00,001 – ₹3,00,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="familyAnnualIncome" value="3l_5l" checked={formData.section1.familyAnnualIncome === '3l_5l'} onChange={(e) => handleInputChange('section1', 'familyAnnualIncome', e.target.value)} />
                <TranslatedText>₹3,00,001 – ₹5,00,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="familyAnnualIncome" value="above_5l" checked={formData.section1.familyAnnualIncome === 'above_5l'} onChange={(e) => handleInputChange('section1', 'familyAnnualIncome', e.target.value)} />
                <TranslatedText>Above ₹5,00,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="familyAnnualIncome" value="prefer_not_to_say" checked={formData.section1.familyAnnualIncome === 'prefer_not_to_say'} onChange={(e) => handleInputChange('section1', 'familyAnnualIncome', e.target.value)} />
                <TranslatedText>Prefer not to say</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>

          <FormGroup>
            <TranslatedLabel text="Have you received benefits from any other economic development schemes (such as those offered by SWD Corporations) other than various marriage incentives?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="otherSchemeBenefits" value="yes" checked={formData.section1.otherSchemeBenefits === 'yes'} onChange={(e) => handleInputChange('section1', 'otherSchemeBenefits', e.target.value)} />
                <TranslatedText>Yes</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="otherSchemeBenefits" value="no" checked={formData.section1.otherSchemeBenefits === 'no'} onChange={(e) => handleInputChange('section1', 'otherSchemeBenefits', e.target.value)} />
                <TranslatedText>No</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
          {formData.section1.otherSchemeBenefits === 'yes' && (
            <FormGroup>
              <TranslatedLabel text="If Yes, please specify the name(s) of the scheme(s):" />
              <Input type="text" value={formData.section1.otherSchemeNames} onChange={(e) => handleInputChange('section1', 'otherSchemeNames', e.target.value)} placeholder={t('Enter scheme names')} />
            </FormGroup>
          )}

          <FormGroup>
            <TranslatedLabel text="How have you utilized the benefits received under various marriage incentive schemes?" />
            <CheckboxGroup>
              <CheckboxItem>
                <Checkbox checked={formData.section1.utilization.includes('housing')} onChange={(e) => handleCheckboxChange('section1', 'utilization', 'housing', e.target.checked)} />
                <TranslatedText>Housing</TranslatedText>
              </CheckboxItem>
              <CheckboxItem>
                <Checkbox checked={formData.section1.utilization.includes('business')} onChange={(e) => handleCheckboxChange('section1', 'utilization', 'business', e.target.checked)} />
                <TranslatedText>Starting or expanding a business</TranslatedText>
              </CheckboxItem>
              <CheckboxItem>
                <Checkbox checked={formData.section1.utilization.includes('education_expenses')} onChange={(e) => handleCheckboxChange('section1', 'utilization', 'education_expenses', e.target.checked)} />
                <TranslatedText>Education expenses</TranslatedText>
              </CheckboxItem>
              <CheckboxItem>
                <Checkbox checked={formData.section1.utilization.includes('medical_needs')} onChange={(e) => handleCheckboxChange('section1', 'utilization', 'medical_needs', e.target.checked)} />
                <TranslatedText>Medical needs</TranslatedText>
              </CheckboxItem>
              <CheckboxItem>
                <Checkbox checked={formData.section1.utilization.includes('daily_expenses')} onChange={(e) => handleCheckboxChange('section1', 'utilization', 'daily_expenses', e.target.checked)} />
                <TranslatedText>Daily household expenses</TranslatedText>
              </CheckboxItem>
              <CheckboxItem>
                <Checkbox checked={formData.section1.utilization.includes('savings')} onChange={(e) => handleCheckboxChange('section1', 'utilization', 'savings', e.target.checked)} />
                <TranslatedText>Savings (e.g., Fixed Deposit)</TranslatedText>
              </CheckboxItem>
              <CheckboxItem>
                <Checkbox checked={formData.section1.utilization.includes('other')} onChange={(e) => handleCheckboxChange('section1', 'utilization', 'other', e.target.checked)} />
                <TranslatedText>Others: Specify</TranslatedText>
              </CheckboxItem>
            </CheckboxGroup>
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
      <ModernSectionTitle>{t('Section 2: Socio-Economic & Social Impact')}</ModernSectionTitle>
      <ModernSectionDesc>{t('Please provide details about the changes after receiving the scheme benefit.')}</ModernSectionDesc>
    </ModernSectionHeader>
    <SectionContent>
      <QuestionGroup>

        {/* Q1: Applicant's current source of income */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="What is your current source of income or occupation after receiving the scheme benefit?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="applicantOccupationAfter" value="government_job" checked={formData.section2.applicantOccupationAfter === 'government_job'} onChange={(e) => handleInputChange('section2', 'applicantOccupationAfter', e.target.value)} />
                <TranslatedText>Government job</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="applicantOccupationAfter" value="private_job" checked={formData.section2.applicantOccupationAfter === 'private_job'} onChange={(e) => handleInputChange('section2', 'applicantOccupationAfter', e.target.value)} />
                <TranslatedText>Private job</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="applicantOccupationAfter" value="self_employment" checked={formData.section2.applicantOccupationAfter === 'self_employment'} onChange={(e) => handleInputChange('section2', 'applicantOccupationAfter', e.target.value)} />
                <TranslatedText>Self-employment (e.g., business, tailoring, etc.)</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="applicantOccupationAfter" value="daily_wage_labour" checked={formData.section2.applicantOccupationAfter === 'daily_wage_labour'} onChange={(e) => handleInputChange('section2', 'applicantOccupationAfter', e.target.value)} />
                <TranslatedText>Daily wage labour</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="applicantOccupationAfter" value="agriculture" checked={formData.section2.applicantOccupationAfter === 'agriculture'} onChange={(e) => handleInputChange('section2', 'applicantOccupationAfter', e.target.value)} />
                <TranslatedText>Agriculture/Farming</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="applicantOccupationAfter" value="homemaker" checked={formData.section2.applicantOccupationAfter === 'homemaker'} onChange={(e) => handleInputChange('section2', 'applicantOccupationAfter', e.target.value)} />
                <TranslatedText>Homemaker (No personal income)</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="applicantOccupationAfter" value="unemployed" checked={formData.section2.applicantOccupationAfter === 'unemployed'} onChange={(e) => handleInputChange('section2', 'applicantOccupationAfter', e.target.value)} />
                <TranslatedText>Unemployed</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="applicantOccupationAfter" value="other" checked={formData.section2.applicantOccupationAfter === 'other'} onChange={(e) => handleInputChange('section2', 'applicantOccupationAfter', e.target.value)} />
                <TranslatedText>Other (Please specify)</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
          {formData.section2.applicantOccupationAfter === 'other' && (
            <FormGroup>
              <Input type="text" value={formData.section2.applicantOccupationAfterOther} onChange={(e) => handleInputChange('section2', 'applicantOccupationAfterOther', e.target.value)} placeholder={t('Specify other occupation')} />
            </FormGroup>
          )}
        </QuestionCard>

        {/* Q2: Spouse's current source of income */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="What is your husband/wife current source of income or occupation after receiving the scheme benefit?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="spouseOccupationAfter" value="government_job" checked={formData.section2.spouseOccupationAfter === 'government_job'} onChange={(e) => handleInputChange('section2', 'spouseOccupationAfter', e.target.value)} />
                <TranslatedText>Government job</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="spouseOccupationAfter" value="private_job" checked={formData.section2.spouseOccupationAfter === 'private_job'} onChange={(e) => handleInputChange('section2', 'spouseOccupationAfter', e.target.value)} />
                <TranslatedText>Private job</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="spouseOccupationAfter" value="self_employment" checked={formData.section2.spouseOccupationAfter === 'self_employment'} onChange={(e) => handleInputChange('section2', 'spouseOccupationAfter', e.target.value)} />
                <TranslatedText>Self-employment (e.g., business, tailoring, etc.)</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="spouseOccupationAfter" value="daily_wage_labour" checked={formData.section2.spouseOccupationAfter === 'daily_wage_labour'} onChange={(e) => handleInputChange('section2', 'spouseOccupationAfter', e.target.value)} />
                <TranslatedText>Daily wage labour</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="spouseOccupationAfter" value="agriculture" checked={formData.section2.spouseOccupationAfter === 'agriculture'} onChange={(e) => handleInputChange('section2', 'spouseOccupationAfter', e.target.value)} />
                <TranslatedText>Agriculture/Farming</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="spouseOccupationAfter" value="homemaker" checked={formData.section2.spouseOccupationAfter === 'homemaker'} onChange={(e) => handleInputChange('section2', 'spouseOccupationAfter', e.target.value)} />
                <TranslatedText>Homemaker (No personal income)</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="spouseOccupationAfter" value="unemployed" checked={formData.section2.spouseOccupationAfter === 'unemployed'} onChange={(e) => handleInputChange('section2', 'spouseOccupationAfter', e.target.value)} />
                <TranslatedText>Unemployed</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="spouseOccupationAfter" value="other" checked={formData.section2.spouseOccupationAfter === 'other'} onChange={(e) => handleInputChange('section2', 'spouseOccupationAfter', e.target.value)} />
                <TranslatedText>Other (Please specify)</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
          {formData.section2.spouseOccupationAfter === 'other' && (
            <FormGroup>
              <Input type="text" value={formData.section2.spouseOccupationAfterOther} onChange={(e) => handleInputChange('section2', 'spouseOccupationAfterOther', e.target.value)} placeholder={t('Specify other occupation')} />
            </FormGroup>
          )}
        </QuestionCard>

        {/* Q3: Household's combined annual income */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="What is your household's combined annual income after receiving the scheme benefit / at present?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="householdAnnualIncomeAfter" value="below_50k" checked={formData.section2.householdAnnualIncomeAfter === 'below_50k'} onChange={(e) => handleInputChange('section2', 'householdAnnualIncomeAfter', e.target.value)} />
                <TranslatedText>Below ₹50,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="householdAnnualIncomeAfter" value="50k_1l" checked={formData.section2.householdAnnualIncomeAfter === '50k_1l'} onChange={(e) => handleInputChange('section2', 'householdAnnualIncomeAfter', e.target.value)} />
                <TranslatedText>₹50,001 – ₹1,00,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="householdAnnualIncomeAfter" value="1l_2l" checked={formData.section2.householdAnnualIncomeAfter === '1l_2l'} onChange={(e) => handleInputChange('section2', 'householdAnnualIncomeAfter', e.target.value)} />
                <TranslatedText>₹1,00,001 – ₹2,00,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="householdAnnualIncomeAfter" value="2l_3l" checked={formData.section2.householdAnnualIncomeAfter === '2l_3l'} onChange={(e) => handleInputChange('section2', 'householdAnnualIncomeAfter', e.target.value)} />
                <TranslatedText>₹2,00,001 – ₹3,00,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="householdAnnualIncomeAfter" value="3l_5l" checked={formData.section2.householdAnnualIncomeAfter === '3l_5l'} onChange={(e) => handleInputChange('section2', 'householdAnnualIncomeAfter', e.target.value)} />
                <TranslatedText>₹3,00,001 – ₹5,00,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="householdAnnualIncomeAfter" value="above_5l" checked={formData.section2.householdAnnualIncomeAfter === 'above_5l'} onChange={(e) => handleInputChange('section2', 'householdAnnualIncomeAfter', e.target.value)} />
                <TranslatedText>Above ₹5,00,000</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="householdAnnualIncomeAfter" value="prefer_not_to_say" checked={formData.section2.householdAnnualIncomeAfter === 'prefer_not_to_say'} onChange={(e) => handleInputChange('section2', 'householdAnnualIncomeAfter', e.target.value)} />
                <TranslatedText>Prefer not to say</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q4: Standard of living improved */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Has your standard of living improved since receiving the scheme benefit?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="standardOfLivingImproved" value="significantly_improved" checked={formData.section2.standardOfLivingImproved === 'significantly_improved'} onChange={(e) => handleInputChange('section2', 'standardOfLivingImproved', e.target.value)} />
                <TranslatedText>Significantly improved</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="standardOfLivingImproved" value="somewhat_improved" checked={formData.section2.standardOfLivingImproved === 'somewhat_improved'} onChange={(e) => handleInputChange('section2', 'standardOfLivingImproved', e.target.value)} />
                <TranslatedText>Somewhat improved</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="standardOfLivingImproved" value="no_change" checked={formData.section2.standardOfLivingImproved === 'no_change'} onChange={(e) => handleInputChange('section2', 'standardOfLivingImproved', e.target.value)} />
                <TranslatedText>No change</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="standardOfLivingImproved" value="declined" checked={formData.section2.standardOfLivingImproved === 'declined'} onChange={(e) => handleInputChange('section2', 'standardOfLivingImproved', e.target.value)} />
                <TranslatedText>Declined</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="standardOfLivingImproved" value="not_applicable" checked={formData.section2.standardOfLivingImproved === 'not_applicable'} onChange={(e) => handleInputChange('section2', 'standardOfLivingImproved', e.target.value)} />
                <TranslatedText>Not applicable</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q5: Access to basic needs */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Has your access to basic needs such as electricity, clean water, toilets, housing, cooking gas, or health services improved after receiving the scheme benefit?" />
            <RadioGroup>
              <RadioItem>
                <Radio name="accessToBasicNeeds" value="greatly_improved" checked={formData.section2.accessToBasicNeeds === 'greatly_improved'} onChange={(e) => handleInputChange('section2', 'accessToBasicNeeds', e.target.value)} />
                <TranslatedText>Greatly improved</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="accessToBasicNeeds" value="somewhat_improved" checked={formData.section2.accessToBasicNeeds === 'somewhat_improved'} onChange={(e) => handleInputChange('section2', 'accessToBasicNeeds', e.target.value)} />
                <TranslatedText>Somewhat improved</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="accessToBasicNeeds" value="no_change" checked={formData.section2.accessToBasicNeeds === 'no_change'} onChange={(e) => handleInputChange('section2', 'accessToBasicNeeds', e.target.value)} />
                <TranslatedText>No change</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="accessToBasicNeeds" value="got_worse" checked={formData.section2.accessToBasicNeeds === 'got_worse'} onChange={(e) => handleInputChange('section2', 'accessToBasicNeeds', e.target.value)} />
                <TranslatedText>Got worse</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="accessToBasicNeeds" value="not_applicable" checked={formData.section2.accessToBasicNeeds === 'not_applicable'} onChange={(e) => handleInputChange('section2', 'accessToBasicNeeds', e.target.value)} />
                <TranslatedText>Not applicable</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q6: Social life impact (Opinion) */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="The scheme has made a positive difference in my social life." />
            <RadioGroup>
              <RadioItem>
                <Radio name="socialLifeImpact" value="strongly_agree" checked={formData.section2.socialLifeImpact === 'strongly_agree'} onChange={(e) => handleInputChange('section2', 'socialLifeImpact', e.target.value)} />
                <TranslatedText>Strongly Agree</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="socialLifeImpact" value="agree" checked={formData.section2.socialLifeImpact === 'agree'} onChange={(e) => handleInputChange('section2', 'socialLifeImpact', e.target.value)} />
                <TranslatedText>Agree</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="socialLifeImpact" value="neutral" checked={formData.section2.socialLifeImpact === 'neutral'} onChange={(e) => handleInputChange('section2', 'socialLifeImpact', e.target.value)} />
                <TranslatedText>Neutral</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="socialLifeImpact" value="disagree" checked={formData.section2.socialLifeImpact === 'disagree'} onChange={(e) => handleInputChange('section2', 'socialLifeImpact', e.target.value)} />
                <TranslatedText>Disagree</TranslatedText>
              </RadioItem>
              <RadioItem>
                <Radio name="socialLifeImpact" value="strongly_disagree" checked={formData.section2.socialLifeImpact === 'strongly_disagree'} onChange={(e) => handleInputChange('section2', 'socialLifeImpact', e.target.value)} />
                <TranslatedText>Strongly Disagree</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>
        
      </QuestionGroup>
    </SectionContent>
  </>
)}

       {currentSection === 3 && (
    <>
        <ModernSectionHeader>
            <ModernSectionTitle>{t('Section 3: Social Inclusion & Security')}</ModernSectionTitle>
            <ModernSectionDesc>{t('Please answer questions about the social impact of your marriage.')}</ModernSectionDesc>
        </ModernSectionHeader>
        <SectionContent>
            <QuestionGroup>

                {/* Q1: Did your family oppose the marriage? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Did your family or your husband/wife's family oppose the marriage?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="familyOpposedMarriage" value="yes" checked={formData.section3.familyOpposedMarriage === 'yes'} onChange={(e) => handleInputChange('section3', 'familyOpposedMarriage', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="familyOpposedMarriage" value="no" checked={formData.section3.familyOpposedMarriage === 'no'} onChange={(e) => handleInputChange('section3', 'familyOpposedMarriage', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                    {formData.section3.familyOpposedMarriage === 'yes' && (
                        <FormGroup>
                            <TranslatedLabel text="If Yes, who opposed the marriage?" />
                            <RadioGroup>
                                <RadioItem>
                                    <Radio name="whoOpposed" value="your_family" checked={formData.section3.whoOpposed === 'your_family'} onChange={(e) => handleInputChange('section3', 'whoOpposed', e.target.value)} />
                                    <TranslatedText>Your family</TranslatedText>
                                </RadioItem>
                                <RadioItem>
                                    <Radio name="whoOpposed" value="spouse_family" checked={formData.section3.whoOpposed === 'spouse_family'} onChange={(e) => handleInputChange('section3', 'whoOpposed', e.target.value)} />
                                    <TranslatedText>Husband/wife's family</TranslatedText>
                                </RadioItem>
                                <RadioItem>
                                    <Radio name="whoOpposed" value="both_families" checked={formData.section3.whoOpposed === 'both_families'} onChange={(e) => handleInputChange('section3', 'whoOpposed', e.target.value)} />
                                    <TranslatedText>Both families</TranslatedText>
                                </RadioItem>
                                <RadioItem>
                                    <Radio name="whoOpposed" value="other" checked={formData.section3.whoOpposed === 'other'} onChange={(e) => handleInputChange('section3', 'whoOpposed', e.target.value)} />
                                    <TranslatedText>Other (Please specify)</TranslatedText>
                                </RadioItem>
                            </RadioGroup>
                            {formData.section3.whoOpposed === 'other' && (
                                <Input type="text" value={formData.section3.whoOpposedOther || ''} onChange={(e) => handleInputChange('section3', 'whoOpposedOther', e.target.value)} placeholder={t('Specify other source of opposition')} />
                            )}
                        </FormGroup>
                    )}
                </QuestionCard>

                {/* Q2 & Q3: Reactions */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="How did your extended family react to your marriage?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="extendedFamilyReaction" value="supportive" checked={formData.section3.extendedFamilyReaction === 'supportive'} onChange={(e) => handleInputChange('section3', 'extendedFamilyReaction', e.target.value)} />
                                <TranslatedText>Supportive</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="extendedFamilyReaction" value="opposed" checked={formData.section3.extendedFamilyReaction === 'opposed'} onChange={(e) => handleInputChange('section3', 'extendedFamilyReaction', e.target.value)} />
                                <TranslatedText>Opposed</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="extendedFamilyReaction" value="neutral" checked={formData.section3.extendedFamilyReaction === 'neutral'} onChange={(e) => handleInputChange('section3', 'extendedFamilyReaction', e.target.value)} />
                                <TranslatedText>Neutral</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="extendedFamilyReaction" value="mixed" checked={formData.section3.extendedFamilyReaction === 'mixed'} onChange={(e) => handleInputChange('section3', 'extendedFamilyReaction', e.target.value)} />
                                <TranslatedText>Mixed Reaction</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="extendedFamilyReaction" value="others" checked={formData.section3.extendedFamilyReaction === 'others'} onChange={(e) => handleInputChange('section3', 'extendedFamilyReaction', e.target.value)} />
                                <TranslatedText>Others</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                    <FormGroup>
                        <TranslatedLabel text="How did your neighbours and your village react to your marriage?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="neighboursReaction" value="supportive" checked={formData.section3.neighboursReaction === 'supportive'} onChange={(e) => handleInputChange('section3', 'neighboursReaction', e.target.value)} />
                                <TranslatedText>Supportive</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="neighboursReaction" value="opposed" checked={formData.section3.neighboursReaction === 'opposed'} onChange={(e) => handleInputChange('section3', 'neighboursReaction', e.target.value)} />
                                <TranslatedText>Opposed</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="neighboursReaction" value="neutral" checked={formData.section3.neighboursReaction === 'neutral'} onChange={(e) => handleInputChange('section3', 'neighboursReaction', e.target.value)} />
                                <TranslatedText>Neutral</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="neighboursReaction" value="mixed" checked={formData.section3.neighboursReaction === 'mixed'} onChange={(e) => handleInputChange('section3', 'neighboursReaction', e.target.value)} />
                                <TranslatedText>Mixed Reaction</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="neighboursReaction" value="others" checked={formData.section3.neighboursReaction === 'others'} onChange={(e) => handleInputChange('section3', 'neighboursReaction', e.target.value)} />
                                <TranslatedText>Others</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q4: Inter-caste marriages in community */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Have there been any inter-caste marriages in your family or community?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="interCasteMarriagesInCommunity" value="yes" checked={formData.section3.interCasteMarriagesInCommunity === 'yes'} onChange={(e) => handleInputChange('section3', 'interCasteMarriagesInCommunity', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="interCasteMarriagesInCommunity" value="no" checked={formData.section3.interCasteMarriagesInCommunity === 'no'} onChange={(e) => handleInputChange('section3', 'interCasteMarriagesInCommunity', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q5: Challenges after marriage */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Did you and your husband/wife face any challenges after marriage?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="challengesAfterMarriage" value="yes" checked={formData.section3.challengesAfterMarriage === 'yes'} onChange={(e) => handleInputChange('section3', 'challengesAfterMarriage', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="challengesAfterMarriage" value="no" checked={formData.section3.challengesAfterMarriage === 'no'} onChange={(e) => handleInputChange('section3', 'challengesAfterMarriage', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                    {formData.section3.challengesAfterMarriage === 'yes' && (
                        <FormGroup>
                            <TranslatedLabel text="If Yes, what kind of challenges did you face? (Select all that apply):" />
                            <CheckboxGroup>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.challengesList?.includes('financial_difficulties')} onChange={(e) => handleCheckboxChange('section3', 'challengesList', 'financial_difficulties', e.target.checked)} />
                                    <TranslatedText>Financial difficulties</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.challengesList?.includes('family_opposition')} onChange={(e) => handleCheckboxChange('section3', 'challengesList', 'family_opposition', e.target.checked)} />
                                    <TranslatedText>Family opposition</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.challengesList?.includes('social_discrimination')} onChange={(e) => handleCheckboxChange('section3', 'challengesList', 'social_discrimination', e.target.checked)} />
                                    <TranslatedText>Social discrimination or stigma</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.challengesList?.includes('legal_issues')} onChange={(e) => handleCheckboxChange('section3', 'challengesList', 'legal_issues', e.target.checked)} />
                                    <TranslatedText>Legal issues</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.challengesList?.includes('lack_of_community_support')} onChange={(e) => handleCheckboxChange('section3', 'challengesList', 'lack_of_community_support', e.target.checked)} />
                                    <TranslatedText>Lack of community support</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.challengesList?.includes('emotional_stress')} onChange={(e) => handleCheckboxChange('section3', 'challengesList', 'emotional_stress', e.target.checked)} />
                                    <TranslatedText>Emotional or mental stress</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.challengesList?.includes('other')} onChange={(e) => handleCheckboxChange('section3', 'challengesList', 'other', e.target.checked)} />
                                    <TranslatedText>Other (Please specify)</TranslatedText>
                                </CheckboxItem>
                            </CheckboxGroup>
                            {formData.section3.challengesList?.includes('other') && (
                                <Input type="text" value={formData.section3.challengesOther || ''} onChange={(e) => handleInputChange('section3', 'challengesOther', e.target.value)} placeholder={t('Specify other challenges')} />
                            )}
                        </FormGroup>
                    )}
                </QuestionCard>

                {/* Q6: Domestic violence */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Have there been any instances of domestic violence after receiving the scheme benefit?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="domesticViolence" value="yes" checked={formData.section3.domesticViolence === 'yes'} onChange={(e) => handleInputChange('section3', 'domesticViolence', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="domesticViolence" value="no" checked={formData.section3.domesticViolence === 'no'} onChange={(e) => handleInputChange('section3', 'domesticViolence', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="domesticViolence" value="prefer_not_to_say" checked={formData.section3.domesticViolence === 'prefer_not_to_say'} onChange={(e) => handleInputChange('section3', 'domesticViolence', e.target.value)} />
                                <TranslatedText>Prefer not to say</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q7: Relocated to new place? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Did you relocate to a new place after your marriage?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="relocatedAfterMarriage" value="yes" checked={formData.section3.relocatedAfterMarriage === 'yes'} onChange={(e) => handleInputChange('section3', 'relocatedAfterMarriage', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="relocatedAfterMarriage" value="no" checked={formData.section3.relocatedAfterMarriage === 'no'} onChange={(e) => handleInputChange('section3', 'relocatedAfterMarriage', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                    {formData.section3.relocatedAfterMarriage === 'yes' && (
                        <FormGroup>
                            <TranslatedLabel text="If Yes, what was the main reason for relocating?" />
                            <RadioGroup>
                                <RadioItem>
                                    <Radio name="relocationReason" value="family_opposed" checked={formData.section3.relocationReason === 'family_opposed'} onChange={(e) => handleInputChange('section3', 'relocationReason', e.target.value)} />
                                    <TranslatedText>Because family and neighbours are opposed to the marriage</TranslatedText>
                                </RadioItem>
                                <RadioItem>
                                    <Radio name="relocationReason" value="better_job" checked={formData.section3.relocationReason === 'better_job'} onChange={(e) => handleInputChange('section3', 'relocationReason', e.target.value)} />
                                    <TranslatedText>To find better job opportunities</TranslatedText>
                                </RadioItem>
                                <RadioItem>
                                    <Radio name="relocationReason" value="lack_of_acceptance" checked={formData.section3.relocationReason === 'lack_of_acceptance'} onChange={(e) => handleInputChange('section3', 'relocationReason', e.target.value)} />
                                    <TranslatedText>Due to lack of acceptance in native place</TranslatedText>
                                </RadioItem>
                                <RadioItem>
                                    <Radio name="relocationReason" value="new_life" checked={formData.section3.relocationReason === 'new_life'} onChange={(e) => handleInputChange('section3', 'relocationReason', e.target.value)} />
                                    <TranslatedText>To start a new life independently</TranslatedText>
                                </RadioItem>
                                <RadioItem>
                                    <Radio name="relocationReason" value="other" checked={formData.section3.relocationReason === 'other'} onChange={(e) => handleInputChange('section3', 'relocationReason', e.target.value)} />
                                    <TranslatedText>Other (Please specify)</TranslatedText>
                                </RadioItem>
                            </RadioGroup>
                            {formData.section3.relocationReason === 'other' && (
                                <Input type="text" value={formData.section3.relocationReasonOther || ''} onChange={(e) => handleInputChange('section3', 'relocationReasonOther', e.target.value)} placeholder={t('Specify other reason')} />
                            )}
                        </FormGroup>
                    )}
                </QuestionCard>

                {/* Q8: Police complaint? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Has any police complaint ever been filed against you because of your marriage?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="policeComplaint" value="yes" checked={formData.section3.policeComplaint === 'yes'} onChange={(e) => handleInputChange('section3', 'policeComplaint', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="policeComplaint" value="no" checked={formData.section3.policeComplaint === 'no'} onChange={(e) => handleInputChange('section3', 'policeComplaint', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                    {formData.section3.policeComplaint === 'yes' && (
                        <FormGroup>
                            <TranslatedLabel text="If Yes, provide details (optional):" />
                            <TextArea value={formData.section3.policeComplaintDetails || ''} onChange={(e) => handleInputChange('section3', 'policeComplaintDetails', e.target.value)} placeholder={t('Provide details of the police complaint')} />
                        </FormGroup>
                    )}
                </QuestionCard>

                {/* Q9: Harassment source */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Who mainly caused the caste-based harassment you faced?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="harassmentCausedBy" value="your_family" checked={formData.section3.harassmentCausedBy === 'your_family'} onChange={(e) => handleInputChange('section3', 'harassmentCausedBy', e.target.value)} />
                                <TranslatedText>Your family members</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="harassmentCausedBy" value="spouse_family" checked={formData.section3.harassmentCausedBy === 'spouse_family'} onChange={(e) => handleInputChange('section3', 'harassmentCausedBy', e.target.value)} />
                                <TranslatedText>Your husband/wife’s family members</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="harassmentCausedBy" value="neighbours" checked={formData.section3.harassmentCausedBy === 'neighbours'} onChange={(e) => handleInputChange('section3', 'harassmentCausedBy', e.target.value)} />
                                <TranslatedText>Neighbours/villagers</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="harassmentCausedBy" value="religious_groups" checked={formData.section3.harassmentCausedBy === 'religious_groups'} onChange={(e) => handleInputChange('section3', 'harassmentCausedBy', e.target.value)} />
                                <TranslatedText>Religious or social groups</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="harassmentCausedBy" value="others" checked={formData.section3.harassmentCausedBy === 'others'} onChange={(e) => handleInputChange('section3', 'harassmentCausedBy', e.target.value)} />
                                <TranslatedText>Others (Please specify)</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                        {formData.section3.harassmentCausedBy === 'others' && (
                            <Input type="text" value={formData.section3.harassmentCausedByOther || ''} onChange={(e) => handleInputChange('section3', 'harassmentCausedByOther', e.target.value)} placeholder={t('Specify others')} />
                        )}
                    </FormGroup>
                </QuestionCard>

                {/* Q10: Discrimination ways */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="In what ways did you experience discrimination or mistreatment? (Select all that apply)" />
                        <CheckboxGroup>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.discriminationWays?.includes('verbal_abuse')} onChange={(e) => handleCheckboxChange('section3', 'discriminationWays', 'verbal_abuse', e.target.checked)} />
                                <TranslatedText>Verbal abuse</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.discriminationWays?.includes('physical_assault')} onChange={(e) => handleCheckboxChange('section3', 'discriminationWays', 'physical_assault', e.target.checked)} />
                                <TranslatedText>Physical assault</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.discriminationWays?.includes('social_boycott')} onChange={(e) => handleCheckboxChange('section3', 'discriminationWays', 'social_boycott', e.target.checked)} />
                                <TranslatedText>Social boycott</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.discriminationWays?.includes('denial_of_property')} onChange={(e) => handleCheckboxChange('section3', 'discriminationWays', 'denial_of_property', e.target.checked)} />
                                <TranslatedText>Denial of property or housing</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.discriminationWays?.includes('threats_to_life')} onChange={(e) => handleCheckboxChange('section3', 'discriminationWays', 'threats_to_life', e.target.checked)} />
                                <TranslatedText>Threats to life</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.discriminationWays?.includes('false_legal_complaints')} onChange={(e) => handleCheckboxChange('section3', 'discriminationWays', 'false_legal_complaints', e.target.checked)} />
                                <TranslatedText>False legal complaints</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.discriminationWays?.includes('other')} onChange={(e) => handleCheckboxChange('section3', 'discriminationWays', 'other', e.target.checked)} />
                                <TranslatedText>Other (Please specify)</TranslatedText>
                            </CheckboxItem>
                        </CheckboxGroup>
                        {formData.section3.discriminationWays?.includes('other') && (
                            <Input type="text" value={formData.section3.discriminationWaysOther || ''} onChange={(e) => handleInputChange('section3', 'discriminationWaysOther', e.target.value)} placeholder={t('Specify other forms of mistreatment')} />
                        )}
                    </FormGroup>
                </QuestionCard>

                {/* Q11: Gained recognition? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Do you feel that you have gained recognition in the society because of receiving the scheme benefit?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="gainedRecognition" value="yes" checked={formData.section3.gainedRecognition === 'yes'} onChange={(e) => handleInputChange('section3', 'gainedRecognition', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="gainedRecognition" value="no" checked={formData.section3.gainedRecognition === 'no'} onChange={(e) => handleInputChange('section3', 'gainedRecognition', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                    {formData.section3.gainedRecognition === 'yes' && (
                        <FormGroup>
                            <TranslatedLabel text="If Yes, in what ways? (Select all that apply):" />
                            <CheckboxGroup>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.recognitionWays?.includes('better_family_response')} onChange={(e) => handleCheckboxChange('section3', 'recognitionWays', 'better_family_response', e.target.checked)} />
                                    <TranslatedText>Better response/relationship from family members</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.recognitionWays?.includes('greater_respect_community')} onChange={(e) => handleCheckboxChange('section3', 'recognitionWays', 'greater_respect_community', e.target.checked)} />
                                    <TranslatedText>Greater respect in the community</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.recognitionWays?.includes('more_support_neighbours')} onChange={(e) => handleCheckboxChange('section3', 'recognitionWays', 'more_support_neighbours', e.target.checked)} />
                                    <TranslatedText>More support from neighbours and local people</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.recognitionWays?.includes('social_programs_opportunity')} onChange={(e) => handleCheckboxChange('section3', 'recognitionWays', 'social_programs_opportunity', e.target.checked)} />
                                    <TranslatedText>Opportunity to participate in social programs</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.recognitionWays?.includes('recognition_local_admin')} onChange={(e) => handleCheckboxChange('section3', 'recognitionWays', 'recognition_local_admin', e.target.checked)} />
                                    <TranslatedText>Recognition from local administration</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.recognitionWays?.includes('other')} onChange={(e) => handleCheckboxChange('section3', 'recognitionWays', 'other', e.target.checked)} />
                                    <TranslatedText>Other (Please specify)</TranslatedText>
                                </CheckboxItem>
                            </CheckboxGroup>
                            {formData.section3.recognitionWays?.includes('other') && (
                                <Input type="text" value={formData.section3.recognitionWaysOther || ''} onChange={(e) => handleInputChange('section3', 'recognitionWaysOther', e.target.value)} placeholder={t('Specify other ways of recognition')} />
                            )}
                        </FormGroup>
                    )}
                </QuestionCard>
                
                {/* Q12: Cordial relationship with in-laws? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Has receiving the benefit enabled you to have a cordial relationship with your in-laws?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="cordialRelationshipInLaws" value="yes" checked={formData.section3.cordialRelationshipInLaws === 'yes'} onChange={(e) => handleInputChange('section3', 'cordialRelationshipInLaws', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="cordialRelationshipInLaws" value="no" checked={formData.section3.cordialRelationshipInLaws === 'no'} onChange={(e) => handleInputChange('section3', 'cordialRelationshipInLaws', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="cordialRelationshipInLaws" value="not_applicable" checked={formData.section3.cordialRelationshipInLaws === 'not_applicable'} onChange={(e) => handleInputChange('section3', 'cordialRelationshipInLaws', e.target.value)} />
                                <TranslatedText>Not applicable</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                    {formData.section3.cordialRelationshipInLaws === 'yes' && (
                        <FormGroup>
                            <TranslatedLabel text="If Yes, in what ways? (Select all that apply):" />
                            <CheckboxGroup>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.cordialRelationshipWays?.includes('reduced_financial_burden')} onChange={(e) => handleCheckboxChange('section3', 'cordialRelationshipWays', 'reduced_financial_burden', e.target.checked)} />
                                    <TranslatedText>Reduced financial burden on the household</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.cordialRelationshipWays?.includes('improved_mutual_respect')} onChange={(e) => handleCheckboxChange('section3', 'cordialRelationshipWays', 'improved_mutual_respect', e.target.checked)} />
                                    <TranslatedText>Improved mutual respect and relationships</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.cordialRelationshipWays?.includes('greater_involvement_decisions')} onChange={(e) => handleCheckboxChange('section3', 'cordialRelationshipWays', 'greater_involvement_decisions', e.target.checked)} />
                                    <TranslatedText>Greater involvement in family decisions</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.cordialRelationshipWays?.includes('better_living_conditions')} onChange={(e) => handleCheckboxChange('section3', 'cordialRelationshipWays', 'better_living_conditions', e.target.checked)} />
                                    <TranslatedText>Better living conditions (e.g., housing, other amenities)</TranslatedText>
                                </CheckboxItem>
                                <CheckboxItem>
                                    <Checkbox checked={formData.section3.cordialRelationshipWays?.includes('other')} onChange={(e) => handleCheckboxChange('section3', 'cordialRelationshipWays', 'other', e.target.checked)} />
                                    <TranslatedText>Other (Please specify)</TranslatedText>
                                </CheckboxItem>
                            </CheckboxGroup>
                            {formData.section3.cordialRelationshipWays?.includes('other') && (
                                <Input type="text" value={formData.section3.cordialRelationshipWaysOther || ''} onChange={(e) => handleInputChange('section3', 'cordialRelationshipWaysOther', e.target.value)} placeholder={t('Specify other ways')} />
                            )}
                        </FormGroup>
                    )}
                </QuestionCard>

                {/* Q13: Public opinion change */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="This scheme has helped bring about a positive and progressive change in public opinion regarding inter-caste marriages, widow remarriage, Ex Devadasi children’s marriages, and inter-sub-caste marriages." />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="progressiveChangePublicOpinion" value="strongly_disagree" checked={formData.section3.progressiveChangePublicOpinion === 'strongly_disagree'} onChange={(e) => handleInputChange('section3', 'progressiveChangePublicOpinion', e.target.value)} />
                                <TranslatedText>Strongly disagree</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="progressiveChangePublicOpinion" value="disagree" checked={formData.section3.progressiveChangePublicOpinion === 'disagree'} onChange={(e) => handleInputChange('section3', 'progressiveChangePublicOpinion', e.target.value)} />
                                <TranslatedText>Disagree</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="progressiveChangePublicOpinion" value="neutral" checked={formData.section3.progressiveChangePublicOpinion === 'neutral'} onChange={(e) => handleInputChange('section3', 'progressiveChangePublicOpinion', e.target.value)} />
                                <TranslatedText>Neutral</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="progressiveChangePublicOpinion" value="agree" checked={formData.section3.progressiveChangePublicOpinion === 'agree'} onChange={(e) => handleInputChange('section3', 'progressiveChangePublicOpinion', e.target.value)} />
                                <TranslatedText>Agree</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="progressiveChangePublicOpinion" value="strongly_agree" checked={formData.section3.progressiveChangePublicOpinion === 'strongly_agree'} onChange={(e) => handleInputChange('section3', 'progressiveChangePublicOpinion', e.target.value)} />
                                <TranslatedText>Strongly agree</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q14: Who supported you? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Who supported you during or after your marriage? (Select all that apply)" />
                        <CheckboxGroup>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.supportSource?.includes('parents')} onChange={(e) => handleCheckboxChange('section3', 'supportSource', 'parents', e.target.checked)} />
                                <TranslatedText>Parents or close family members</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.supportSource?.includes('friends')} onChange={(e) => handleCheckboxChange('section3', 'supportSource', 'friends', e.target.checked)} />
                                <TranslatedText>Friends</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.supportSource?.includes('spouse_family')} onChange={(e) => handleCheckboxChange('section3', 'supportSource', 'spouse_family', e.target.checked)} />
                                <TranslatedText>Husband/wife’s family</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.supportSource?.includes('community_leaders')} onChange={(e) => handleCheckboxChange('section3', 'supportSource', 'community_leaders', e.target.checked)} />
                                <TranslatedText>Community leaders or local representatives</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.supportSource?.includes('ngos')} onChange={(e) => handleCheckboxChange('section3', 'supportSource', 'ngos', e.target.checked)} />
                                <TranslatedText>NGOs or support organizations</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.supportSource?.includes('government_officials')} onChange={(e) => handleCheckboxChange('section3', 'supportSource', 'government_officials', e.target.checked)} />
                                <TranslatedText>Government officials</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.supportSource?.includes('no_one')} onChange={(e) => handleCheckboxChange('section3', 'supportSource', 'no_one', e.target.checked)} />
                                <TranslatedText>No one</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section3.supportSource?.includes('other')} onChange={(e) => handleCheckboxChange('section3', 'supportSource', 'other', e.target.checked)} />
                                <TranslatedText>Other (Please specify)</TranslatedText>
                            </CheckboxItem>
                        </CheckboxGroup>
                        {formData.section3.supportSource?.includes('other') && (
                            <Input type="text" value={formData.section3.supportSourceOther || ''} onChange={(e) => handleInputChange('section3', 'supportSourceOther', e.target.value)} placeholder={t('Specify other support source')} />
                        )}
                    </FormGroup>
                </QuestionCard>

                {/* Q15: Marriage influence on others */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Has your marriage influenced others in your community to consider or support similar marriages?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="marriageInfluence" value="yes" checked={formData.section3.marriageInfluence === 'yes'} onChange={(e) => handleInputChange('section3', 'marriageInfluence', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="marriageInfluence" value="no" checked={formData.section3.marriageInfluence === 'no'} onChange={(e) => handleInputChange('section3', 'marriageInfluence', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="marriageInfluence" value="not_sure" checked={formData.section3.marriageInfluence === 'not_sure'} onChange={(e) => handleInputChange('section3', 'marriageInfluence', e.target.value)} />
                                <TranslatedText>Not sure</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q16: Recommend scheme? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Would you suggest or recommend this scheme to others?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="recommendScheme" value="yes" checked={formData.section3.recommendScheme === 'yes'} onChange={(e) => handleInputChange('section3', 'recommendScheme', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="recommendScheme" value="no" checked={formData.section3.recommendScheme === 'no'} onChange={(e) => handleInputChange('section3', 'recommendScheme', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="recommendScheme" value="not_sure" checked={formData.section3.recommendScheme === 'not_sure'} onChange={(e) => handleInputChange('section3', 'recommendScheme', e.target.value)} />
                                <TranslatedText>Not sure</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q17: Feel safe? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Do you feel safe in your community after receiving the scheme benefit?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="safetyInCommunity" value="much_safer" checked={formData.section3.safetyInCommunity === 'much_safer'} onChange={(e) => handleInputChange('section3', 'safetyInCommunity', e.target.value)} />
                                <TranslatedText>Yes – Much safer</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="safetyInCommunity" value="slightly_safer" checked={formData.section3.safetyInCommunity === 'slightly_safer'} onChange={(e) => handleInputChange('section3', 'safetyInCommunity', e.target.value)} />
                                <TranslatedText>Yes – Slightly safer</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="safetyInCommunity" value="no_change" checked={formData.section3.safetyInCommunity === 'no_change'} onChange={(e) => handleInputChange('section3', 'safetyInCommunity', e.target.value)} />
                                <TranslatedText>No change</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="safetyInCommunity" value="less_safe" checked={formData.section3.safetyInCommunity === 'less_safe'} onChange={(e) => handleInputChange('section3', 'safetyInCommunity', e.target.value)} />
                                <TranslatedText>Feel less safe</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="safetyInCommunity" value="not_sure" checked={formData.section3.safetyInCommunity === 'not_sure'} onChange={(e) => handleInputChange('section3', 'safetyInCommunity', e.target.value)} />
                                <TranslatedText>Not sure</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q18: Opposition after benefit? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Have you faced any opposition or negative behaviour from your community/family/neighbours after receiving the scheme benefit?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="oppositionAfterBenefit" value="yes" checked={formData.section3.oppositionAfterBenefit === 'yes'} onChange={(e) => handleInputChange('section3', 'oppositionAfterBenefit', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="oppositionAfterBenefit" value="no" checked={formData.section3.oppositionAfterBenefit === 'no'} onChange={(e) => handleInputChange('section3', 'oppositionAfterBenefit', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="oppositionAfterBenefit" value="not_sure" checked={formData.section3.oppositionAfterBenefit === 'not_sure'} onChange={(e) => handleInputChange('section3', 'oppositionAfterBenefit', e.target.value)} />
                                <TranslatedText>Not sure</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                    {formData.section3.oppositionAfterBenefit === 'yes' && (
                        <FormGroup>
                            <TranslatedLabel text="If Yes, please specify:" />
                            <Input type="text" value={formData.section3.oppositionDetails || ''} onChange={(e) => handleInputChange('section3', 'oppositionDetails', e.target.value)} placeholder={t('Specify details of the opposition')} />
                        </FormGroup>
                    )}
                </QuestionCard>

            </QuestionGroup>
          </SectionContent>
        </>
    )}
    
        {/* Section 4: Awareness, Access & Quality of Service */}
{currentSection === 4 && (
  <>
    <ModernSectionHeader>
      <ModernSectionTitle>{t('Section 4: Awareness, Access & Quality of Service')}</ModernSectionTitle>
      <ModernSectionDesc>{t('This section will enable accurate information on awareness of benefits, application process, reasons for approval/rejection, and feedback on the quality of services received, as well as timely delivery and impact.')}</ModernSectionDesc>
    </ModernSectionHeader>
    <SectionContent>
      <QuestionGroup>

        {/* Q1: Who made you aware of this scheme? */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Who made you aware of this scheme?" />
            <RadioGroup>
              <RadioItem>
<Radio name="awarenessSource" value="government_official" checked={formData.section4.awarenessSource === 'government_official'} onChange={(e) => handleInputChange('section4', 'awarenessSource', e.target.value as AwarenessSource)} />
                <TranslatedText>Government official</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="awarenessSource" value="community_leader" checked={formData.section4.awarenessSource === 'community_leader'} onChange={(e) => handleInputChange('section4', 'awarenessSource', e.target.value as AwarenessSource)} />
                <TranslatedText>Community leader or local representative</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="awarenessSource" value="panchayat" checked={formData.section4.awarenessSource === 'panchayat'} onChange={(e) => handleInputChange('section4', 'awarenessSource', e.target.value as AwarenessSource)} />
                <TranslatedText>Panchayat or Ward Member</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="awarenessSource" value="friends_family" checked={formData.section4.awarenessSource === 'friends_family'} onChange={(e) => handleInputChange('section4', 'awarenessSource', e.target.value as AwarenessSource)} />
                <TranslatedText>Friends or family</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="awarenessSource" value="media" checked={formData.section4.awarenessSource === 'media'} onChange={(e) => handleInputChange('section4', 'awarenessSource', e.target.value as AwarenessSource)} />
                <TranslatedText>Television, radio, or newspaper</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="awarenessSource" value="social_media" checked={formData.section4.awarenessSource === 'social_media'} onChange={(e) => handleInputChange('section4', 'awarenessSource', e.target.value as AwarenessSource)} />
                <TranslatedText>Social media</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="awarenessSource" value="online_portal" checked={formData.section4.awarenessSource === 'online_portal'} onChange={(e) => handleInputChange('section4', 'awarenessSource', e.target.value as AwarenessSource)} />
                <TranslatedText>Online portal or app</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="awarenessSource" value="other" checked={formData.section4.awarenessSource === 'other'} onChange={(e) => handleInputChange('section4', 'awarenessSource', e.target.value as AwarenessSource)} />
                <TranslatedText>Other (Please specify)</TranslatedText>
              </RadioItem>
            </RadioGroup>
            {formData.section4.awarenessSource === 'other' && (
              <Input type="text" value={formData.section4.awarenessSourceOther || ''} onChange={(e) => handleInputChange('section4', 'awarenessSourceOther', e.target.value)} placeholder={t('Specify other source')} />
            )}
          </FormGroup>
        </QuestionCard>

        {/* Q2: How supportive were the officials? */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="How supportive were the officials during the application process?" />
            <RadioGroup>
              <RadioItem>
<Radio name="officialsSupportiveness" value="not_at_all" checked={formData.section4.officialsSupportiveness === 'not_at_all'} onChange={(e) => handleInputChange('section4', 'officialsSupportiveness', e.target.value as OfficialsSupportiveness)} />
                <TranslatedText>Not at all supportive</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="officialsSupportiveness" value="slightly" checked={formData.section4.officialsSupportiveness === 'slightly'} onChange={(e) => handleInputChange('section4', 'officialsSupportiveness', e.target.value as OfficialsSupportiveness)} />
                <TranslatedText>Slightly supportive</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="officialsSupportiveness" value="moderately" checked={formData.section4.officialsSupportiveness === 'moderately'} onChange={(e) => handleInputChange('section4', 'officialsSupportiveness', e.target.value as OfficialsSupportiveness)} />
                <TranslatedText>Moderately supportive</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="officialsSupportiveness" value="very" checked={formData.section4.officialsSupportiveness === 'very'} onChange={(e) => handleInputChange('section4', 'officialsSupportiveness', e.target.value as OfficialsSupportiveness)} />
                <TranslatedText>Very supportive</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="officialsSupportiveness" value="extremely" checked={formData.section4.officialsSupportiveness === 'extremely'} onChange={(e) => handleInputChange('section4', 'officialsSupportiveness', e.target.value as OfficialsSupportiveness)} />
                <TranslatedText>Extremely supportive</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q3: How easy or difficult was the application process? */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="How easy or difficult was the application process for the scheme?" />
            <RadioGroup>
              <RadioItem>
<Radio name="applicationProcessDifficulty" value="very_easy" checked={formData.section4.applicationProcessDifficulty === 'very_easy'} onChange={(e) => handleInputChange('section4', 'applicationProcessDifficulty', e.target.value as ApplicationProcessDifficulty)} />
                <TranslatedText>Very Easy</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="applicationProcessDifficulty" value="easy" checked={formData.section4.applicationProcessDifficulty === 'easy'} onChange={(e) => handleInputChange('section4', 'applicationProcessDifficulty', e.target.value as ApplicationProcessDifficulty)} />
                <TranslatedText>Easy</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="applicationProcessDifficulty" value="moderate" checked={formData.section4.applicationProcessDifficulty === 'moderate'} onChange={(e) => handleInputChange('section4', 'applicationProcessDifficulty', e.target.value as ApplicationProcessDifficulty)} />
                <TranslatedText>Moderate</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="applicationProcessDifficulty" value="difficult" checked={formData.section4.applicationProcessDifficulty === 'difficult'} onChange={(e) => handleInputChange('section4', 'applicationProcessDifficulty', e.target.value as ApplicationProcessDifficulty)} />
                <TranslatedText>Difficult</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="applicationProcessDifficulty" value="very_difficult" checked={formData.section4.applicationProcessDifficulty === 'very_difficult'} onChange={(e) => handleInputChange('section4', 'applicationProcessDifficulty', e.target.value as ApplicationProcessDifficulty)} />
                <TranslatedText>Very Difficult</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q4: Did anyone help you? */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Did anyone help you while submitting the online application?" />
            <RadioGroup>
              <RadioItem>
<Radio name="applicationHelpSource" value="department_staff" checked={formData.section4.applicationHelpSource === 'department_staff'} onChange={(e) => handleInputChange('section4', 'applicationHelpSource', e.target.value as ApplicationHelpSource)} />
                <TranslatedText>Yes – Received help from department staff</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="applicationHelpSource" value="friend_or_family" checked={formData.section4.applicationHelpSource === 'friend_or_family'} onChange={(e) => handleInputChange('section4', 'applicationHelpSource', e.target.value as ApplicationHelpSource)} />
                <TranslatedText>Yes – Received help from a friend or family member</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="applicationHelpSource" value="on_my_own" checked={formData.section4.applicationHelpSource === 'on_my_own'} onChange={(e) => handleInputChange('section4', 'applicationHelpSource', e.target.value as ApplicationHelpSource)} />
                <TranslatedText>No – Filled it on my own</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="applicationHelpSource" value="other" checked={formData.section4.applicationHelpSource === 'other'} onChange={(e) => handleInputChange('section4', 'applicationHelpSource', e.target.value as ApplicationHelpSource)} />
                <TranslatedText>Other (Please specify)</TranslatedText>
              </RadioItem>
            </RadioGroup>
            {formData.section4.applicationHelpSource === 'other' && (
              <Input type="text" value={formData.section4.applicationHelpSourceOther || ''} onChange={(e) => handleInputChange('section4', 'applicationHelpSourceOther', e.target.value)} placeholder={t('Specify who helped you')} />
            )}
          </FormGroup>
        </QuestionCard>

        {/* Q5: Time to receive benefit */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="How much time did it take to receive the scheme benefit after applying?" />
            <RadioGroup>
              <RadioItem>
<Radio name="timeToReceiveBenefit" value="less_than_3_months" checked={formData.section4.timeToReceiveBenefit === 'less_than_3_months'} onChange={(e) => handleInputChange('section4', 'timeToReceiveBenefit', e.target.value as TimeToReceiveBenefit)} />
                <TranslatedText>Less than 3 months</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="timeToReceiveBenefit" value="3_6_months" checked={formData.section4.timeToReceiveBenefit === '3_6_months'} onChange={(e) => handleInputChange('section4', 'timeToReceiveBenefit', e.target.value as TimeToReceiveBenefit)} />
                <TranslatedText>3-6 months</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="timeToReceiveBenefit" value="6_12_months" checked={formData.section4.timeToReceiveBenefit === '6_12_months'} onChange={(e) => handleInputChange('section4', 'timeToReceiveBenefit', e.target.value as TimeToReceiveBenefit)} />
                <TranslatedText>6-12 months</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="timeToReceiveBenefit" value="1_2_years" checked={formData.section4.timeToReceiveBenefit === '1_2_years'} onChange={(e) => handleInputChange('section4', 'timeToReceiveBenefit', e.target.value as TimeToReceiveBenefit)} />
                <TranslatedText>1 to 2 years</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="timeToReceiveBenefit" value="still_not_received" checked={formData.section4.timeToReceiveBenefit === 'still_not_received'} onChange={(e) => handleInputChange('section4', 'timeToReceiveBenefit', e.target.value as TimeToReceiveBenefit)} />
                <TranslatedText>Still not received</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="timeToReceiveBenefit" value="cant_remember" checked={formData.section4.timeToReceiveBenefit === 'cant_remember'} onChange={(e) => handleInputChange('section4', 'timeToReceiveBenefit', e.target.value as TimeToReceiveBenefit)} />
                <TranslatedText>Can’t remember</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q6: Overall process rating */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="How do you consider the overall process of obtaining the scheme benefit?" />
            <RadioGroup>
              <RadioItem>
<Radio name="overallProcessRating" value="very_easy" checked={formData.section4.overallProcessRating === 'very_easy'} onChange={(e) => handleInputChange('section4', 'overallProcessRating', e.target.value as OverallProcessRating)} />
                <TranslatedText>Very Easy</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="overallProcessRating" value="easy" checked={formData.section4.overallProcessRating === 'easy'} onChange={(e) => handleInputChange('section4', 'overallProcessRating', e.target.value as OverallProcessRating)} />
                <TranslatedText>Easy</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="overallProcessRating" value="moderate" checked={formData.section4.overallProcessRating === 'moderate'} onChange={(e) => handleInputChange('section4', 'overallProcessRating', e.target.value as OverallProcessRating)} />
                <TranslatedText>Moderate</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="overallProcessRating" value="difficult" checked={formData.section4.overallProcessRating === 'difficult'} onChange={(e) => handleInputChange('section4', 'overallProcessRating', e.target.value as OverallProcessRating)} />
                <TranslatedText>Difficult</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="overallProcessRating" value="very_difficult" checked={formData.section4.overallProcessRating === 'very_difficult'} onChange={(e) => handleInputChange('section4', 'overallProcessRating', e.target.value as OverallProcessRating)} />
                <TranslatedText>Very Difficult</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q7: Participated in awareness programs? */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Have you ever taken part in any awareness programs that promote intercaste harmony?" />
            <RadioGroup>
              <RadioItem>
<Radio name="participatedInAwarenessPrograms" value="yes" checked={formData.section4.participatedInAwarenessPrograms === 'yes'} onChange={(e) => handleInputChange('section4', 'participatedInAwarenessPrograms', e.target.value as YesNo)} />
                <TranslatedText>Yes</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="participatedInAwarenessPrograms" value="no" checked={formData.section4.participatedInAwarenessPrograms === 'no'} onChange={(e) => handleInputChange('section4', 'participatedInAwarenessPrograms', e.target.value as YesNo)} />
                <TranslatedText>No</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
        </QuestionCard>

        {/* Q8: Invited to speak? */}
        <QuestionCard>
          <FormGroup>
            <TranslatedLabel text="Have you ever been invited to talk or share about the problems you faced/your experience/your success story related to your marriage in any public event?" />
            <RadioGroup>
              <RadioItem>
<Radio name="invitedToSpeak" value="yes" checked={formData.section4.invitedToSpeak === 'yes'} onChange={(e) => handleInputChange('section4', 'invitedToSpeak', e.target.value as InvitedToSpeak)} />
                <TranslatedText>Yes</TranslatedText>
              </RadioItem>
              <RadioItem>
<Radio name="invitedToSpeak" value="no" checked={formData.section4.invitedToSpeak === 'no'} onChange={(e) => handleInputChange('section4', 'invitedToSpeak', e.target.value as InvitedToSpeak)} />
                <TranslatedText>No</TranslatedText>
              </RadioItem>
            </RadioGroup>
          </FormGroup>
          {formData.section4.invitedToSpeak === 'yes' && (
            <FormGroup>
              <TranslatedLabel text="If Yes, where did you share your experience? (Select all that apply):" />
              <CheckboxGroup>
                <CheckboxItem>
<Checkbox checked={formData.section4.speakingPlatforms?.includes('community_meetings')} onChange={(e) => handleCheckboxChange('section4', 'speakingPlatforms', 'community_meetings' as SpeakingPlatform, e.target.checked)} />
                  <TranslatedText>Community or village meetings (Gram Sabha)</TranslatedText>
                </CheckboxItem>
                <CheckboxItem>
<Checkbox checked={formData.section4.speakingPlatforms?.includes('school_college')} onChange={(e) => handleCheckboxChange('section4', 'speakingPlatforms', 'school_college' as SpeakingPlatform, e.target.checked)} />
                  <TranslatedText>School or college awareness programs</TranslatedText>
                </CheckboxItem>
                <CheckboxItem>
<Checkbox checked={formData.section4.speakingPlatforms?.includes('ngo_events')} onChange={(e) => handleCheckboxChange('section4', 'speakingPlatforms', 'ngo_events' as SpeakingPlatform, e.target.checked)} />
                  <TranslatedText>NGO-organized events</TranslatedText>
                </CheckboxItem>
                <CheckboxItem>
<Checkbox checked={formData.section4.speakingPlatforms?.includes('government_programs')} onChange={(e) => handleCheckboxChange('section4', 'speakingPlatforms', 'government_programs' as SpeakingPlatform, e.target.checked)} />
                  <TranslatedText>Government or official programs</TranslatedText>
                </CheckboxItem>
                <CheckboxItem>
<Checkbox checked={formData.section4.speakingPlatforms?.includes('religious_gatherings')} onChange={(e) => handleCheckboxChange('section4', 'speakingPlatforms', 'religious_gatherings' as SpeakingPlatform, e.target.checked)} />
                  <TranslatedText>Religious or cultural gatherings</TranslatedText>
                </CheckboxItem>
                <CheckboxItem>
<Checkbox checked={formData.section4.speakingPlatforms?.includes('media_interviews')} onChange={(e) => handleCheckboxChange('section4', 'speakingPlatforms', 'media_interviews' as SpeakingPlatform, e.target.checked)} />
                  <TranslatedText>Media interviews (TV, radio, newspaper)</TranslatedText>
                </CheckboxItem>
                <CheckboxItem>
<Checkbox checked={formData.section4.speakingPlatforms?.includes('other')} onChange={(e) => handleCheckboxChange('section4', 'speakingPlatforms', 'other' as SpeakingPlatform, e.target.checked)} />
                  <TranslatedText>Other (Please specify)</TranslatedText>
                </CheckboxItem>
              </CheckboxGroup>
              {formData.section4.speakingPlatforms?.includes('other') && (
                <Input type="text" value={formData.section4.speakingPlatformsOther || ''} onChange={(e) => handleInputChange('section4', 'speakingPlatformsOther', e.target.value)} placeholder={t('Specify other platform')} />
              )}
            </FormGroup>
          )}
        </QuestionCard>

      </QuestionGroup>
    </SectionContent>
  </>
)}

       {/* Section 5: Overall Satisfaction, Challenges & Recommendations */}
{currentSection === 5 && (
    <>
        <ModernSectionHeader>
            <ModernSectionTitle>{t('Section 5: Overall Satisfaction, Challenges & Recommendations')}</ModernSectionTitle>
            <ModernSectionDesc>{t('Suggestions and improvements')}</ModernSectionDesc>
        </ModernSectionHeader>
        <SectionContent>
            <QuestionGroup>

                {/* Q1: Scheme success in reducing discrimination */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="In your opinion, how successful has this scheme been in reducing caste-based discrimination?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="successInReducingDiscrimination" value="very_successful" checked={formData.section5.successInReducingDiscrimination === 'very_successful'} onChange={(e) => handleInputChange('section5', 'successInReducingDiscrimination', e.target.value)} />
                                <TranslatedText>Very Successful</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="successInReducingDiscrimination" value="successful" checked={formData.section5.successInReducingDiscrimination === 'successful'} onChange={(e) => handleInputChange('section5', 'successInReducingDiscrimination', e.target.value)} />
                                <TranslatedText>Successful</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="successInReducingDiscrimination" value="moderately_successful" checked={formData.section5.successInReducingDiscrimination === 'moderately_successful'} onChange={(e) => handleInputChange('section5', 'successInReducingDiscrimination', e.target.value)} />
                                <TranslatedText>Moderately Successful</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="successInReducingDiscrimination" value="not_successful" checked={formData.section5.successInReducingDiscrimination === 'not_successful'} onChange={(e) => handleInputChange('section5', 'successInReducingDiscrimination', e.target.value)} />
                                <TranslatedText>Not Successful</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="successInReducingDiscrimination" value="unsure" checked={formData.section5.successInReducingDiscrimination === 'unsure'} onChange={(e) => handleInputChange('section5', 'successInReducingDiscrimination', e.target.value)} />
                                <TranslatedText>Unsure</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q2: Scheme success in providing a safe attitude/security */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="In your opinion, how successful has this scheme been in providing a safe attitude to beneficiaries?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="successInProvidingSecurity" value="very_successful" checked={formData.section5.successInProvidingSecurity === 'very_successful'} onChange={(e) => handleInputChange('section5', 'successInProvidingSecurity', e.target.value)} />
                                <TranslatedText>Very Successful</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="successInProvidingSecurity" value="successful" checked={formData.section5.successInProvidingSecurity === 'successful'} onChange={(e) => handleInputChange('section5', 'successInProvidingSecurity', e.target.value)} />
                                <TranslatedText>Successful</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="successInProvidingSecurity" value="moderately_successful" checked={formData.section5.successInProvidingSecurity === 'moderately_successful'} onChange={(e) => handleInputChange('section5', 'successInProvidingSecurity', e.target.value)} />
                                <TranslatedText>Moderately Successful</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="successInProvidingSecurity" value="not_successful" checked={formData.section5.successInProvidingSecurity === 'not_successful'} onChange={(e) => handleInputChange('section5', 'successInProvidingSecurity', e.target.value)} />
                                <TranslatedText>Not Successful</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="successInProvidingSecurity" value="unsure" checked={formData.section5.successInProvidingSecurity === 'unsure'} onChange={(e) => handleInputChange('section5', 'successInProvidingSecurity', e.target.value)} />
                                <TranslatedText>Unsure</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q3: Which aspects need improvement? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Which aspects of the scheme do you think need improvement? (Select all that apply)" />
                        <CheckboxGroup>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.improvementAreas.includes('awareness_and_publicity')} onChange={(e) => handleCheckboxChange('section5', 'improvementAreas', 'awareness_and_publicity', e.target.checked)} />
                                <TranslatedText>Awareness and publicity of the scheme</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.improvementAreas.includes('clarity_of_guidelines')} onChange={(e) => handleCheckboxChange('section5', 'improvementAreas', 'clarity_of_guidelines', e.target.checked)} />
                                <TranslatedText>Clarity of guidelines and documentation to be provided</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.improvementAreas.includes('application_and_approval')} onChange={(e) => handleCheckboxChange('section5', 'improvementAreas', 'application_and_approval', e.target.checked)} />
                                <TranslatedText>Application and approval process</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.improvementAreas.includes('timely_disbursement')} onChange={(e) => handleCheckboxChange('section5', 'improvementAreas', 'timely_disbursement', e.target.checked)} />
                                <TranslatedText>Timely disbursement of funds</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.improvementAreas.includes('monitoring_and_follow_up')} onChange={(e) => handleCheckboxChange('section5', 'improvementAreas', 'monitoring_and_follow_up', e.target.checked)} />
                                <TranslatedText>Monitoring and follow-up of beneficiaries</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.improvementAreas.includes('support_services')} onChange={(e) => handleCheckboxChange('section5', 'improvementAreas', 'support_services', e.target.checked)} />
                                <TranslatedText>Support services after receiving the benefit</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.improvementAreas.includes('other')} onChange={(e) => handleCheckboxChange('section5', 'improvementAreas', 'other', e.target.checked)} />
                                <TranslatedText>Other (Please specify)</TranslatedText>
                            </CheckboxItem>
                        </CheckboxGroup>
                        {formData.section5.improvementAreas.includes('other') && (
                            <Input type="text" value={formData.section5.improvementAreasOther || ''} onChange={(e) => handleInputChange('section5', 'improvementAreasOther', e.target.value)} placeholder={t('Specify other area for improvement')} />
                        )}
                    </FormGroup>
                </QuestionCard>

                {/* Q4: Increase financial incentive? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Do you think the amount of financial incentive provided under the scheme should be increased?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="increaseIncentive" value="yes" checked={formData.section5.increaseIncentive === 'yes'} onChange={(e) => handleInputChange('section5', 'increaseIncentive', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="increaseIncentive" value="no" checked={formData.section5.increaseIncentive === 'no'} onChange={(e) => handleInputChange('section5', 'increaseIncentive', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                    {formData.section5.increaseIncentive === 'yes' && (
                        <FormGroup>
                            <TranslatedLabel text="If yes, how much? What amount should be allocated as incentive?" />
                            <Input type="text" value={formData.section5.increasedIncentiveAmount || ''} onChange={(e) => handleInputChange('section5', 'increasedIncentiveAmount', e.target.value)} placeholder={t('Specify the new amount')} />
                        </FormGroup>
                    )}
                </QuestionCard>

                {/* Q5: How has receiving this scheme helped you? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="How has receiving this scheme helped you? (Select all that apply)" />
                        <CheckboxGroup>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.schemeBenefits.includes('financial_support')} onChange={(e) => handleCheckboxChange('section5', 'schemeBenefits', 'financial_support', e.target.checked)} />
                                <TranslatedText>Financial support</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.schemeBenefits.includes('gained_asset')} onChange={(e) => handleCheckboxChange('section5', 'schemeBenefits', 'gained_asset', e.target.checked)} />
                                <TranslatedText>Gained a specific asset (e.g., land, house, business support)</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.schemeBenefits.includes('improved_social_standing')} onChange={(e) => handleCheckboxChange('section5', 'schemeBenefits', 'improved_social_standing', e.target.checked)} />
                                <TranslatedText>Improved social standing in the community</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.schemeBenefits.includes('recognition_from_society')} onChange={(e) => handleCheckboxChange('section5', 'schemeBenefits', 'recognition_from_society', e.target.checked)} />
                                <TranslatedText>Recognition or appreciation from society or officials</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.schemeBenefits.includes('reduced_discrimination')} onChange={(e) => handleCheckboxChange('section5', 'schemeBenefits', 'reduced_discrimination', e.target.checked)} />
                                <TranslatedText>Reduced social discrimination</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.schemeBenefits.includes('better_emotional_well_being')} onChange={(e) => handleCheckboxChange('section5', 'schemeBenefits', 'better_emotional_well_being', e.target.checked)} />
                                <TranslatedText>Better emotional or mental well-being</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.schemeBenefits.includes('no_change')} onChange={(e) => handleCheckboxChange('section5', 'schemeBenefits', 'no_change', e.target.checked)} />
                                <TranslatedText>No noticeable change</TranslatedText>
                            </CheckboxItem>
                        </CheckboxGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q6: Should this scheme continue? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Should this scheme continue?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="continueScheme" value="yes" checked={formData.section5.continueScheme === 'yes'} onChange={(e) => handleInputChange('section5', 'continueScheme', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="continueScheme" value="no" checked={formData.section5.continueScheme === 'no'} onChange={(e) => handleInputChange('section5', 'continueScheme', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="continueScheme" value="not_sure" checked={formData.section5.continueScheme === 'not_sure'} onChange={(e) => handleInputChange('section5', 'continueScheme', e.target.value)} />
                                <TranslatedText>Not sure</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q7: Will marriages become more accepted? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Do you think marriages supported under this scheme (such as inter-caste, widow remarriage, Devadasi children’s marriage, simple and inter-sub-caste marriages) will become more accepted in your community in the next 10 years?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="marriagesMoreAccepted" value="strongly_agree" checked={formData.section5.marriagesMoreAccepted === 'strongly_agree'} onChange={(e) => handleInputChange('section5', 'marriagesMoreAccepted', e.target.value)} />
                                <TranslatedText>Strongly Agree</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="marriagesMoreAccepted" value="agree" checked={formData.section5.marriagesMoreAccepted === 'agree'} onChange={(e) => handleInputChange('section5', 'marriagesMoreAccepted', e.target.value)} />
                                <TranslatedText>Agree</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="marriagesMoreAccepted" value="neutral" checked={formData.section5.marriagesMoreAccepted === 'neutral'} onChange={(e) => handleInputChange('section5', 'marriagesMoreAccepted', e.target.value)} />
                                <TranslatedText>Neutral</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="marriagesMoreAccepted" value="disagree" checked={formData.section5.marriagesMoreAccepted === 'disagree'} onChange={(e) => handleInputChange('section5', 'marriagesMoreAccepted', e.target.value)} />
                                <TranslatedText>Disagree</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="marriagesMoreAccepted" value="strongly_disagree" checked={formData.section5.marriagesMoreAccepted === 'strongly_disagree'} onChange={(e) => handleInputChange('section5', 'marriagesMoreAccepted', e.target.value)} />
                                <TranslatedText>Strongly Disagree</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q8: Advocate for inter-caste marriages? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="If given the opportunity, would you openly support or advocate for inter-caste marriages?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="advocateForIntercaste" value="yes" checked={formData.section5.advocateForIntercaste === 'yes'} onChange={(e) => handleInputChange('section5', 'advocateForIntercaste', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="advocateForIntercaste" value="no" checked={formData.section5.advocateForIntercaste === 'no'} onChange={(e) => handleInputChange('section5', 'advocateForIntercaste', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q9: Encourage children to marry inter-caste? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="Would you encourage your children to marry inter-caste?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="encourageChildrenIntercaste" value="yes" checked={formData.section5.encourageChildrenIntercaste === 'yes'} onChange={(e) => handleInputChange('section5', 'encourageChildrenIntercaste', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="encourageChildrenIntercaste" value="no" checked={formData.section5.encourageChildrenIntercaste === 'no'} onChange={(e) => handleInputChange('section5', 'encourageChildrenIntercaste', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="encourageChildrenIntercaste" value="not_sure" checked={formData.section5.encourageChildrenIntercaste === 'not_sure'} onChange={(e) => handleInputChange('section5', 'encourageChildrenIntercaste', e.target.value)} />
                                <TranslatedText>Not sure</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>

                {/* Q10: What kind of future support? */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="What kind of future support would you like to receive from the Government? (Select all that apply)" />
                        <CheckboxGroup>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.futureSupport.includes('legal_protection')} onChange={(e) => handleCheckboxChange('section5', 'futureSupport', 'legal_protection', e.target.checked)} />
                                <TranslatedText>Legal protection and counselling support</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.futureSupport.includes('financial_assistance')} onChange={(e) => handleCheckboxChange('section5', 'futureSupport', 'financial_assistance', e.target.checked)} />
                                <TranslatedText>Financial assistance or subsidies for economic development</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.futureSupport.includes('educational_support')} onChange={(e) => handleCheckboxChange('section5', 'futureSupport', 'educational_support', e.target.checked)} />
                                <TranslatedText>Educational support for children</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.futureSupport.includes('housing_assistance')} onChange={(e) => handleCheckboxChange('section5', 'futureSupport', 'housing_assistance', e.target.checked)} />
                                <TranslatedText>Housing assistance</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.futureSupport.includes('mental_health_services')} onChange={(e) => handleCheckboxChange('section5', 'futureSupport', 'mental_health_services', e.target.checked)} />
                                <TranslatedText>Access to mental health and well-being services</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.futureSupport.includes('skill_development')} onChange={(e) => handleCheckboxChange('section5', 'futureSupport', 'skill_development', e.target.checked)} />
                                <TranslatedText>Skill development and job training programs</TranslatedText>
                            </CheckboxItem>
                            <CheckboxItem>
                                <Checkbox checked={formData.section5.futureSupport.includes('other')} onChange={(e) => handleCheckboxChange('section5', 'futureSupport', 'other', e.target.checked)} />
                                <TranslatedText>Other (Please specify)</TranslatedText>
                            </CheckboxItem>
                        </CheckboxGroup>
                        {formData.section5.futureSupport.includes('other') && (
                            <Input type="text" value={formData.section5.futureSupportOther || ''} onChange={(e) => handleInputChange('section5', 'futureSupportOther', e.target.value)} placeholder={t('Specify other support')} />
                        )}
                    </FormGroup>
                </QuestionCard>

                {/* Q11: Improvements or suggestions */}
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="What improvements or suggestions would you like to recommend for improving this scheme?" />
                        <TextArea value={formData.section5.improvementSuggestions || ''} onChange={(e) => handleInputChange('section5', 'improvementSuggestions', e.target.value)} placeholder={t('Enter your suggestions here...')} />
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
              <ModernSectionTitle>{t('Section 6: Devadasi Children / widow Remarriage (Optional)')}</ModernSectionTitle>
              <ModernSectionDesc>{t('Special section for Devadasi children, and for widow Remarriage - Skip if not applicable')}</ModernSectionDesc>
            </ModernSectionHeader>
            <SectionContent>
              <div style={{ 
                marginBottom: '25px', 
                padding: '20px', 
                backgroundColor: '#e8f4fd', 
                borderRadius: '12px', 
                borderLeft: '5px solid #2563eb',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>ℹ️</span>
                  <strong style={{ color: '#1e40af', fontSize: '1.1rem' }}>{t('This Section is Optional')}</strong>
                </div>
                <p style={{ margin: '0', color: '#1e40af', lineHeight: '1.6' }}>
                  {t('This section is specifically designed for children of Devadasi women who have benefited from marriage incentive schemes and and for widow Remarriage.')} 
                  <strong> {t('If this doesn\'t apply to your situation, you can skip this section entirely')}</strong> {t('and proceed to submit your response.')}
                </p>
                <div style={{ marginTop: '15px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setCurrentSection(1)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500'
                    }}
                  >
                    {t('← Back to Section 1')}
                  </button>
                  <button 
                    onClick={submitForm}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      opacity: loading ? 0.6 : 1
                    }}
                  >
                    {loading ? t('Submitting...') : t('Skip & Submit Response')}
                  </button>
                </div>
              </div>

             <QuestionGroup>
    <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
        {t('A: Specific questions about the marriage of children of Ex Devadasis')}
    </h4>

    <QuestionCard>
        <FormGroup>
            <TranslatedLabel text="What was the age of the Ex-Devadasi’s son/daughter at the time of marriage?" />
            <RadioGroup>
                <RadioItem>
                    <Radio name="devadasiAgeAtMarriage" value="below_18" checked={formData.section6_Devadasi.devadasiAgeAtMarriage === 'below_18'} onChange={(e) => handleInputChange('section6_Devadasi', 'devadasiAgeAtMarriage', e.target.value)} />
                    <TranslatedText>Below 18 years</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="devadasiAgeAtMarriage" value="18_21" checked={formData.section6_Devadasi.devadasiAgeAtMarriage === '18_21'} onChange={(e) => handleInputChange('section6_Devadasi', 'devadasiAgeAtMarriage', e.target.value)} />
                    <TranslatedText>18–21 years</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="devadasiAgeAtMarriage" value="22_25" checked={formData.section6_Devadasi.devadasiAgeAtMarriage === '22_25'} onChange={(e) => handleInputChange('section6_Devadasi', 'devadasiAgeAtMarriage', e.target.value)} />
                    <TranslatedText>22–25 years</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="devadasiAgeAtMarriage" value="above_25" checked={formData.section6_Devadasi.devadasiAgeAtMarriage === 'above_25'} onChange={(e) => handleInputChange('section6_Devadasi', 'devadasiAgeAtMarriage', e.target.value)} />
                    <TranslatedText>Above 25 years</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="devadasiAgeAtMarriage" value="prefer_not_to_say" checked={formData.section6_Devadasi.devadasiAgeAtMarriage === 'prefer_not_to_say'} onChange={(e) => handleInputChange('section6_Devadasi', 'devadasiAgeAtMarriage', e.target.value)} />
                    <TranslatedText>Prefer not to say</TranslatedText>
                </RadioItem>
            </RadioGroup>
        </FormGroup>
    </QuestionCard>

    <QuestionCard>
        <FormGroup>
            <TranslatedLabel text="Do you feel the benefit improved the social dignity of the Ex Devadasi family?" />
            <RadioGroup>
                <RadioItem>
                    <Radio name="dignityImproved" value="yes" checked={formData.section6_Devadasi.dignityImproved === 'yes'} onChange={(e) => handleInputChange('section6_Devadasi', 'dignityImproved', e.target.value)} />
                    <TranslatedText>Yes</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="dignityImproved" value="no" checked={formData.section6_Devadasi.dignityImproved === 'no'} onChange={(e) => handleInputChange('section6_Devadasi', 'dignityImproved', e.target.value)} />
                    <TranslatedText>No</TranslatedText>
                </RadioItem>
            </RadioGroup>
        </FormGroup>
    </QuestionCard>

    <QuestionCard>
        <FormGroup>
            <TranslatedLabel text="Do families have any problems with the marriage of children of Ex devadasis?" />
            <RadioGroup>
                <RadioItem>
                    <Radio name="familyProblemsWithMarriage" value="strongly_agree" checked={formData.section6_Devadasi.familyProblemsWithMarriage === 'strongly_agree'} onChange={(e) => handleInputChange('section6_Devadasi', 'familyProblemsWithMarriage', e.target.value)} />
                    <TranslatedText>Strongly Agree</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="familyProblemsWithMarriage" value="agree" checked={formData.section6_Devadasi.familyProblemsWithMarriage === 'agree'} onChange={(e) => handleInputChange('section6_Devadasi', 'familyProblemsWithMarriage', e.target.value)} />
                    <TranslatedText>Agree</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="familyProblemsWithMarriage" value="neutral" checked={formData.section6_Devadasi.familyProblemsWithMarriage === 'neutral'} onChange={(e) => handleInputChange('section6_Devadasi', 'familyProblemsWithMarriage', e.target.value)} />
                    <TranslatedText>Neutral</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="familyProblemsWithMarriage" value="disagree" checked={formData.section6_Devadasi.familyProblemsWithMarriage === 'disagree'} onChange={(e) => handleInputChange('section6_Devadasi', 'familyProblemsWithMarriage', e.target.value)} />
                    <TranslatedText>Disagree</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="familyProblemsWithMarriage" value="strongly_disagree" checked={formData.section6_Devadasi.familyProblemsWithMarriage === 'strongly_disagree'} onChange={(e) => handleInputChange('section6_Devadasi', 'familyProblemsWithMarriage', e.target.value)} />
                    <TranslatedText>Strongly Disagree</TranslatedText>
                </RadioItem>
            </RadioGroup>
        </FormGroup>
    </QuestionCard>

    <QuestionCard>
        <FormGroup>
            <TranslatedLabel text="To which caste does your husband/wife belong?" />
            <Input type="text" value={formData.section6_Devadasi.spouseCaste} onChange={(e) => handleInputChange('section6_Devadasi', 'spouseCaste', e.target.value)} placeholder={t("Enter spouse's caste")} />
        </FormGroup>
    </QuestionCard>

    <QuestionCard>
        <FormGroup>
            <TranslatedLabel text="Did you or your husband/wife disclose your Devadasi background during the marriage process?" />
            <RadioGroup>
                <RadioItem>
                    <Radio name="disclosedBackground" value="yes" checked={formData.section6_Devadasi.disclosedBackground === 'yes'} onChange={(e) => handleInputChange('section6_Devadasi', 'disclosedBackground', e.target.value)} />
                    <TranslatedText>Yes</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="disclosedBackground" value="no" checked={formData.section6_Devadasi.disclosedBackground === 'no'} onChange={(e) => handleInputChange('section6_Devadasi', 'disclosedBackground', e.target.value)} />
                    <TranslatedText>No</TranslatedText>
                </RadioItem>
            </RadioGroup>
        </FormGroup>
    </QuestionCard>
    
    <QuestionCard>
        <FormGroup>
            <TranslatedLabel text="How accepting was your husband/wife’s family of your Devadasi background?" />
            <RadioGroup>
                <RadioItem>
                    <Radio name="spouseFamilyAcceptance" value="supportive" checked={formData.section6_Devadasi.spouseFamilyAcceptance === 'supportive'} onChange={(e) => handleInputChange('section6_Devadasi', 'spouseFamilyAcceptance', e.target.value)} />
                    <TranslatedText>Supportive</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="spouseFamilyAcceptance" value="opposed" checked={formData.section6_Devadasi.spouseFamilyAcceptance === 'opposed'} onChange={(e) => handleInputChange('section6_Devadasi', 'spouseFamilyAcceptance', e.target.value)} />
                    <TranslatedText>Opposed</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="spouseFamilyAcceptance" value="neutral" checked={formData.section6_Devadasi.spouseFamilyAcceptance === 'neutral'} onChange={(e) => handleInputChange('section6_Devadasi', 'spouseFamilyAcceptance', e.target.value)} />
                    <TranslatedText>Neutral</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="spouseFamilyAcceptance" value="mixed" checked={formData.section6_Devadasi.spouseFamilyAcceptance === 'mixed'} onChange={(e) => handleInputChange('section6_Devadasi', 'spouseFamilyAcceptance', e.target.value)} />
                    <TranslatedText>Mixed Reaction</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="spouseFamilyAcceptance" value="others" checked={formData.section6_Devadasi.spouseFamilyAcceptance === 'others'} onChange={(e) => handleInputChange('section6_Devadasi', 'spouseFamilyAcceptance', e.target.value)} />
                    <TranslatedText>Others</TranslatedText>
                </RadioItem>
            </RadioGroup>
        </FormGroup>
    </QuestionCard>

    <QuestionCard>
        <FormGroup>
            <TranslatedLabel text="Did you face any problems after marrying a person with Devadasi background?" />
            <RadioGroup>
                <RadioItem>
                    <Radio name="problemsAfterMarriage" value="yes" checked={formData.section6_Devadasi.problemsAfterMarriage === 'yes'} onChange={(e) => handleInputChange('section6_Devadasi', 'problemsAfterMarriage', e.target.value)} />
                    <TranslatedText>Yes</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="problemsAfterMarriage" value="no" checked={formData.section6_Devadasi.problemsAfterMarriage === 'no'} onChange={(e) => handleInputChange('section6_Devadasi', 'problemsAfterMarriage', e.target.value)} />
                    <TranslatedText>No</TranslatedText>
                </RadioItem>
            </RadioGroup>
        </FormGroup>
    </QuestionCard>
</QuestionGroup>

<QuestionGroup>
    <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
        {t(' Questions for Non-Beneficiaries / Rejected Applications')}
    </h4>

    <QuestionCard>
        <FormGroup>
            <TranslatedLabel text="Were you aware of the scheme and its benefits?" />
            <RadioGroup>
                <RadioItem>
                    <Radio name="awareOfScheme" value="yes" checked={formData.section6_NonBeneficiary.awareOfScheme === 'yes'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'awareOfScheme', e.target.value)} />
                    <TranslatedText>Yes</TranslatedText>
                </RadioItem>
                <RadioItem>
                    <Radio name="awareOfScheme" value="no" checked={formData.section6_NonBeneficiary.awareOfScheme === 'no'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'awareOfScheme', e.target.value)} />
                    <TranslatedText>No</TranslatedText>
                </RadioItem>
            </RadioGroup>
        </FormGroup>
    </QuestionCard>

    {formData.section6_NonBeneficiary.awareOfScheme === 'yes' && (
        <>
            <QuestionCard>
                <FormGroup>
                    <TranslatedLabel text="If you applied, what is the status of your application?" />
                    <RadioGroup>
                        <RadioItem>
                            <Radio name="applicationStatus" value="approved_not_received" checked={formData.section6_NonBeneficiary.applicationStatus === 'approved_not_received'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'applicationStatus', e.target.value)} />
                            <TranslatedText>Approved but benefit not received</TranslatedText>
                        </RadioItem>
                        <RadioItem>
                            <Radio name="applicationStatus" value="pending" checked={formData.section6_NonBeneficiary.applicationStatus === 'pending'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'applicationStatus', e.target.value)} />
                            <TranslatedText>Benefit still pending</TranslatedText>
                        </RadioItem>
                        <RadioItem>
                            <Radio name="applicationStatus" value="rejected" checked={formData.section6_NonBeneficiary.applicationStatus === 'rejected'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'applicationStatus', e.target.value)} />
                            <TranslatedText>Rejected</TranslatedText>
                        </RadioItem>
                    </RadioGroup>
                </FormGroup>
            </QuestionCard>

            {formData.section6_NonBeneficiary.applicationStatus === 'pending' && (
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="If your application is still pending, how long has it been pending?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="pendingDuration" value="less_than_3_months" checked={formData.section6_NonBeneficiary.pendingDuration === 'less_than_3_months'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'pendingDuration', e.target.value)} />
                                <TranslatedText>Less than 3 months</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="pendingDuration" value="3_6_months" checked={formData.section6_NonBeneficiary.pendingDuration === '3_6_months'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'pendingDuration', e.target.value)} />
                                <TranslatedText>3–6 months</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="pendingDuration" value="6_12_months" checked={formData.section6_NonBeneficiary.pendingDuration === '6_12_months'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'pendingDuration', e.target.value)} />
                                <TranslatedText>6–12 months</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="pendingDuration" value="1_2_years" checked={formData.section6_NonBeneficiary.pendingDuration === '1_2_years'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'pendingDuration', e.target.value)} />
                                <TranslatedText>1-2 year</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="pendingDuration" value="not_sure" checked={formData.section6_NonBeneficiary.pendingDuration === 'not_sure'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'pendingDuration', e.target.value)} />
                                <TranslatedText>Not sure</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                </QuestionCard>
            )}

            {formData.section6_NonBeneficiary.applicationStatus === 'rejected' && (
                <QuestionCard>
                    <FormGroup>
                        <TranslatedLabel text="If your application was rejected, were you informed about the reason?" />
                        <RadioGroup>
                            <RadioItem>
                                <Radio name="rejectionReasonCommunicated" value="yes" checked={formData.section6_NonBeneficiary.rejectionReasonCommunicated === 'yes'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'rejectionReasonCommunicated', e.target.value)} />
                                <TranslatedText>Yes</TranslatedText>
                            </RadioItem>
                            <RadioItem>
                                <Radio name="rejectionReasonCommunicated" value="no" checked={formData.section6_NonBeneficiary.rejectionReasonCommunicated === 'no'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'rejectionReasonCommunicated', e.target.value)} />
                                <TranslatedText>No</TranslatedText>
                            </RadioItem>
                        </RadioGroup>
                    </FormGroup>
                    {formData.section6_NonBeneficiary.rejectionReasonCommunicated === 'yes' && (
                        <FormGroup>
                            <TranslatedLabel text="If Yes, what was the reason for rejection?" />
                            <Input type="text" value={formData.section6_NonBeneficiary.rejectionReason || ''} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'rejectionReason', e.target.value)} placeholder={t('Specify the rejection reason')} />
                        </FormGroup>
                    )}
                </QuestionCard>
            )}
            
            <QuestionCard>
                <FormGroup>
                    <TranslatedLabel text="How do you consider the information you received from the department/officials regarding the scheme?" />
                    <RadioGroup>
                        <RadioItem>
                            <Radio name="informationQuality" value="excellent" checked={formData.section6_NonBeneficiary.informationQuality === 'excellent'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'informationQuality', e.target.value)} />
                            <TranslatedText>Excellent</TranslatedText>
                        </RadioItem>
                        <RadioItem>
                            <Radio name="informationQuality" value="good" checked={formData.section6_NonBeneficiary.informationQuality === 'good'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'informationQuality', e.target.value)} />
                            <TranslatedText>Good</TranslatedText>
                        </RadioItem>
                        <RadioItem>
                            <Radio name="informationQuality" value="fair" checked={formData.section6_NonBeneficiary.informationQuality === 'fair'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'informationQuality', e.target.value)} />
                            <TranslatedText>Fair</TranslatedText>
                        </RadioItem>
                        <RadioItem>
                            <Radio name="informationQuality" value="poor" checked={formData.section6_NonBeneficiary.informationQuality === 'poor'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'informationQuality', e.target.value)} />
                            <TranslatedText>Poor</TranslatedText>
                        </RadioItem>
                        <RadioItem>
                            <Radio name="informationQuality" value="very_poor" checked={formData.section6_NonBeneficiary.informationQuality === 'very_poor'} onChange={(e) => handleInputChange('section6_NonBeneficiary', 'informationQuality', e.target.value)} />
                            <TranslatedText>Very Poor</TranslatedText>
                        </RadioItem>
                    </RadioGroup>
                </FormGroup>
            </QuestionCard>
        </>
    )}
</QuestionGroup>
 <QuestionGroup>
        <h4 style={{ margin: '0 0 20px 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: '600' }}>
            {t('B: Questions related to widow remarriage incentive')}
        </h4>

        <QuestionCard>
            <FormGroup>
                <TranslatedLabel text="Age at the time of remarriage:" />
                <Input type="number" value={formData.section6_Widow.remarriageAge} onChange={(e) => handleInputChange('section6_Widow', 'remarriageAge', e.target.value)} placeholder={t('Enter age in years')} />
            </FormGroup>
        </QuestionCard>

        <QuestionCard>
            <FormGroup>
                <TranslatedLabel text="Did you have any children from your previous marriage?" />
                <RadioGroup>
                    <RadioItem>
                        <Radio name="childrenFromPreviousMarriage" value="yes" checked={formData.section6_Widow.childrenFromPreviousMarriage === 'yes'} onChange={(e) => handleInputChange('section6_Widow', 'childrenFromPreviousMarriage', e.target.value)} />
                        <TranslatedText>Yes</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="childrenFromPreviousMarriage" value="no" checked={formData.section6_Widow.childrenFromPreviousMarriage === 'no'} onChange={(e) => handleInputChange('section6_Widow', 'childrenFromPreviousMarriage', e.target.value)} />
                        <TranslatedText>No</TranslatedText>
                    </RadioItem>
                </RadioGroup>
            </FormGroup>
            {formData.section6_Widow.childrenFromPreviousMarriage === 'yes' && (
                <FormGroup>
                    <TranslatedLabel text="If yes, how many? Gender:" />
                    <Input type="number" value={formData.section6_Widow.childrenCount || ''} onChange={(e) => handleInputChange('section6_Widow', 'childrenCount', e.target.value)} placeholder={t('Number of children')} />
                    <RadioGroup>
                        <RadioItem>
                            <Radio name="childrenGender" value="male" checked={formData.section6_Widow.childrenGender === 'male'} onChange={(e) => handleInputChange('section6_Widow', 'childrenGender', e.target.value)} />
                            <TranslatedText>Male</TranslatedText>
                        </RadioItem>
                        <RadioItem>
                            <Radio name="childrenGender" value="female" checked={formData.section6_Widow.childrenGender === 'female'} onChange={(e) => handleInputChange('section6_Widow', 'childrenGender', e.target.value)} />
                            <TranslatedText>Female</TranslatedText>
                        </RadioItem>
                        <RadioItem>
                            <Radio name="childrenGender" value="other" checked={formData.section6_Widow.childrenGender === 'other'} onChange={(e) => handleInputChange('section6_Widow', 'childrenGender', e.target.value)} />
                            <TranslatedText>Other</TranslatedText>
                        </RadioItem>
                    </RadioGroup>
                </FormGroup>
            )}
        </QuestionCard>

        <QuestionCard>
            <FormGroup>
                <TranslatedLabel text="Does your present husband have any children from his previous marriage?" />
                <RadioGroup>
                    <RadioItem>
                        <Radio name="husbandChildrenFromPreviousMarriage" value="yes" checked={formData.section6_Widow.husbandChildrenFromPreviousMarriage === 'yes'} onChange={(e) => handleInputChange('section6_Widow', 'husbandChildrenFromPreviousMarriage', e.target.value)} />
                        <TranslatedText>Yes</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="husbandChildrenFromPreviousMarriage" value="no" checked={formData.section6_Widow.husbandChildrenFromPreviousMarriage === 'no'} onChange={(e) => handleInputChange('section6_Widow', 'husbandChildrenFromPreviousMarriage', e.target.value)} />
                        <TranslatedText>No</TranslatedText>
                    </RadioItem>
                </RadioGroup>
            </FormGroup>
            {formData.section6_Widow.husbandChildrenFromPreviousMarriage === 'yes' && (
                <FormGroup>
                    <TranslatedLabel text="If yes, how many? Gender:" />
                    <Input type="number" value={formData.section6_Widow.husbandChildrenCount || ''} onChange={(e) => handleInputChange('section6_Widow', 'husbandChildrenCount', e.target.value)} placeholder={t('Number of children')} />
                    <RadioGroup>
                        <RadioItem>
                            <Radio name="husbandChildrenGender" value="male" checked={formData.section6_Widow.husbandChildrenGender === 'male'} onChange={(e) => handleInputChange('section6_Widow', 'husbandChildrenGender', e.target.value)} />
                            <TranslatedText>Male</TranslatedText>
                        </RadioItem>
                        <RadioItem>
                            <Radio name="husbandChildrenGender" value="female" checked={formData.section6_Widow.husbandChildrenGender === 'female'} onChange={(e) => handleInputChange('section6_Widow', 'husbandChildrenGender', e.target.value)} />
                            <TranslatedText>Female</TranslatedText>
                        </RadioItem>
                        <RadioItem>
                            <Radio name="husbandChildrenGender" value="other" checked={formData.section6_Widow.husbandChildrenGender === 'other'} onChange={(e) => handleInputChange('section6_Widow', 'husbandChildrenGender', e.target.value)} />
                            <TranslatedText>Other</TranslatedText>
                        </RadioItem>
                    </RadioGroup>
                </FormGroup>
            )}
        </QuestionCard>
        
        <QuestionCard>
            <FormGroup>
                <TranslatedLabel text="What is the marital status of your present husband at the time of this marriage?" />
                <RadioGroup>
                    <RadioItem>
                        <Radio name="husbandMaritalStatus" value="widower" checked={formData.section6_Widow.husbandMaritalStatus === 'widower'} onChange={(e) => handleInputChange('section6_Widow', 'husbandMaritalStatus', e.target.value)} />
                        <TranslatedText>Widower</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="husbandMaritalStatus" value="divorcee" checked={formData.section6_Widow.husbandMaritalStatus === 'divorcee'} onChange={(e) => handleInputChange('section6_Widow', 'husbandMaritalStatus', e.target.value)} />
                        <TranslatedText>Divorcee</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="husbandMaritalStatus" value="unmarried" checked={formData.section6_Widow.husbandMaritalStatus === 'unmarried'} onChange={(e) => handleInputChange('section6_Widow', 'husbandMaritalStatus', e.target.value)} />
                        <TranslatedText>Unmarried</TranslatedText>
                    </RadioItem>
                </RadioGroup>
            </FormGroup>
        </QuestionCard>

        <QuestionCard>
            <FormGroup>
                <TranslatedLabel text="Caste of your present husband:" />
                <RadioGroup>
                    <RadioItem>
                        <Radio name="husbandCaste" value="same_as_yours" checked={formData.section6_Widow.husbandCaste === 'same_as_yours'} onChange={(e) => handleInputChange('section6_Widow', 'husbandCaste', e.target.value)} />
                        <TranslatedText>Same as yours</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="husbandCaste" value="different" checked={formData.section6_Widow.husbandCaste === 'different'} onChange={(e) => handleInputChange('section6_Widow', 'husbandCaste', e.target.value)} />
                        <TranslatedText>Different (Please specify)</TranslatedText>
                    </RadioItem>
                </RadioGroup>
                {formData.section6_Widow.husbandCaste === 'different' && (
                    <Input type="text" value={formData.section6_Widow.husbandCasteOther || ''} onChange={(e) => handleInputChange('section6_Widow', 'husbandCasteOther', e.target.value)} placeholder={t('Specify caste')} />
                )}
            </FormGroup>
        </QuestionCard>
        
        <QuestionCard>
            <FormGroup>
                <TranslatedLabel text="Did you own any property before this remarriage?" />
                <RadioGroup>
                    <RadioItem>
                        <Radio name="ownedPropertyBeforeRemarriage" value="yes" checked={formData.section6_Widow.ownedPropertyBeforeRemarriage === 'yes'} onChange={(e) => handleInputChange('section6_Widow', 'ownedPropertyBeforeRemarriage', e.target.value)} />
                        <TranslatedText>Yes</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="ownedPropertyBeforeRemarriage" value="no" checked={formData.section6_Widow.ownedPropertyBeforeRemarriage === 'no'} onChange={(e) => handleInputChange('section6_Widow', 'ownedPropertyBeforeRemarriage', e.target.value)} />
                        <TranslatedText>No</TranslatedText>
                    </RadioItem>
                </RadioGroup>
                {formData.section6_Widow.ownedPropertyBeforeRemarriage === 'yes' && (
                    <TextArea value={formData.section6_Widow.previousPropertyDetails || ''} onChange={(e) => handleInputChange('section6_Widow', 'previousPropertyDetails', e.target.value)} placeholder={t('Please specify the property')} />
                )}
            </FormGroup>
        </QuestionCard>

        <QuestionCard>
            <FormGroup>
                <TranslatedLabel text="Is there any property registered in your name after this remarriage?" />
                <RadioGroup>
                    <RadioItem>
                        <Radio name="ownedPropertyAfterRemarriage" value="yes" checked={formData.section6_Widow.ownedPropertyAfterRemarriage === 'yes'} onChange={(e) => handleInputChange('section6_Widow', 'ownedPropertyAfterRemarriage', e.target.value)} />
                        <TranslatedText>Yes</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="ownedPropertyAfterRemarriage" value="no" checked={formData.section6_Widow.ownedPropertyAfterRemarriage === 'no'} onChange={(e) => handleInputChange('section6_Widow', 'ownedPropertyAfterRemarriage', e.target.value)} />
                        <TranslatedText>No</TranslatedText>
                    </RadioItem>
                </RadioGroup>
                {formData.section6_Widow.ownedPropertyAfterRemarriage === 'yes' && (
                    <TextArea value={formData.section6_Widow.newPropertyDetails || ''} onChange={(e) => handleInputChange('section6_Widow', 'newPropertyDetails', e.target.value)} placeholder={t('Please specify the property')} />
                )}
            </FormGroup>
        </QuestionCard>

        <QuestionCard>
            <FormGroup>
                <TranslatedLabel text="What is the level of acceptability in the family you are married into?" />
                <RadioGroup>
                    <RadioItem>
                        <Radio name="familyAcceptanceScale" value="very_high" checked={formData.section6_Widow.familyAcceptanceScale === 'very_high'} onChange={(e) => handleInputChange('section6_Widow', 'familyAcceptanceScale', e.target.value)} />
                        <TranslatedText>Very High</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="familyAcceptanceScale" value="high" checked={formData.section6_Widow.familyAcceptanceScale === 'high'} onChange={(e) => handleInputChange('section6_Widow', 'familyAcceptanceScale', e.target.value)} />
                        <TranslatedText>High</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="familyAcceptanceScale" value="moderate" checked={formData.section6_Widow.familyAcceptanceScale === 'moderate'} onChange={(e) => handleInputChange('section6_Widow', 'familyAcceptanceScale', e.target.value)} />
                        <TranslatedText>Moderate</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="familyAcceptanceScale" value="low" checked={formData.section6_Widow.familyAcceptanceScale === 'low'} onChange={(e) => handleInputChange('section6_Widow', 'familyAcceptanceScale', e.target.value)} />
                        <TranslatedText>Low</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="familyAcceptanceScale" value="very_low" checked={formData.section6_Widow.familyAcceptanceScale === 'very_low'} onChange={(e) => handleInputChange('section6_Widow', 'familyAcceptanceScale', e.target.value)} />
                        <TranslatedText>Very Low</TranslatedText>
                    </RadioItem>
                </RadioGroup>
            </FormGroup>
        </QuestionCard>

        <QuestionCard>
            <FormGroup>
                <TranslatedLabel text="Have you faced stigma or discrimination from society after remarriage?" />
                <RadioGroup>
                    <RadioItem>
                        <Radio name="facedStigmaAfterRemarriage" value="yes" checked={formData.section6_Widow.facedStigmaAfterRemarriage === 'yes'} onChange={(e) => handleInputChange('section6_Widow', 'facedStigmaAfterRemarriage', e.target.value)} />
                        <TranslatedText>Yes</TranslatedText>
                    </RadioItem>
                    <RadioItem>
                        <Radio name="facedStigmaAfterRemarriage" value="no" checked={formData.section6_Widow.facedStigmaAfterRemarriage === 'no'} onChange={(e) => handleInputChange('section6_Widow', 'facedStigmaAfterRemarriage', e.target.value)} />
                        <TranslatedText>No</TranslatedText>
                    </RadioItem>
                </RadioGroup>
                {formData.section6_Widow.facedStigmaAfterRemarriage === 'yes' && (
                    <TextArea value={formData.section6_Widow.stigmaDetails || ''} onChange={(e) => handleInputChange('section6_Widow', 'stigmaDetails', e.target.value)} placeholder={t('Briefly explain the stigma or discrimination faced')} />
                )}
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