import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from './theme';

// Enhanced Keyframes for animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const glow = keyframes`
  from { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  to { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Base components with enhanced animations
export const PageContainer = styled(motion.div)`
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  background: ${theme.colors.primary.gradient};
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const ContentWrapper = styled(motion.div)`
  max-width: 1400px;
  width: 100%;
  padding: 0 ${theme.spacing.lg} ${theme.spacing.xl} ${theme.spacing.lg};
  margin: -${theme.spacing['2xl']} auto 0 auto;
  box-sizing: border-box;

  @media (max-width: ${theme.breakpoints.md}) {
    margin-top: -${theme.spacing.xl};
    padding: 0 ${theme.spacing.base} ${theme.spacing.lg} ${theme.spacing.base};
  }
`;

// Enhanced Glass morphism card with better effects
export const GlassCard = styled(motion.div)<{ 
  padding?: string;
  variant?: 'light' | 'medium' | 'heavy';
  interactive?: boolean;
}>`
  border-radius: ${theme.borderRadius.xl};
  border: ${theme.effects.glassBorder};
  padding: ${props => props.padding || theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  transition: all ${theme.transitions.smooth};
  position: relative;
  overflow: hidden;

  ${({ variant = 'medium' }) => {
    switch (variant) {
      case 'light':
        return css`
          background: ${theme.colors.background.glassLight};
          ${theme.effects.glassmorphism.light}
        `;
      case 'heavy':
        return css`
          background: rgba(255, 255, 255, 0.85);
          ${theme.effects.glassmorphism.heavy}
        `;
      default:
        return css`
          background: ${theme.colors.background.glass};
          ${theme.effects.glassmorphism.medium}
        `;
    }
  }}

  ${({ interactive }) => interactive && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.glassHover};
    }

    &:active {
      transform: translateY(-2px);
    }
  `}

  .dark & {
    background: ${theme.colors.background.glassDark};
    border: ${theme.effects.glassBorderDark};
  }

  /* Animated gradient border effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 1px;
    background: ${theme.colors.primary.gradient};
    border-radius: inherit;
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    z-index: -1;
    opacity: 0;
    transition: opacity ${theme.transitions.normal};
  }

  &:hover::before {
    opacity: 0.6;
  }
`;

// Enhanced Typography with gradient effects
export const Title = styled(motion.h1)<{ 
  size?: 'sm' | 'md' | 'lg';
  gradient?: boolean;
  glowing?: boolean;
  center?: boolean;
}>`
  font-weight: ${theme.typography.fontWeight.extrabold};
  margin-bottom: ${theme.spacing.base};
  font-family: ${theme.typography.fontFamily.sans};
  line-height: ${theme.typography.lineHeight.tight};
  
  ${({ gradient = true }) => gradient && css`
    background: ${theme.colors.primary.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}

  ${({ glowing }) => glowing && css`
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    animation: ${glow} 2s ease-in-out infinite alternate;
  `}

  ${({ center }) => center && css`
    text-align: center;
  `}
  
  ${props => {
    switch (props.size) {
      case 'sm': 
        return css`
          font-size: ${theme.typography.fontSize.xl};
          @media (max-width: ${theme.breakpoints.md}) {
            font-size: ${theme.typography.fontSize.lg};
          }
        `;
      case 'lg': 
        return css`
          font-size: ${theme.typography.fontSize['4xl']};
          @media (max-width: ${theme.breakpoints.md}) {
            font-size: ${theme.typography.fontSize['3xl']};
          }
        `;
      default: 
        return css`
          font-size: ${theme.typography.fontSize['3xl']};
          @media (max-width: ${theme.breakpoints.md}) {
            font-size: ${theme.typography.fontSize['2xl']};
          }
        `;
    }
  }}
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

// Enhanced Form components with better styling
export const FormGroup = styled(motion.div)<{ floating?: boolean }>`
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  
  ${({ floating }) => floating && css`
    margin-top: ${theme.spacing.base};
  `}
`;

export const Label = styled.label<{ floating?: boolean; focused?: boolean }>`
  display: block;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.sm};
  transition: all ${theme.transitions.smooth};
  
  ${({ floating, focused }) => floating && css`
    position: absolute;
    left: ${theme.spacing.base};
    top: ${focused ? '-8px' : '12px'};
    font-size: ${focused ? theme.typography.fontSize.xs : theme.typography.fontSize.base};
    background: white;
    padding: 0 ${theme.spacing.xs};
    z-index: 1;
    pointer-events: none;
  `}
`;

export const Input = styled.input<{ 
  hasError?: boolean; 
  isSuccess?: boolean;
  variant?: 'default' | 'glass' | 'minimal';
}>`
  width: 100%;
  padding: ${theme.spacing.base} ${theme.spacing.lg};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  background-color: ${theme.colors.background.primary};
  transition: all ${theme.transitions.smooth};
  box-sizing: border-box;
  font-family: ${theme.typography.fontFamily.sans};

  ${({ variant = 'default' }) => {
    switch (variant) {
      case 'glass':
        return css`
          background: ${theme.colors.background.glass};
          ${theme.effects.glassmorphism.light}
          border: ${theme.effects.glassBorder};
        `;
      case 'minimal':
        return css`
          border: none;
          border-bottom: 2px solid ${theme.colors.border.light};
          border-radius: 0;
          background: transparent;
          padding-left: 0;
          padding-right: 0;
        `;
      default:
        return '';
    }
  }}

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: ${theme.shadows.focus};
    transform: translateY(-1px);
  }

  ${({ hasError }) => hasError && css`
    border-color: ${theme.colors.error[500]};
    
    &:focus {
      border-color: ${theme.colors.error[600]};
      box-shadow: 0 0 0 4px ${theme.colors.error[100]};
    }
  `}

  ${({ isSuccess }) => isSuccess && css`
    border-color: ${theme.colors.success[500]};
    
    &:focus {
      border-color: ${theme.colors.success[600]};
      box-shadow: 0 0 0 4px ${theme.colors.success[100]};
    }
  `}

  &::placeholder {
    color: ${theme.colors.text.muted};
    opacity: 0.7;
  }

  &:disabled {
    background-color: ${theme.colors.gray[100]};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Select = styled.select<{
  hasError?: boolean;
  variant?: 'default' | 'glass';
}>`
  width: 100%;
  padding: ${theme.spacing.base} ${theme.spacing.lg};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  background-color: ${theme.colors.background.primary};
  transition: all ${theme.transitions.smooth};
  box-sizing: border-box;
  cursor: pointer;

  ${({ variant = 'default' }) => {
    switch (variant) {
      case 'glass':
        return css`
          background: ${theme.colors.background.glass};
          ${theme.effects.glassmorphism.light}
          border: ${theme.effects.glassBorder};
        `;
      default:
        return '';
    }
  }}

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[500]};
    box-shadow: ${theme.shadows.focus};
  }

  ${({ hasError }) => hasError && css`
    border-color: ${theme.colors.error[500]};
    
    &:focus {
      border-color: ${theme.colors.error[600]};
      box-shadow: 0 0 0 4px ${theme.colors.error[100]};
    }
  `}
