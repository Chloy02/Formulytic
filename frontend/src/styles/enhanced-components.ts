import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from './theme';

// Enhanced Keyframes
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

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Enhanced Glass Card with multiple variants
export const EnhancedGlassCard = styled(motion.div)<{ 
  variant?: 'light' | 'medium' | 'heavy' | 'colored';
  colorScheme?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  elevated?: boolean;
  interactive?: boolean;
}>`
  border-radius: ${theme.borderRadius.xl};
  border: ${theme.effects.glassBorder};
  padding: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  overflow: hidden;
  transition: all ${theme.transitions.smooth};

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
      case 'colored':
        return css`
          background: rgba(255, 255, 255, 0.9);
          ${theme.effects.glassmorphism.medium}
        `;
      default:
        return css`
          background: ${theme.colors.background.glass};
          ${theme.effects.glassmorphism.medium}
        `;
    }
  }}

  ${({ colorScheme, variant }) => variant === 'colored' && colorScheme && css`
    background: ${theme.colors[colorScheme].glassGradient};
    border: 1px solid ${theme.colors[colorScheme][200]};
  `}

  ${({ elevated }) => elevated && css`
    box-shadow: ${theme.shadows.glass};
  `}

  ${({ interactive }) => interactive && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.glassHover};
      border-color: ${theme.colors.primary[300]};
    }

    &:active {
      transform: translateY(-2px);
    }
  `}

  .dark & {
    background: ${theme.colors.background.glassDark};
    border: ${theme.effects.glassBorderDark};
  }

  /* Gradient border effect */
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

// Enhanced Button with multiple variants and animations
export const EnhancedButton = styled(motion.button)<{
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'glass' | 'gradient' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  hasIcon?: boolean;
  fullWidth?: boolean;
  glowing?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.typography.fontFamily.sans};
  font-weight: ${theme.typography.fontWeight.semibold};
  border: none;
  border-radius: ${theme.borderRadius.lg};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all ${theme.transitions.bounce};
  text-decoration: none;
  white-space: nowrap;

  ${({ size = 'md' }) => {
    switch (size) {
      case 'xs':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.xs};
          height: 28px;
        `;
      case 'sm':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.base};
          font-size: ${theme.typography.fontSize.sm};
          height: 36px;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.lg} ${theme.spacing.xl};
          font-size: ${theme.typography.fontSize.lg};
          height: 48px;
        `;
      case 'xl':
        return css`
          padding: ${theme.spacing.xl} ${theme.spacing['2xl']};
          font-size: ${theme.typography.fontSize.xl};
          height: 56px;
        `;
      default:
        return css`
          padding: ${theme.spacing.base} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
          height: 40px;
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: ${theme.colors.primary.gradient};
          color: white;
          box-shadow: ${theme.shadows.colored.primary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.gradientHover};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg}, ${theme.shadows.colored.primary};
          }
        `;
      case 'secondary':
        return css`
          background: ${theme.colors.secondary.gradient};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${theme.colors.secondary.gradientHover};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg};
          }
        `;
      case 'success':
        return css`
          background: ${theme.colors.success.gradient};
          color: white;
          box-shadow: ${theme.shadows.colored.success};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.success.gradientHover};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg}, ${theme.shadows.colored.success};
          }
        `;
      case 'error':
        return css`
          background: ${theme.colors.error.gradient};
          color: white;
          box-shadow: ${theme.shadows.colored.error};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.error.gradientHover};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg}, ${theme.shadows.colored.error};
          }
        `;
      case 'warning':
        return css`
          background: ${theme.colors.warning.gradient};
          color: white;
          box-shadow: ${theme.shadows.colored.warning};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.warning.gradientHover};
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg}, ${theme.shadows.colored.warning};
          }
        `;
      case 'glass':
        return css`
          background: ${theme.colors.background.glass};
          ${theme.effects.glassmorphism.medium}
          color: ${theme.colors.text.primary};
          border: ${theme.effects.glassBorder};
          
          &:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.9);
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.glass};
          }
        `;
      case 'gradient':
        return css`
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            transform: translateY(-2px);
            box-shadow: ${theme.shadows.lg};
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${theme.colors.primary[600]};
          border: 2px solid ${theme.colors.primary[300]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[50]};
            border-color: ${theme.colors.primary[500]};
            color: ${theme.colors.primary[700]};
            transform: translateY(-2px);
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: ${theme.colors.text.secondary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[50]};
            color: ${theme.colors.primary[600]};
          }
        `;
      default:
        return '';
    }
  }}

  ${({ glowing }) => glowing && css`
    animation: ${glow} 2s ease-in-out infinite alternate;
  `}

  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}

  ${({ isLoading }) => isLoading && css`
    cursor: not-allowed;
    opacity: 0.7;
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  /* Ripple effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::before {
    width: 300px;
    height: 300px;
  }
`;

// Enhanced Form Components
export const EnhancedFormGroup = styled.div<{ floating?: boolean }>`
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  
  ${({ floating }) => floating && css`
    margin-top: ${theme.spacing.base};
  `}
`;

export const EnhancedLabel = styled.label<{ floating?: boolean; focused?: boolean }>`
  display: block;
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.secondary};
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

export const EnhancedInput = styled.input<{ 
  hasError?: boolean; 
  isSuccess?: boolean;
  variant?: 'default' | 'glass' | 'minimal';
}>`
  width: 100%;
  padding: ${theme.spacing.base} ${theme.spacing.lg};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.borderRadius.lg};
  font-size: ${theme.typography.fontSize.base};
  background-color: white;
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

