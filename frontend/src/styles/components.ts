import styled, { css } from 'styled-components';
import { theme } from './theme';

// Base components
export const PageContainer = styled.div`
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: ${theme.colors.primary.gradient};
  display: flex;
  flex-direction: column;
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  width: 100%;
  padding: 0 ${theme.spacing.md} ${theme.spacing.xl} ${theme.spacing.md};
  margin: -${theme.spacing['2xl']} auto 0 auto;
  box-sizing: border-box;

  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-top: -${theme.spacing.xl};
  }
`;

// Glass morphism card
export const GlassCard = styled.div<{ padding?: string }>`
  background: ${theme.colors.background.glass};
  backdrop-filter: blur(20px);
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.lg};
  padding: ${props => props.padding || theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  border: 1px solid ${theme.colors.background.border};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
`;

// Typography
export const Title = styled.h1<{ size?: 'sm' | 'md' | 'lg' }>`
  font-weight: 800;
  background: ${theme.colors.primary.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${theme.spacing.sm};
  
  ${props => {
    switch (props.size) {
      case 'sm': return 'font-size: 1.5rem;';
      case 'lg': return 'font-size: 2.5rem;';
      default: return 'font-size: 2rem;';
    }
  }}

  @media (max-width: ${theme.breakpoints.tablet}) {
    font-size: ${props => props.size === 'lg' ? '2rem' : '1.5rem'};
  }
`;

export const Subtitle = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0;
`;

// Grid system
export const Grid = styled.div<{ 
  columns?: string; 
  gap?: string;
  minWidth?: string; 
}>`
  display: grid;
  grid-template-columns: ${props => props.columns || `repeat(auto-fit, minmax(${props.minWidth || '280px'}, 1fr))`};
  gap: ${props => props.gap || theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

// Buttons
const buttonBaseStyles = css`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const Button = styled.button<{ 
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}>`
  ${buttonBaseStyles}
  
  ${props => {
    const variants = {
      primary: css`
        background: ${theme.colors.primary.gradient};
        color: white;
        &:hover { box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); }
      `,
      secondary: css`
        background: ${theme.colors.secondary.gradient};
        color: white;
        &:hover { box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4); }
      `,
      success: css`
        background: ${theme.colors.success.gradient};
        color: white;
        &:hover { box-shadow: 0 5px 15px rgba(67, 233, 123, 0.4); }
      `,
      danger: css`
        background: ${theme.colors.secondary.gradient};
        color: white;
        &:hover { box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4); }
      `
    };
    return variants[props.variant || 'primary'];
  }}

  ${props => {
    switch (props.size) {
      case 'sm': return 'padding: 0.5rem 1rem; font-size: 0.875rem;';
      case 'lg': return 'padding: 1rem 2rem; font-size: 1.125rem;';
      default: return '';
    }
  }}
`;

// Form components
export const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

export const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  font-size: 0.95rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  font-size: 1rem;
  background-color: ${theme.colors.background.white};
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.border.focus};
    box-shadow: ${theme.shadows.focus};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${theme.colors.text.muted};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  font-size: 1rem;
  background-color: ${theme.colors.background.white};
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${theme.colors.border.focus};
    box-shadow: ${theme.shadows.focus};
  }
`;

// Loading spinner
export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing['2xl']};
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid ${theme.colors.border.light};
    border-top: 4px solid ${theme.colors.primary.blue};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Status message
export const StatusMessage = styled.div<{ type?: 'error' | 'success' }>`
  padding: 0.75rem 1rem;
  border-radius: ${theme.borderRadius.sm};
  margin: ${theme.spacing.md} 0;
  font-weight: 500;
  text-align: center;

  ${props => props.type === 'error' ? css`
    color: #c53030;
    background-color: #fff5f5;
    border: 1px solid #e53e3e;
  ` : css`
    color: #2f855a;
    background-color: #c6f6d5;
    border: 1px solid #38a169;
  `}
`;

// Responsive utilities
export const hideOnMobile = css`
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

export const showOnMobile = css`
  display: none;
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }
`;