`;

// Enhanced Loading spinner with multiple variants
export const LoadingSpinner = styled(motion.div)<{
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  variant?: 'default' | 'dots' | 'pulse';
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing['2xl']};
  
  ${({ size = 'md', color = theme.colors.primary[500] }) => {
    const sizes = {
      sm: '24px',
      md: '40px',
      lg: '56px'
    };
    
    return css`
      &::after {
        content: '';
        width: ${sizes[size]};
        height: ${sizes[size]};
        border: 3px solid ${theme.colors.border.light};
        border-top: 3px solid ${color};
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
    `;
  }}
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  ${({ variant }) => variant === 'pulse' && css`
    &::after {
      border: none !important;
      background: ${theme.colors.primary[500]};
      animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
  `}
`;

// Enhanced Status message with better styling
export const StatusMessage = styled(motion.div)<{ 
  type?: 'error' | 'success' | 'warning' | 'info';
  dismissible?: boolean;
}>`
  padding: ${theme.spacing.base} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.base} 0;
  font-weight: ${theme.typography.fontWeight.medium};
  text-align: center;
  border-left: 4px solid;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  animation: ${slideUp} 0.3s ease-out;

  ${props => {
    switch (props.type) {
      case 'error':
        return css`
          color: ${theme.colors.error[800]};
          background-color: ${theme.colors.error[50]};
          border-left-color: ${theme.colors.error[500]};
        `;
      case 'warning':
        return css`
          color: ${theme.colors.warning[800]};
          background-color: ${theme.colors.warning[50]};
          border-left-color: ${theme.colors.warning[500]};
        `;
      case 'info':
        return css`
          color: ${theme.colors.info[800]};
          background-color: ${theme.colors.info[50]};
          border-left-color: ${theme.colors.info[500]};
        `;
      default:
        return css`
          color: ${theme.colors.success[800]};
          background-color: ${theme.colors.success[50]};
          border-left-color: ${theme.colors.success[500]};
        `;
    }
  }}

  ${({ dismissible }) => dismissible && css`
    position: relative;
    padding-right: ${theme.spacing['3xl']};
  `}
`;

// Responsive utilities with modern breakpoints
export const hideOnMobile = css`
  @media (max-width: ${theme.breakpoints.md}) {
    display: none;
  }
`;

export const showOnMobile = css`
  display: none;
  @media (max-width: ${theme.breakpoints.md}) {
    display: block;
  }
`;

export const hideOnTablet = css`
  @media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.lg}) {
    display: none;
  }
`;

export const showOnTablet = css`
  display: none;
  @media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.lg}) {
    display: block;
  }
`;