// Enhanced Card with hover effects and animations
export const EnhancedCard = styled(motion.div)<{
  variant?: 'default' | 'glass' | 'gradient' | 'elevated' | 'minimal';
  hoverable?: boolean;
  clickable?: boolean;
  borderless?: boolean;
}>`
  border-radius: ${theme.borderRadius.xl};
  padding: ${theme.spacing.xl};
  transition: all ${theme.transitions.smooth};
  position: relative;
  overflow: hidden;

  ${({ variant = 'default' }) => {
    switch (variant) {
      case 'glass':
        return css`
          background: ${theme.colors.background.glass};
          ${theme.effects.glassmorphism.medium}
          border: ${theme.effects.glassBorder};
          box-shadow: ${theme.shadows.glass};
        `;
      case 'gradient':
        return css`
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: ${theme.shadows.lg};
        `;
      case 'elevated':
        return css`
          background: white;
          box-shadow: ${theme.shadows.xl};
          border: 1px solid ${theme.colors.border.light};
        `;
      case 'minimal':
        return css`
          background: transparent;
          border: 1px solid ${theme.colors.border.light};
        `;
      default:
        return css`
          background: white;
          border: 1px solid ${theme.colors.border.light};
          box-shadow: ${theme.shadows.base};
        `;
    }
  }}

  ${({ borderless }) => borderless && css`
    border: none;
  `}

  ${({ hoverable, clickable }) => (hoverable || clickable) && css`
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.xl};
    }
  `}

  ${({ clickable }) => clickable && css`
    cursor: pointer;
    
    &:active {
      transform: translateY(-2px);
    }
  `}
`;

// Enhanced Grid System
export const EnhancedGrid = styled.div<{
  columns?: number;
  gap?: string;
  responsive?: boolean;
  autoFit?: boolean;
  minWidth?: string;
}>`
  display: grid;
  gap: ${({ gap }) => gap || theme.spacing.lg};
  
  ${({ columns, autoFit, minWidth = '280px' }) => {
    if (autoFit) {
      return css`
        grid-template-columns: repeat(auto-fit, minmax(${minWidth}, 1fr));
      `;
    }
    
    if (columns) {
      return css`
        grid-template-columns: repeat(${columns}, 1fr);
      `;
    }
    
    return css`
      grid-template-columns: repeat(auto-fit, minmax(${minWidth}, 1fr));
    `;
  }}

  ${({ responsive }) => responsive && css`
    @media (max-width: ${theme.breakpoints.sm}) {
      grid-template-columns: 1fr;
    }
    
    @media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.md}) {
      grid-template-columns: repeat(2, 1fr);
    }
  `}
`;

// Enhanced Typography
export const EnhancedHeading = styled.h1<{
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  gradient?: boolean;
  glowing?: boolean;
  center?: boolean;
}>`
  font-family: ${theme.typography.fontFamily.sans};
  font-weight: ${theme.typography.fontWeight.bold};
  line-height: ${theme.typography.lineHeight.tight};
  margin: 0 0 ${theme.spacing.base} 0;
  
  ${({ variant = 'h1' }) => {
    switch (variant) {
      case 'h1':
        return css`
          font-size: ${theme.typography.fontSize['4xl']};
          @media (max-width: ${theme.breakpoints.md}) {
            font-size: ${theme.typography.fontSize['3xl']};
          }
        `;
      case 'h2':
        return css`
          font-size: ${theme.typography.fontSize['3xl']};
          @media (max-width: ${theme.breakpoints.md}) {
            font-size: ${theme.typography.fontSize['2xl']};
          }
        `;
      case 'h3':
        return css`
          font-size: ${theme.typography.fontSize['2xl']};
          @media (max-width: ${theme.breakpoints.md}) {
            font-size: ${theme.typography.fontSize.xl};
          }
        `;
      case 'h4':
        return css`
          font-size: ${theme.typography.fontSize.xl};
        `;
      case 'h5':
        return css`
          font-size: ${theme.typography.fontSize.lg};
        `;
      case 'h6':
        return css`
          font-size: ${theme.typography.fontSize.base};
        `;
      default:
        return '';
    }
  }}

  ${({ gradient }) => gradient && css`
    background: ${theme.colors.primary.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}

  ${({ glowing }) => glowing && css`
    text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  `}

  ${({ center }) => center && css`
    text-align: center;
  `}
`;

// Enhanced Badge/Chip component
export const EnhancedBadge = styled.span<{
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${({ rounded }) => rounded ? theme.borderRadius.full : theme.borderRadius.base};
  transition: all ${theme.transitions.smooth};

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          font-size: ${theme.typography.fontSize.xs};
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.lg};
          font-size: ${theme.typography.fontSize.base};
        `;
      default:
        return css`
          padding: ${theme.spacing.xs} ${theme.spacing.base};
          font-size: ${theme.typography.fontSize.sm};
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'secondary':
        return css`
          background: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[800]};
        `;
      case 'success':
        return css`
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'error':
        return css`
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'warning':
        return css`
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'glass':
        return css`
          background: ${theme.colors.background.glass};
          ${theme.effects.glassmorphism.light}
          color: ${theme.colors.text.primary};
          border: ${theme.effects.glassBorder};
        `;
      default:
        return '';
    }
  }}
`;

// Animated Loading Spinner
export const EnhancedSpinner = styled.div<{ size?: 'sm' | 'md' | 'lg'; color?: string }>`
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          width: 16px;
          height: 16px;
          border-width: 2px;
        `;
      case 'lg':
        return css`
          width: 32px;
          height: 32px;
          border-width: 3px;
        `;
      default:
        return css`
          width: 24px;
          height: 24px;
          border-width: 2px;
        `;
    }
  }}
  
  border: ${({ color }) => color || theme.colors.primary[300]} solid;
  border-top: ${({ color }) => color || theme.colors.primary[600]} solid;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Enhanced Status Message
export const EnhancedAlert = styled(motion.div)<{
  variant?: 'info' | 'success' | 'warning' | 'error';
  dismissible?: boolean;
}>`
  padding: ${theme.spacing.base} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing.base} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  border-left: 4px solid;
  
  ${({ variant = 'info' }) => {
    switch (variant) {
      case 'success':
        return css`
          background: ${theme.colors.success[50]};
          color: ${theme.colors.success[800]};
          border-left-color: ${theme.colors.success[500]};
        `;
      case 'warning':
        return css`
          background: ${theme.colors.warning[50]};
          color: ${theme.colors.warning[800]};
          border-left-color: ${theme.colors.warning[500]};
        `;
      case 'error':
        return css`
          background: ${theme.colors.error[50]};
          color: ${theme.colors.error[800]};
          border-left-color: ${theme.colors.error[500]};
        `;
      default:
        return css`
          background: ${theme.colors.info[50]};
          color: ${theme.colors.info[800]};
          border-left-color: ${theme.colors.info[500]};
        `;
    }
  }}

  ${({ dismissible }) => dismissible && css`
    position: relative;
    padding-right: ${theme.spacing['3xl']};
  `}
`;

// Enhanced Floating Action Button
export const EnhancedFAB = styled(motion.button)<{
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}>`
  position: fixed;
  bottom: ${theme.spacing.xl};
  right: ${theme.spacing.xl};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${theme.transitions.bounce};
  box-shadow: ${theme.shadows.lg};
  z-index: 1000;

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return css`
          width: 48px;
          height: 48px;
        `;
      case 'lg':
        return css`
          width: 64px;
          height: 64px;
        `;
      default:
        return css`
          width: 56px;
          height: 56px;
        `;
    }
  }}

  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background: ${theme.colors.secondary.gradient};
          color: white;
        `;
      default:
        return css`
          background: ${theme.colors.primary.gradient};
          color: white;
        `;
    }
  }}

  &:hover {
    transform: scale(1.1);
    box-shadow: ${theme.shadows.xl};
  }

  &:active {
    transform: scale(1.05);
  }
`;
